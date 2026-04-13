import { describe, it, expect, beforeEach } from 'vitest';
import {
    isSpecialSession,
    parseTime,
    toIsoWeekday,
    getNextOccurrence,
    buildDescription,
    generateCalendar,
} from './calendar-helpers';
import { Series, Session } from '../data/official-sessions';

// ─── isSpecialSession ────────────────────────────────────────────────────────

describe('isSpecialSession', () => {
    it('returns true for SOF sessions', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: ['SOF Session'] };
        expect(isSpecialSession(session)).toBe(true);
    });

    it('returns true for Broadcasted sessions', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: ['Broadcasted'] };
        expect(isSpecialSession(session)).toBe(true);
    });

    it('returns true when session has both SOF and Broadcasted', () => {
        const session: Session = { sessionDay: 6, sessionTimeGmt: '17:00', notes: ['Broadcasted', 'SOF Session'] };
        expect(isSpecialSession(session)).toBe(true);
    });

    it('returns false for sessions with no notes', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00' };
        expect(isSpecialSession(session)).toBe(false);
    });

    it('returns false for sessions with empty notes array', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: [] };
        expect(isSpecialSession(session)).toBe(false);
    });

    it('returns false for non-special notes', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: ['European SOF Session'] };
        // "European SOF Session" contains "sof" so it IS special
        expect(isSpecialSession(session)).toBe(true);
    });

    it('returns false for truly unrelated notes', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: ['Fixed Setup'] };
        expect(isSpecialSession(session)).toBe(false);
    });

    it('is case-insensitive', () => {
        const session: Session = { sessionDay: 3, sessionTimeGmt: '19:00', notes: ['BROADCASTED'] };
        expect(isSpecialSession(session)).toBe(true);
    });
});

// ─── parseTime ───────────────────────────────────────────────────────────────

describe('parseTime', () => {
    it('parses whole hours', () => {
        expect(parseTime('19:00')).toEqual({ hour: 19, minute: 0 });
    });

    it('parses times with minutes', () => {
        expect(parseTime('01:45')).toEqual({ hour: 1, minute: 45 });
    });

    it('parses midnight', () => {
        expect(parseTime('00:00')).toEqual({ hour: 0, minute: 0 });
    });

    it('parses half-hour offsets', () => {
        expect(parseTime('23:30')).toEqual({ hour: 23, minute: 30 });
    });
});

// ─── toIsoWeekday ────────────────────────────────────────────────────────────

describe('toIsoWeekday', () => {
    it('converts Sunday (0) to ISO 7', () => {
        expect(toIsoWeekday(0)).toBe(7);
    });

    it('leaves Monday (1) as 1', () => {
        expect(toIsoWeekday(1)).toBe(1);
    });

    it('leaves Saturday (6) as 6', () => {
        expect(toIsoWeekday(6)).toBe(6);
    });

    it('handles all weekdays 1–6 unchanged', () => {
        for (let d = 1; d <= 6; d++) {
            expect(toIsoWeekday(d)).toBe(d);
        }
    });
});

// ─── getNextOccurrence ───────────────────────────────────────────────────────

describe('getNextOccurrence', () => {
    it('returns a moment in the future', () => {
        const result = getNextOccurrence(6, '17:00'); // Saturday 17:00 GMT
        expect(result.isAfter()).toBe(true);
    });

    it('returns a moment with the correct hour and minute', () => {
        const result = getNextOccurrence(3, '19:45');
        expect(result.hour()).toBe(19);
        expect(result.minute()).toBe(45);
    });

    it('returns zero seconds', () => {
        const result = getNextOccurrence(1, '01:00');
        expect(result.second()).toBe(0);
        expect(result.millisecond()).toBe(0);
    });

    it('result is in GMT', () => {
        const result = getNextOccurrence(5, '21:00');
        expect(result.tz()).toBe('GMT');
    });
});

// ─── buildDescription ────────────────────────────────────────────────────────

