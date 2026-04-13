import moment from 'moment-timezone';
import { Series, Session } from '../data/official-sessions';

// ICS format constants
const ICAL_DAY_MAP = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const EVENT_DURATION = 'PT1H'; // 1 hour in ISO 8601 duration format
const CALENDAR_REPEAT_YEARS = 1;

/**
 * Generates a unique identifier for a session
 */
export const getSessionId = (session: Session): string => `${session.sessionDay}-${session.sessionTimeGmt}`;

/**
 * Gets special tags for a session (Broadcasted, SOF)
 */
export const getSessionTags = (session: Session): string[] => {
    const tags: string[] = [];
    if (!session.notes) return tags;

    const hasBroadcasted = session.notes.some(note => note.toLowerCase().includes('broadcasted'));
    const hasSOF = session.notes.some(note => note.toLowerCase().includes('sof'));

    if (hasBroadcasted) tags.push('Broadcasted');
    if (hasSOF) tags.push('SOF');

    return tags;
};

/**
 * Checks if a session is marked as special (Broadcasted or SOF)
 */
export const isSpecialSession = (session: Session): boolean => {
    return getSessionTags(session).length > 0;
};

/**
 * Parses time string into hour and minute components
 */
export const parseTime = (timeString: string): { hour: number; minute: number } => {
    const [hour, minute] = timeString.split(':').map(Number);
    return { hour, minute };
};

/**
 * Converts day of week to ISO weekday format (Sunday: 0→7)
 */
export const toIsoWeekday = (day: number): number => day === 0 ? 7 : day;

/**
 * Calculates the next occurrence of a weekly session
 */
export const getNextOccurrence = (sessionDay: number, sessionTime: string): moment.Moment => {
    const now = moment.tz('GMT');
    const { hour, minute } = parseTime(sessionTime);

    const next = now.clone()
        .isoWeekday(toIsoWeekday(sessionDay))
        .hour(hour)
        .minute(minute)
        .second(0)
        .millisecond(0);

    if (next.isBefore(now)) {
        next.add(1, 'week');
    }

    return next;
};

/**
 * Builds the event description text for ICS calendar
 */
export const buildDescription = (series: Series, session: Session): string => {
    const parts: string[] = [];

    parts.push(series.label);
    parts.push(`Cars: ${series.cars.join(', ')}`);

    if (session.notes && session.notes.length > 0) {
        parts.push(`Notes: ${session.notes.join(', ')}`);
    }

    if (series.links) {
        const links = ['Links:'];
        if (series.links.discord) links.push(`Discord: ${series.links.discord}`);
        if (series.links.website) links.push(`Website: ${series.links.website}`);
        if (series.links.broadcast) links.push(`Broadcast: ${series.links.broadcast}`);
        parts.push(links.join('\n'));
    }

    parts.push(`Full schedule: https://whenrace.com/${series.seriesId}`);

    return parts.join('\n\n');
};

/**
 * Generates an ICS calendar file content for selected sessions
 * @throws {Error} If no sessions are selected
 */
export const generateCalendar = (series: Series, selectedSessionIds: Set<string>): string => {
    if (!selectedSessionIds || selectedSessionIds.size === 0) {
        throw new Error('Please select at least one session');
    }

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:whenrace.com',
        'METHOD:PUBLISH',
        'X-PUBLISHED-TTL:PT1H'
    ];

    // Set calendar to repeat for the configured duration
    const untilDate = moment.tz('GMT').add(CALENDAR_REPEAT_YEARS, 'year');

    series.sessions.forEach((session) => {
        if (!selectedSessionIds.has(getSessionId(session))) return;

        const startMoment = getNextOccurrence(session.sessionDay, session.sessionTimeGmt);

        // Build event name with special session indicators
        const tags = getSessionTags(session);
        const suffix = tags.length > 0 ? tags.join(', ') : 'Official Session';
        const eventName = `${series.label} – ${suffix}`;

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${series.seriesId}-${getSessionId(session)}@whenrace.com`);
        lines.push(`SUMMARY:${eventName}`);
        lines.push(`DTSTAMP:${moment().format('YYYYMMDDTHHmmss')}Z`);
        lines.push(`DTSTART:${startMoment.format('YYYYMMDDTHHmmss')}Z`);
        lines.push(`DESCRIPTION:${buildDescription(series, session).replace(/\n/g, '\\n')}`);
        lines.push(`URL:https://whenrace.com/${series.seriesId}`);
        lines.push('STATUS:CONFIRMED');
        lines.push('CATEGORIES:iRacing,Sim Racing');
        lines.push('X-MICROSOFT-CDO-BUSYSTATUS:BUSY');
        lines.push(`RRULE:FREQ=WEEKLY;UNTIL=${untilDate.format('YYYYMMDDTHHmmss')}Z;BYDAY=${ICAL_DAY_MAP[session.sessionDay]}`);
        lines.push(`DURATION:${EVENT_DURATION}`);
        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');

    return lines.join('\r\n');
};

/**
 * Generates and downloads an ICS calendar file for selected sessions
 * @throws {Error} If calendar generation or download fails
 */
export const downloadCalendar = (series: Series, selectedSessionIds: Set<string>): void => {
    const icsContent = generateCalendar(series, selectedSessionIds);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whenrace-${series.seriesId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
