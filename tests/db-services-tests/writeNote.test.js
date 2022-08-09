'use strict'

const { writeNote } = require('../../services/db-services')
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

fs.writeFile.mockReturnValue(Promise.resolve())

//=============================================================================================================================================================


test('Корректное значение', async () => {
    expect.assertions(1);
    const data = await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
    expect(data).toEqual("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
})

describe('Неверные входящие данные', () => {
    test('Пустой JSON', async () => {
        expect.assertions(1);
        try {
            await writeNote("{}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Отсутствует название поля (email)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Неверные названия полей', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"anduin\":\"Bru@mail.ru\",\"hyihiuh\":\"04-08-2022\",\"workingHours\":9,\"type\":\"\",\"comment\":\"Some comment\"}");
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })
})

describe('Некорректный email', () => {
    test('Некорректный email (без доменной зоны)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mailru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Некорректный email (без @)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Brumail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Пустой email', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })
})

describe('Корректный date', () => {
    test('Корректный date (1)', async () => {
        expect.assertions(1);
        const data = await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        expect(data).toEqual("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}");
    })

    test('Корректный date (2)', async () => {
        expect.assertions(1);
        const data = await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"4-8-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        expect(data).toEqual("{\"email\":\"Bru@mail.ru\",\"date\":\"4-8-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}");
    })

    test('Корректный date (3)', async () => {
        expect.assertions(1);
        const data = await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04/08/2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        expect(data).toEqual("{\"email\":\"Bru@mail.ru\",\"date\":\"04/08/2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}");
    })
})

describe('Некорректный date', () => {
    test('Некорректный date (1)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04:08:2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Некорректный date (2)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"408-2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Некорректный date (3)', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04.08.2022\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Пустой date', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"\",\"workingHours\":9,\"type\":\"remote\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })
})

describe('Некорректный type', () => {
    test('Некорректный type', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"off\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })

    test('Пустой type', async () => {
        expect.assertions(1);
        try {
            await writeNote("{\"email\":\"Bru@mail.ru\",\"date\":\"04-08-2022\",\"workingHours\":9,\"type\":\"\",\"comment\":\"Some comment\"}")
        } catch (error) {
            expect(error).toEqual(new Error('Invalid note field(s)'));
        }
    })
})

