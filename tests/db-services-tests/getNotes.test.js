'use strict'

const { getNotes } = require('../../services/db-services')
const fs = require('fs/promises')

jest.mock('fs/promises')

fs.readFile.mockReturnValue(Promise.resolve(
    JSON.stringify([
        '{"email":"test@t.ru","date":"08-08-2022","workingHours":9,"type":"vacation","comment":"Some comment"}',
        '{"email":"test@t.ru","date":"09-08-2022","workingHours":9,"type":"office","comment":"Some comment"}',
        '{"email":"test@t.ru","date":"10-08-2022","workingHours":9,"type":"office","comment":"Some comment"}',
        '{"email":"testA@t.ru","date":"09-08-2022","workingHours":9,"type":"remote","comment":"Some comment"}',
        '{"email":"testA@t.ru","date":"10-08-2022","workingHours":9,"type":"remote","comment":"Some comment"}',
        '{"email":"testB@t.ru","date":"10-08-2022","workingHours":9,"type":"remote","comment":"Some comment"}',
        '{"email":"testA@t.ru","date":"11-08-2022","workingHours":9,"type":"medical","comment":"Some comment"}',
        '{"email":"test@t.ru","date":"11-08-2022","workingHours":9,"type":"remote","comment":"Some comment"}',
    ])
))

//=============================================================================================================================================================

describe('Возвращаемые значения', () => {
    test('Проверка содержания объекта', async () => {
        const notes = await getNotes('email', 'test@t.ru')
        expect(typeof (notes[0])).toEqual('string')
    })

    test('Проверка строения JSON-объектов', async () => {
        const notes = await getNotes('email', 'test@t.ru')
        const note = JSON.parse(notes[0])
        expect(note).toEqual(expect.objectContaining({
            email: expect.any(String),
            date: expect.any(String),
            workingHours: expect.any(Number),
            type: expect.any(String),
            comment: expect.any(String),
        }))
    })
})

describe('Получение указанного количества записей', () => {
    test('Получение указанного количества записей по указанному полю и его значению', async () => {
        const notes = await getNotes('date', '08-08-2022', 1)
        expect(notes.length).toBe(1)
    })

    test('Запрос слишком большого количества записей по указанному полю и его значению', async () => {
        const notes = await getNotes('date', '10-08-2022', 999)
        expect(notes.length).toBe(3)
    })

    test('Запрос отрицательного количества записей по указанному полю и его значению', async () => {
        const notes = await getNotes('date', '10-08-2022', -1)
        expect(notes.length).toBe(2)
    })

    test('Получение указанного количества записей без указания полей', async () => {
        const notes = await getNotes('', '', 2)
        expect(notes.length).toBe(2)
    })
})

describe('Получение записей по значению поля', () => {
    test('Получение записей по указанному полю и его значению', async () => {
        const notes = await getNotes('email', 'test@t.ru')
        expect(notes[0]).toEqual('{"email":"test@t.ru","date":"08-08-2022","workingHours":9,"type":"vacation","comment":"Some comment"}')
    })

    test('Нет записей по заданному значению поля', async () => {
        expect.assertions(1);
        try {
            await getNotes('email', 'notest@t.ru')
        } catch (error) {
            expect(error).toEqual(new Error('There are no records for this condition'));
        }
    })
})
