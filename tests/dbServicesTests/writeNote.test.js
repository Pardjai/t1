const fs = require('fs/promises');
const path = require('path');
const DbServices = require('../../services/dbServices');

const dbPath = path.join('tests', 'dbServicesTests', 'testDB.json');
const dbServices = new DbServices(dbPath);

async function resetDb() {
  await fs.writeFile(
    dbPath,
    '[{"email":"test@t.ru","date":"2022-08-08","workingHours":9,"type":"vacation","comment":"Some comment"},{"email":"test@t.ru","date":"2022-08-09","workingHours":9,"type":"office","comment":"Some comment"},{"email":"test@t.ru","date":"2022-08-10","workingHours":9,"type":"office","comment":"Some comment"},{"email":"testA@t.ru","date":"2022-08-09","workingHours":9,"type":"remote","comment":"Some comment"},{"email":"testA@t.ru","date":"2022-08-10","workingHours":9,"type":"remote","comment":"Some comment"},{"email":"testB@t.ru","date":"2022-08-10","workingHours":9,"type":"remote","comment":"Some comment"},{"email":"testA@t.ru","date":"2022-08-11","workingHours":9,"type":"medical","comment":"Some comment"}]',
  );
}

afterAll(() => {
  resetDb();
});

test('Корректное значение', async () => {
  expect.assertions(1);
  const data = await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
  expect(data).toEqual('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
});

describe('Неверные входящие данные', () => {
  test('Пустой JSON', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Отсутствует название поля (email)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Неверные названия полей', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"anduin":"Bru@mail.ru","hyihiuh":"2022-08-04","workingHours":9,"type":"","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });
});

describe('Некорректный email', () => {
  test('Некорректный email (без точки)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mailru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Некорректный email (без @)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Brumail.ru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Пустой email', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });
});

describe('Корректный date', () => {
  test('Корректный date', async () => {
    expect.assertions(1);
    const data = await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
    expect(data).toEqual('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"remote","comment":"Some comment"}');
  });
});

describe('Некорректный date', () => {
  test('Некорректный date (1)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"04-08-2022","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Некорректный date (2)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022:08:04","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Некорректный date (3)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"20220408","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Некорректный date (4)', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022.08.04","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Пустой date', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"","workingHours":9,"type":"remote","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });
});

describe('Некорректный type', () => {
  test('Некорректный type', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"off","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });

  test('Пустой type', async () => {
    expect.assertions(1);
    try {
      await dbServices.writeNote('{"email":"Bru@mail.ru","date":"2022-08-04","workingHours":9,"type":"","comment":"Some comment"}');
    } catch (error) {
      expect(error).toEqual(new Error('Invalid note field(s)'));
    }
  });
});
