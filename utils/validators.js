const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
const { noteSchema, emailSchema } = require('./validatorSchema');

addFormats(ajv);

const isValidNote = ajv.compile(noteSchema);
const isValidEmail = ajv.compile(emailSchema);

module.exports = {
  isValidNote,
  isValidEmail,
};
