'use strict'
let API_ROOT = process.argv.splice(2)[0] || 'prod';
console.log(API_ROOT);
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: '"'+API_ROOT+'"'
}