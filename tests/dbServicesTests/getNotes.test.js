const path = require('path');
const DbServices = require('../../services/dbServices');

const dbPath = path.join('tests', 'dbServicesTests', 'testDB.json');
const dbServices = new DbServices(dbPath);

describe('Возвращаемые значения', () => {
  test('Проверка содержания объекта', async () => {
    const notes = await dbServices.getNotes('email', 'test@t.ru');
    expect(notes[0]).toMatchObject({
      email: expect.any(String),
      date: expect.any(String),
      workingHours: expect.any(Number),
      type: expect.any(String),
      comment: expect.any(String),
    });
  });
});

describe('Получение указанного количества записей', () => {
  test('Получение указанного количества записей по указанному полю и его значению', async () => {
    const notes = await dbServices.getNotes('date', '2022-08-08', 1);
    expect(notes.length).toBe(1);
  });

  test('Запрос слишком большого количества записей по указанному полю и его значению', async () => {
    const notes = await dbServices.getNotes('date', '2022-08-10', 999);
    expect(notes.length).toBe(3);
  });

  test('Запрос отрицательного количества записей по указанному полю и его значению', async () => {
    const notes = await dbServices.getNotes('date', '2022-08-10', -1);
    expect(notes.length).toBe(2);
  });

  test('Получение указанного количества записей без указания полей', async () => {
    const notes = await dbServices.getNotes('', '', 2);
    expect(notes.length).toBe(2);
  });
});

describe('Получение записей по значению поля', () => {
  test('Получение записей по указанному полю и его значению', async () => {
    const notes = await dbServices.getNotes('email', 'test@t.ru');
    expect(notes[0]).toMatchObject({ email: 'test@t.ru' });
  });

  test('Нет записей по заданному значению поля', async () => {
    expect.assertions(1);
    try {
      await dbServices.getNotes('email', 'notest@t.ru');
    } catch (error) {
      expect(error).toEqual(new Error('There are no records for this condition'));
    }
  });
});
