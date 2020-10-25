# solidity-json-schema

Convert Solidity ABI into a JSON schema.

## Usage

```JavaScript
const convert = require('solidity-json-schema');

const abi = require('./PathToTruffleArtifact.json').abi;

const all = convert(abi);

const schema1 = convert(abi, {
  type: 'constructor',
  for: 'inputs',
  as: 'object'
});

// {
//   "type": "object",
//   "required": ["tokenName", "maxAmount"],
//   "properties": {
//     "tokenName": {
//       "type": "string"
//     },
//     "maxAmount": {
//       "type": "integer"
//     }
//   }
// }

const schema2 = convert(abi, {
  name: 'fiatMaximum',
  for: 'outputs',
  as: 'array'
});

// {
//   "type": "object",
//   "required": ["tokenName", "maxAmount"],
//   "properties": {
//     "tokenName": {
//       "type": "string"
//     },
//     "maxAmount": {
//       "type": "integer"
//     }
//   }
// }
```

## Known Issues

- Does not de-references imported contracts
- Not found returns undefined
