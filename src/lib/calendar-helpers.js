import moment from 'moment-timezone';

// ICS format constants
const ICAL_DAY_MAP = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const EVENT_DURATION = 'PT1H'; // 1 hour in ISO 8601 duration format
const CALENDAR_REPEAT_YEARS = 1;

/**
 * Checks if a session is marked as special (Broadcasted or SOF)
 * @param {Object} session - Session object with notes array
 * @returns {boolean} True if session has Broadcasted or SOF notes
 */
export const isSpecialSession = (session) => {
    if (!session.notes || session.notes.length === 0) return false;
    return session.notes.some(note => {
        const lower = note.toLowerCase();
        return lower.includes('broadcasted') || lower.includes('sof');
    });
};

const getSessionId = (session) => `${session.sessionDay}-${session.sessionTimeGmt}`;

/**
 * Parses time string into hour and minute components
 * @param {string} timeString - Time in HH:MM format
 * @returns {Object} Object with hour and minute properties
 */
export const parseTime = (timeString) => {
    const [hour, minute] = timeString.split(':').map(Number);
    return { hour, minute };
};

/**
 * Converts day of week to ISO weekday format (Sunday: 0→7)
 * @param {number} day - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @returns {number} ISO weekday (1=Monday, ..., 7=Sunday)
 */
export const toIsoWeekday = (day) => day === 0 ? 7 : day;

const getSessionTags = (session) => {
    const tags = [];
    if (!session.notes) return tags;

    const hasBroadcasted = session.notes.some(note => note.toLowerCase().includes('broadcasted'));
    const hasSOF = session.notes.some(note => note.toLowerCase().includes('sof'));

    if (hasBroadcasted) tags.push('Broadcasted');
    if (hasSOF) tags.push('SOF');

    return tags;
};

/**
 * Calculates the next occurrence of a weekly session
 * @param {number} sessionDay - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @param {string} sessionTime - Time in HH:MM format
 * @returns {moment.Moment} Next occurrence in GMT
 */
export const getNextOccurrence = (sessionDay, sessionTime) => {
    const now = moment.tz('GMT');
    const { hour, minute } = parseTime(sessionTime);

    let next = now.clone()
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
 * @param {Object} series - Series object with label, cars, and links
 * @param {Object} session - Session object with notes
 * @returns {string} Formatted description text
 */
export const buildDescription = (series, session) => {
    const parts = [];

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
 * @param {Object} series - Series object with sessions and metadata
 * @param {Set<string>} selectedSessionIds - Set of session IDs to include
 * @returns {string} ICS calendar file content
 * @throws {Error} If no sessions are selected
 */
export const generateCalendar = (series, selectedSessionIds) => {
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
        const eventName = tags.length > 0
            ? `${series.label} – ${tags.join(', ')}`
            : `${series.label} – Official Session`;

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
 * @param {Object} series - Series object with sessions and metadata
 * @param {Set<string>} selectedSessionIds - Set of session IDs to include
 * @throws {Error} If calendar generation or download fails
 */
export const downloadCalendar = (series, selectedSessionIds) => {
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
