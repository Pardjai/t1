'use strict'

const dbServices = require('./db-services')
const { isValidEmail } = require('../utils/validators')

module.exports = {

    async calculateDaysCount(email) {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email')
        }

        const stats = {
            office: 0,
            remote: 0,
            vacation: 0,
            medical: 0
        }

        try {
            const notes = await dbServices.getNotes('email', email)
            notes.forEach((noteJSON) => {
                const note = JSON.parse(noteJSON)

                const { type } = note
                stats[type] += 1
            })
            return stats
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async calculateAllWorkingHours(email) {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email');
        }

        let allWorkingHours = 0

        try {
            const notesJSON = await dbServices.getNotes('email', email)
            notesJSON.forEach((noteJSON) => {
                const note = JSON.parse(noteJSON)

                const { workingHours } = note
                allWorkingHours += workingHours
            })

            return allWorkingHours
        } catch (err) {
            throw new Error(err.message)
        }
    },

}