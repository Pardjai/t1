const path = require('path');
const CmdServices = require('../../services/cmdServices');
const DbServices = require('../../services/dbServices');

const dbPath = path.join('tests', 'dbServicesTests', 'testDB.json');
const dbServices = new DbServices(dbPath);

const cmdServices = new CmdServices(dbPath, dbServices);

describe('Проверка email', () => {
  test('Корректный email', async () => {
    const data = await cmdServices.stats('test@t.ru');
    expect(data).toMatchObject({
      stats: expect.any(Object),
      allWorkingHours: expect.any(Number),
    });
  });

  test('Некорректный email', async () => {
    expect.assertions(1);
    try {
      await cmdServices.stats('test.ru');
    } catch (err) {
      expect(err).toEqual(new Error('Invalid email'));
    }
  });

  test('Мешанина вместо email', async () => {
    expect.assertions(1);
    try {
      await cmdServices.stats('tftyfvh-9g9vjh');
    } catch (err) {
      expect(err).toEqual(new Error('Invalid email'));
    }
  });

  test('true вместо email', async () => {
    expect.assertions(1);
    try {
      await cmdServices.stats(true);
    } catch (err) {
      expect(err).toEqual(new Error('Invalid email'));
    }
  });

  test('Несуществующий email', async () => {
    expect.assertions(1);
    try {
      await cmdServices.stats('notest@t.ru');
    } catch (err) {
      expect(err).toEqual(new Error('There are no records for this condition'));
    }
  });
});
