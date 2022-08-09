'use strict'

const validators = require('../utils/validators')
const fs = require('fs/promises')
const path = require('path')

const db_path = path.join('db.json')

module.exports = {

    async writeNote(noteJSON) {
        if (!validators.isValidNote(noteJSON)) {
            throw new Error('Invalid note field(s)')
        }

        let notesJSON = await fs.readFile(db_path, 'utf-8')
        const notes = JSON.parse(notesJSON)

        notes.push(noteJSON)

        notesJSON = JSON.stringify(notes)
        await fs.writeFile(db_path, notesJSON)
        return noteJSON
    },

    async getNotes(paramName = '', paramValue, count) {
        const notesJSON = await fs.readFile(db_path, 'utf-8')
        const notes = JSON.parse(notesJSON)

        const filteredNotes = notes.filter((noteJSON) => {
            const note = JSON.parse(noteJSON)
            if (paramName !== '') {
                return note[paramName] === paramValue
            } else {
                return true
            }
        })
        if (filteredNotes.length === 0) {
            throw new Error('There are no records for this condition')
        }
        return filteredNotes.slice(0, count || filteredNotes.length)
    }
}