'use strict'

const { calculateDaysCount } = require('../../services/cmd-services')
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

describe('Проверка email', () => {
    test('Корректный email', async () => {
        const data = await calculateDaysCount('test@t.ru')
        expect(data).toEqual(expect.objectContaining({
            office: expect.any(Number),
            remote: expect.any(Number),
            vacation: expect.any(Number),
            medical: expect.any(Number),
        }))
    })

    test('Некорректный email', async () => {
        try {
            const data = await calculateDaysCount('test@t.t')
        } catch (err) {
            expect(err).toEqual(new Error('Invalid email'))
        }
    })

    test('Мешанина вместо email', async () => {
        try {
            const data = await calculateDaysCount('tftyfvh-9g9vjh')
        } catch (err) {
            expect(err).toEqual(new Error('Invalid email'))
        }
    })

    test('true вместо email', async () => {
        try {
            const data = await calculateDaysCount(true)
        } catch (err) {
            expect(err).toEqual(new Error('Invalid email'))
        }
    })

    test('Несуществующий email', async () => {
        try {
            const data = await calculateDaysCount('notest@t.ru')
        } catch (err) {
            expect(err).toEqual(new Error('There are no records for this condition'))
        }
    })
})

