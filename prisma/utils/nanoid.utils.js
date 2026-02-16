const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789', 20);

module.exports = nanoid;
