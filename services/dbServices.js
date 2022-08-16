const fs = require('fs/promises');
const { isValidNote } = require('../utils/validators');

module.exports = class DbServices {
  constructor(dbPath) {
    this.#dbPath = dbPath;
  }

  #dbPath;

  async writeNote(noteJSON) {
    const note = JSON.parse(noteJSON);

    if (!isValidNote(note)) {
      throw new Error('Invalid note field(s)');
    }

    const notesJSON = await fs.readFile(this.#dbPath, 'utf-8');
    const notes = JSON.parse(notesJSON);

    notes.push(note);

    const newNotesJSON = JSON.stringify(notes);
    await fs.writeFile(this.#dbPath, `${newNotesJSON}\n`);
    return noteJSON;
  }

  async getNotes(paramName = '', paramValue, count) {
    const notesJSON = await fs.readFile(this.#dbPath, 'utf-8');
    const notes = JSON.parse(notesJSON);

    const filteredNotes = notes.filter((note) => {
      if (paramName !== '') {
        return note[paramName] === paramValue;
      }
      return true;
    });
    if (filteredNotes.length === 0) {
      throw new Error('There are no records for this condition');
    }
    return filteredNotes.slice(0, count || filteredNotes.length);
  }
};
