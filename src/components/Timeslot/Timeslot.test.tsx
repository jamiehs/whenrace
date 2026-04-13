import timezone_mock from 'timezone-mock'
import { render, screen, within } from '@testing-library/react'
import { nextRaceDay } from '../../helpers'
import Timeslot from './Timeslot'

// ─── nextRaceDay (existing unit tests) ───────────────────────────────────────

let summerRaceTime = ''
let winterRaceTime = ''

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

    afterAll(() => {
        // timezone_mock patches the global Date object — always unregister
        // after the last describe block that uses it, or it leaks into
        // subsequent tests and causes hard-to-diagnose failures.
        timezone_mock.unregister()
    });
})

// ─── Timeslot component ───────────────────────────────────────────────────────
//
// We focus on the GMT display (always stable) rather than the local time
// display (depends on the system timezone at test runtime).

describe('Timeslot', () => {
    // Helper: finds the GMT section container so we can scope queries to it.
    // The local time section often shows the same day name, so searching the
    // whole document with getByText(/Wednesday/) would find two elements and
    // throw. within() narrows the search to one specific subtree.
    const getGmtSection = () => screen.getByText('GMT').closest('.date-gmt')!

    it('renders the GMT label', () => {
        render(<Timeslot dayIndex={3} time="19:00" />)
        // This one IS unique — "GMT" only appears once — so no within() needed.
        expect(screen.getByText('GMT')).toBeInTheDocument()
    })

    it('renders the GMT day name', () => {
        render(<Timeslot dayIndex={3} time="19:00" />)
        expect(within(getGmtSection()).getByText(/Wednesday/)).toBeInTheDocument()
    })

    it('renders the GMT time', () => {
        render(<Timeslot dayIndex={3} time="19:00" />)
        expect(within(getGmtSection()).getByText(/19:00/)).toBeInTheDocument()
    })

    it('renders Saturday for dayIndex 6', () => {
        render(<Timeslot dayIndex={6} time="03:00" />)
        expect(within(getGmtSection()).getByText(/Saturday/)).toBeInTheDocument()
    })

    it('renders Sunday for dayIndex 0', () => {
        render(<Timeslot dayIndex={0} time="09:00" />)
        expect(within(getGmtSection()).getByText(/Sunday/)).toBeInTheDocument()
    })

    // Testing that something is NOT rendered uses queryByText instead of
    // getByText. queryByText returns null when nothing is found (rather than
    // throwing), so we can assert on that null with toBeNull().
    it('renders no notes section when notes prop is absent', () => {
        render(<Timeslot dayIndex={3} time="19:00" />)
        expect(screen.queryByText('SOF Session')).toBeNull()
    })

    it('renders notes when provided', () => {
        render(<Timeslot dayIndex={6} time="17:00" notes={['Broadcasted', 'SOF Session']} />)
        expect(screen.getByText('Broadcasted')).toBeInTheDocument()
        expect(screen.getByText('SOF Session')).toBeInTheDocument()
    })
})
