'use strict';

const merge = require('merge');

const types = {
  // uint, int: synonyms for uint256, int256 respectively. For computing the function selector, uint256 and int256 have to be used.
  int: {
    // 'int256'
    type: 'integer',
    // TODO: max size
  },
  uint: {
    // 'uint256',
    type: 'integer',
  },

  // address: equivalent to uint160, except for the assumed interpretation and language typing.
  address: {
    type: 'string',
    pattern: '0x[a-fA-F0-9]{40}',
  },

  // fixed, ufixed: synonyms for fixed128x18, ufixed128x18
  fixed: {
    // fixed128x18
    type: 'number',
  },
  ufixed: {
    // ufixed128x18
    type: 'number',
  },

  bytes: {
    // bytes
    type: 'string',
  },

  // bool: equivalent to uint8 restricted to the values 0 and 1. For computing the function selector, bool is used.
  bool: {
    type: 'boolean',
  },

  string: {
    type: 'string',
  },
};

const typesRegex = {
  '^int\\d{1,3}$': types.int,
  '^uint\\d{1,3}$': types.uint,
  '^fixed\\d{1,3}x\\d{1,2}': types.fixed,
  '^ufixed\\d{1,3}x\\d{1,2}': types.ufixed,
  '^bytes\\d{1,3}': types.bytes,
};

function mapType(type) {
  const mapped = types[type];
  if (mapped) {
    return merge(true, mapped);
  }

  for (let pattern in typesRegex) {
    const exp = new RegExp(pattern);
    if (exp.test(type)) {
      return merge(true, typesRegex[pattern]);
    }
  }
  throw new Error(`Unsupported type: ${type}`);
}

function nameForNode(node) {
  if (node.type && node.name) {
    return 'constructor' === node.type ? node.type : node.name;
  }
  return node.type;
}

function mapNode(node, options) {
  options = options || {};
  options.as = options.as || 'array';

  function buildAs(subNode, property, as) {
    let schema;
    let adder;

    if ('object' === as) {
      // as object
      schema = {
        type: 'object',
        required: [],
        properties: {},
      };
      adder = (subSchema, name) => {
        schema.properties[name] = subSchema;
        schema.required.push(name);
      };
    } else if ('array' === as) {
      // as array
      schema = {
        type: 'array',
        items: [],
      };
      adder = (subSchema, name) => {
        subSchema.description = name;
        schema.items.push(subSchema);
      };
    } else {
      throw new Error(`Unsupported argument 'as': ${options.as}`);
    }

    const source = subNode[property];
    if (!Array.isArray(source)) {
      return schema;
    }
    source.forEach(subNode => {
      const subSchema = mapType(subNode.type);
      if (!subSchema) {
        // ignore this property
        return;
      }
      const name = nameForNode(subNode);
      const description = `${subNode.type} ${name}`;
      subSchema.description = description;
      adder(subSchema, name);
    });
    return schema;
  }

  if (options.for) {
    return buildAs(node, options.for, options.as);
  }

  const schema = {
    type: 'object',
    properties: {},
  };
  schema.properties.inputs = buildAs(node, 'inputs', options.as);
  schema.properties.outputs = buildAs(node, 'outputs', options.as);
  return schema;
}

function convert(abi, options) {
  options = options || {};

  // special case - find constructor
  // do this seperately to keep the others fast
  if ('constructor' === options.type || 'constructor' === options.name) {
    let schema;
    abi.forEach(function (node) {
      if ('constructor' !== node.type) {
        return;
      }
      schema = mapNode(node, options);
    });
    return schema;
  }

  // filter by type
  if (options.type) {
    const schema = {
      type: 'object',
      properties: {},
    };
    abi.forEach(function (node) {
      if (options.type !== node.type && 'constructor' !== node.type) {
        return;
      }
      const subSchema = mapNode(node, options);
      const name = nameForNode(node);
      subSchema.description = `${node.type} ${name}`;
      schema.properties[name] = subSchema;
    });
    return schema;
  }

  // find by name
  if (options.name) {
    let schema;
    abi.forEach(function (node) {
      if (options.name !== node.name) {
        return;
      }
      schema = mapNode(node, options);
    });
    return schema;
  }

  const schema = {
    type: 'object',
    properties: {},
  };
  abi.forEach(function (node) {
    const name = nameForNode(node);
    schema.properties[name] = mapNode(node, options);
  });

  return schema;
}

module.exports = convert;
