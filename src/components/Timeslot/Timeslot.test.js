import timezone_mock from 'timezone-mock'
import {nextRaceDay} from '../../helpers'

let summerRaceTime = ''
let winterRaceTime = ''

// At a bare minimum it should be able to tell if it's this week or next
// this helps with the tricky weeks when DST rolls over.
// This Saturday's race time is not always next Saturday's race time!
describe('general date calculations', () => {
    it('returns next Saturday if after this Saturday', () => {
        let result = nextRaceDay(6, '15:00', '2022-08-01 12:00').toString()
        let expected = new Date('2022-08-06 15:00 GMT').toString()
        expect(result).toBe(expected)
    });

    it('returns this Wednesday if before this Wednesday', () => {
        let result = nextRaceDay(3, '17:00', '2022-08-15 23:00').toString()
        let expected = new Date('2022-08-17 17:00 GMT').toString()
        expect(result).toBe(expected)
    });
})

// BST is a good test
describe('British Summer Time for Saturday race', () => {
    beforeAll(() => {
        summerRaceTime = '18:00'
        winterRaceTime = '17:00'
    });

    it('has an offset after March 13th', () => {
        timezone_mock.register('Europe/London')
        let result = nextRaceDay(6, '17:00', '2022-07-01 12:00').toString()
        let expected = new Date(`2022-07-02 ${summerRaceTime}`).toString()
        expect(result).toBe(expected)
    });

    it('has no offset after October 30th', () => {
        timezone_mock.register('Europe/London')
        let result = nextRaceDay(6, '17:00', '2022-11-03 12:00').toString()
        let expected = new Date(`2022-11-05 ${winterRaceTime}`).toString()
        expect(result).toBe(expected)
    });
})

// US is easy for Jamie to visualize and mentally test
describe('US (Pacific) Daylight Saving Time for Saturday race', () => {
    beforeAll(() => {
        summerRaceTime = '10:00'
        winterRaceTime = '09:00'
    });

    it('has an offset after March 13th', () => {
        timezone_mock.register('US/Pacific')
        let result = nextRaceDay(6, '17:00', '2022-07-01 00:00').toString()
        let expected = new Date(`2022-07-02 ${summerRaceTime}`).toString()
        expect(result).toBe(expected)
    });

    it('has no offset after November 6th', () => {
        timezone_mock.register('US/Pacific')
        let result = nextRaceDay(6, '17:00', '2022-11-07 05:00').toString()
        let expected = new Date(`2022-11-12 ${winterRaceTime}`).toString()
        expect(result).toBe(expected)
    });
})

// Adelaide has a :30 offset and moves the other way in winter!
// also... the timezone_mock supports it and a few others only.
describe('Adelaide Daylight Saving Time for Saturday race', () => {
    beforeAll(() => {
        summerRaceTime = '02:30'
        winterRaceTime = '03:30'
    });

    it('has an offset after April 3rd', () => {
        timezone_mock.register('Australia/Adelaide')
        let result = nextRaceDay(6, '17:00', '2022-06-01 12:00').toString()
        let expected = new Date(`2022-06-05 ${summerRaceTime}`).toString()
        expect(result).toBe(expected)
    });

    it('has no offset after October 2nd', () => {
        timezone_mock.register('Australia/Adelaide')
        let result = nextRaceDay(6, '17:00', '2022-10-07 00:00').toString()
        let expected = new Date(`2022-10-09 ${winterRaceTime}`).toString()
        expect(result).toBe(expected)
    });
})