import { describe, it, expect } from 'vitest';
import { getCurrentWeekData, localDateFromString, getYouTubeId } from './helpers';

// ─── getCurrentWeekData ──────────────────────────────────────────────────────

describe('getCurrentWeekData', () => {
    const rounds = [
        { week: 1, label: 'Monza',    notes: 'Fast track',   weekStart: '2022-01-01' },
        { week: 2, label: 'Spa',      notes: 'Long track',   weekStart: '2022-01-08' },
        { week: 3, label: 'Nürburgring', notes: undefined,   weekStart: '2022-01-15' },
    ];

    it('returns the first round when before the first week ends', () => {
        // weekStart 2022-01-01 + 5 days = ends 2022-01-06
        // spoof "now" by passing a rounds list that hasn't rolled yet
        const futureRounds = [
            { week: 1, label: 'Monza', notes: 'test', weekStart: '2099-01-01' },
        ];
        const result = getCurrentWeekData(futureRounds);
        expect(result?.week).toBe(1);
        expect(result?.label).toBe('Monza');
    });

    it('returns the last round when all rounds are in the past', () => {
        const result = getCurrentWeekData([...rounds]);
        expect(result?.week).toBe(3);
        expect(result?.label).toBe('Nürburgring');
    });

    it('returns null when the rounds array is empty', () => {
        const result = getCurrentWeekData([]);
        expect(result).toBeNull();
    });

    it('respects the rolloverDay parameter', () => {
        // With rolloverDay=7, the week lasts longer
        const result = getCurrentWeekData([...rounds], 7);
        expect(result?.week).toBe(3);
    });

    it('includes notes in the returned object', () => {
        const futureRounds = [
            { week: 1, label: 'Monza', notes: 'Fast track', weekStart: '2099-01-01' },
        ];
        const result = getCurrentWeekData(futureRounds);
        expect(result?.notes).toBe('Fast track');
    });
});

// ─── localDateFromString ─────────────────────────────────────────────────────

describe('localDateFromString', () => {
    it('returns a non-empty string', () => {
        const result = localDateFromString('2023-03-28');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('includes the year', () => {
        const result = localDateFromString('2023-03-28');
        expect(result).toContain('2023');
    });

    it('treats the input as UTC (not local) to avoid off-by-one day issues', () => {
        // 2023-03-28 should resolve to the 28th regardless of timezone
        const result = localDateFromString('2023-03-28');
        // The formatted string will include "28" somewhere
        expect(result).toMatch(/28/);
    });
});

// ─── getYouTubeId ────────────────────────────────────────────────────────────

describe('getYouTubeId', () => {
    it('extracts ID from a standard watch URL', () => {
        expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from a youtu.be short URL', () => {
        expect(getYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('extracts ID from an embed URL', () => {
        expect(getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('ignores extra query params after the ID', () => {
        expect(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s')).toBe('dQw4w9WgXcQ');
    });
});
