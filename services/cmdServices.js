const { isValidEmail } = require('../utils/validators');

module.exports = class CmdServices {
  constructor(dbPath, DbServices) {
    this.#dbPath = dbPath;
    this.#dbServices = DbServices;
  }

  #dbPath;

  #dbServices;

  async stats(email) {
    if (!isValidEmail(email)) {
      throw new Error('Invalid email');
    }

    const stats = {
      office: 0,
      remote: 0,
      vacation: 0,
      medical: 0,
    };

    let allWorkingHours = 0;

    try {
      const notes = await this.#dbServices.getNotes('email', email);
      notes.forEach((note) => {
        const { type, workingHours } = note;
        stats[type] += 1;
        allWorkingHours += workingHours;
      });
      return { stats, allWorkingHours };
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