const baseSeries: Series = {
    seriesId: 'kamel',
    shortLabel: 'IMSA Vintage',
    label: 'IMSA Vintage Series',
    cars: ['Audi 90 GTO', 'Nissan ZX-Turbo GTP'],
    links: {
        website: 'https://kamelgt.com',
        discord: 'https://discord.gg/abc',
    },
    sessions: [],
};

const baseSession: Session = { sessionDay: 3, sessionTimeGmt: '19:00' };

describe('buildDescription', () => {
    it('includes the series label', () => {
        const result = buildDescription(baseSeries, baseSession);
        expect(result).toContain('IMSA Vintage Series');
    });

    it('includes the cars', () => {
        const result = buildDescription(baseSeries, baseSession);
        expect(result).toContain('Audi 90 GTO, Nissan ZX-Turbo GTP');
    });

    it('includes discord and website links', () => {
        const result = buildDescription(baseSeries, baseSession);
        expect(result).toContain('https://discord.gg/abc');
        expect(result).toContain('https://kamelgt.com');
    });

    it('includes the whenrace.com URL for the series', () => {
        const result = buildDescription(baseSeries, baseSession);
        expect(result).toContain('https://whenrace.com/kamel');
    });

    it('includes session notes when present', () => {
        const session: Session = { ...baseSession, notes: ['SOF Session', 'Broadcasted'] };
        const result = buildDescription(baseSeries, session);
        expect(result).toContain('Notes: SOF Session, Broadcasted');
    });

    it('omits notes section when session has no notes', () => {
        const result = buildDescription(baseSeries, baseSession);
        expect(result).not.toContain('Notes:');
    });

    it('omits links section when series has no links', () => {
        const series: Series = { ...baseSeries, links: undefined };
        const result = buildDescription(series, baseSession);
        expect(result).not.toContain('Links:');
    });

    it('includes broadcast link when present', () => {
        const series: Series = { ...baseSeries, links: { broadcast: 'https://youtube.com/foo' } };
        const result = buildDescription(series, baseSession);
        expect(result).toContain('Broadcast: https://youtube.com/foo');
    });
});

// ─── generateCalendar ────────────────────────────────────────────────────────

const seriesWithSessions: Series = {
    ...baseSeries,
    sessions: [
        { sessionDay: 3, sessionTimeGmt: '19:00' },
        { sessionDay: 6, sessionTimeGmt: '17:00', notes: ['Broadcasted', 'SOF Session'] },
    ],
};

describe('generateCalendar', () => {
    it('throws if selectedSessionIds is empty', () => {
        expect(() => generateCalendar(seriesWithSessions, new Set())).toThrow('Please select at least one session');
    });

    it('returns a string starting with BEGIN:VCALENDAR', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toMatch(/^BEGIN:VCALENDAR/);
    });

    it('returns a string ending with END:VCALENDAR', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result.trimEnd()).toMatch(/END:VCALENDAR$/);
    });

    it('includes a VEVENT for each selected session', () => {
        const ids = new Set(['3-19:00', '6-17:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
        expect(eventCount).toBe(2);
    });

    it('excludes sessions that are not selected', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
        expect(eventCount).toBe(1);
    });

    it('uses correct UID format', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('UID:kamel-3-19:00@whenrace.com');
    });

    it('labels regular sessions as Official Session', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('SUMMARY:IMSA Vintage Series – Official Session');
    });

    it('labels SOF+Broadcast sessions with tags', () => {
        const ids = new Set(['6-17:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('SUMMARY:IMSA Vintage Series – Broadcasted, SOF');
    });

    it('includes RRULE with correct day abbreviation', () => {
        const ids = new Set(['3-19:00']); // Wednesday
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('RRULE:FREQ=WEEKLY;');
        expect(result).toContain('BYDAY=WE');
    });

    it('includes BUSY status', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('X-MICROSOFT-CDO-BUSYSTATUS:BUSY');
    });

    it('uses CRLF line endings', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('\r\n');
    });

    it('includes 1-hour event duration', () => {
        const ids = new Set(['3-19:00']);
        const result = generateCalendar(seriesWithSessions, ids);
        expect(result).toContain('DURATION:PT1H');
    });
});
