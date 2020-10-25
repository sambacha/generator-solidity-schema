'use strict';

const util = require('util');
const test = require('tape');

const convert = require('./index');

const {abi} = require('./node_modules/openzeppelin-solidity/build/contracts/AllowanceCrowdsale.json');
const output = JSON.stringify(convert(abi, {
  as: 'array',
  for: 'inputs',
  type: 'constructor',
}),);
console.log(output);
