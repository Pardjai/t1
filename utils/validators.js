'use strict'

const { VALID_TYPES } = require('../consts/consts')

module.exports = {
    isValidEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    },

    isValidDate(date) {
        return String(date).match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
    },

    isValidWorkingHours(hours) {
        return !isNaN(Number(hours));
    },

    isValidJobType(type) {
        return VALID_TYPES.includes(type);
    },

    isValidNote(noteJSON) {
        const note = JSON.parse(noteJSON);

        const isValid =
            this.isValidEmail(note.email) &&
            this.isValidDate(note.date) &&
            this.isValidWorkingHours(note.workingHours) &&
            this.isValidJobType(note.type);
        return isValid;
    }
}
