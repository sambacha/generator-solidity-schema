'use strict';

const util = require('util');
const test = require('tape');

const convert = require('./index');

test('ERC20', {objectPrintDepth: 20}, function (t) {
  const {abi} = require('./node_modules/openzeppelin-solidity/build/contracts/ERC20.json');

  const expected = require('./test/ERC20');
  const actual = convert(abi);
  t.deepEqual(actual, expected, 'Converts all function inputs and outputs without options');

  const expected2 = require('./test/ERC20-as-object.json');
  const actual2 = convert(abi, {
    as: 'object',
  });
  t.deepEqual(actual2, expected2, 'Converts all function inputs and outputs as object');

  const expected3 = require('./test/ERC20-inputs-as-array.json');
  const actual3 = convert(abi, {
    as: 'array',
    for: 'inputs',
  });
  t.deepEqual(actual3, expected3, 'Converts all function inputs only as array');

  const expected4 = require('./test/ERC20-outputs-as-object.json');
  const actual4 = convert(abi, {
    as: 'object',
    for: 'outputs',
  });
  t.deepEqual(actual4, expected4, 'Converts all function outputs only as array');

  t.end();
});

test('AllowanceCrowdsale', {objectPrintDepth: 20}, function (t) {
  const {abi} = require('./node_modules/openzeppelin-solidity/build/contracts/AllowanceCrowdsale.json');

  const expected = require('./test/AllowanceCrowdsale-constructor-inputs-as-object.json');
  const actual = convert(abi, {
    as: 'object',
    for: 'inputs',
    name: 'constructor',
  });
  t.deepEqual(actual, expected, 'Converts constructor function inputs as object');
  const actual2 = convert(abi, {
    as: 'object',
    for: 'inputs',
    type: 'constructor',
  });
  t.deepEqual(actual2, expected, 'Converts constructor function inputs when specified as type');

  const expected3 = require('./test/AllowanceCrowdsale-constructor-inputs-as-array.json');
  const actual3 = convert(abi, {
    as: 'array',
    for: 'inputs',
    type: 'constructor',
  });
  t.deepEqual(actual3, expected3, 'Converts constructor function inputs to array');

  t.end();
});
