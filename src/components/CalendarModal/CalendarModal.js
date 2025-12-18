import { useState, useMemo, useEffect } from 'react';
import moment from 'moment-timezone';
import './CalendarModal.scss';
import { downloadCalendar, getSessionId, isSpecialSession, parseTime, toIsoWeekday } from '../../lib/calendar-helpers.js';
import { ReactComponent as CalendarIcon } from '../../images/calendar.svg';

const CalendarModal = ({ series, onClose }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Pre-select Broadcasted and SOF sessions, or all sessions if there's only 1
    const defaultSelected = useMemo(() => {
        const defaults = new Set();

        // If there's only 1 session, select it by default
        if (series.sessions.length === 1) {
            defaults.add(getSessionId(series.sessions[0]));
        } else {
            // Otherwise, pre-select Broadcasted and SOF sessions
            series.sessions.forEach(session => {
                if (isSpecialSession(session)) {
                    defaults.add(getSessionId(session));
                }
            });
        }

        return defaults;
    }, [series.sessions]);

    const [selectedSessions, setSelectedSessions] = useState(defaultSelected);

    // Check if all sessions are selected
    const allSelected = selectedSessions.size > 0 && selectedSessions.size === series.sessions.length;

    const toggleSession = (sessionId) => {
        const newSet = new Set(selectedSessions);
        if (newSet.has(sessionId)) {
            newSet.delete(sessionId);
        } else {
            newSet.add(sessionId);
        }
        setSelectedSessions(newSet);
    };

    const toggleSelectAll = (e) => {
        // Blur the button to prevent it from staying focused on iOS
        e.currentTarget.blur();

        if (allSelected) {
            // If all are selected, deselect all
            setSelectedSessions(new Set());
        } else {
            // Otherwise, select all
            const allSessionIds = series.sessions.map(getSessionId);
            setSelectedSessions(new Set(allSessionIds));
        }
    };

    const handleDownload = () => {
        if (selectedSessions.size === 0) {
            alert('Please select at least one session');
            return;
        }

        try {
            downloadCalendar(series, selectedSessions);
            onClose();
        } catch (error) {
            alert(error.message || 'Error generating calendar. Please try again.');
        }
    };

    // Convert GMT times to user's local time (memoized per session)
    const sessionTimeMap = useMemo(() => {
        const map = new Map();
        const userTimezone = moment.tz.guess();

        series.sessions.forEach(session => {
            const { hour, minute } = parseTime(session.sessionTimeGmt);

            // Create a reference moment in GMT for this session, then convert to local
            const sessionInGmt = moment.tz('GMT')
                .isoWeekday(toIsoWeekday(session.sessionDay))
                .hour(hour)
                .minute(minute)
                .second(0);

            const sessionInLocalTime = sessionInGmt.clone().tz(userTimezone);

            map.set(getSessionId(session), {
                dayName: sessionInLocalTime.format('dddd'),
                time: sessionInLocalTime.format('h:mm A')
            });
        });
        return map;
    }, [series.sessions]);

    return (
        <div className="calendar-modal-overlay" onClick={onClose}>
            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-modal-header">
                    <h2>{series.label}</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                <div className="calendar-modal-content">
                    <p>Select sessions to add to your calendar. Sessions will repeat weekly for 1 year from today.</p>

                    {series.sessions.length > 1 && (
                        <div className="select-buttons">
                            <button onClick={toggleSelectAll}>
                                {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    )}

                    <div className="sessions-list">
                        {series.sessions.map(session => {
                            const sessionId = getSessionId(session);
                            const isSelected = selectedSessions.has(sessionId);
                            const timeInfo = sessionTimeMap.get(sessionId);

                            return (
                                <label key={sessionId} className="session-item">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSession(sessionId)}
                                    />
                                    <span className="session-info">
                                        {timeInfo.dayName} {timeInfo.time}
                                        {session.notes && session.notes.length > 0 && (
                                            <span className="session-notes"> • {session.notes.join(', ')}</span>
                                        )}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="calendar-modal-footer">
                    <button
                        className="download-button"
                        onClick={handleDownload}
                        disabled={selectedSessions.size === 0}
                    >
                        <CalendarIcon className="button-icon" /> Download Calendar ({selectedSessions.size} session{selectedSessions.size !== 1 ? 's' : ''})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
