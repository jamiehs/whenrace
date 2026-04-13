import './Timeslot.scss';
import moment from 'moment-timezone';
import React from 'react';

import {nextRaceDay} from '../../helpers'

// prevents GMT race days from being localized or shifted inadvertantly
const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface TimeslotProps {
    label?: string;
    dayIndex: number;
    time: string;
    notes?: string[];
}

interface TimeslotState {
    timestamp: number;
}

class Timeslot extends React.Component<TimeslotProps, TimeslotState> {
    private interval: ReturnType<typeof setInterval> | null = null;

    constructor(props: TimeslotProps) {
        super(props)
        this.state = {
            timestamp: Date.now()
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ timestamp: Date.now() }), 1000);
    }
    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    render() {
        const {
            label,
            dayIndex,
            time,
            notes,
        } = this.props

        const tz = moment.tz.guess()
        const nextRaceDate = nextRaceDay(dayIndex, time)
        const nextRaceDayLocal = nextRaceDate.toLocaleDateString(undefined, { weekday: 'long' })
        const nextRaceTimeLocal = nextRaceDate.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})

        return (
            <div className={`Timeslot ${notes && notes.length && 'has-notes'}`}>
                <h3 className="label">{label}</h3>
                <div className="timeslot-date">
                    <div className="date-gmt">
                        <div className="date-time">{dayLabels[dayIndex]} {time}</div>
                        <div className="date-label">GMT</div>
                    </div>
                    <div className="date-local">
                        <div className="date-time">{nextRaceDayLocal} {nextRaceTimeLocal}</div>
                        <div className="date-label">{tz.replace('_', ' ')}</div>
                    </div>
                </div>
                {notes && notes.length && (
                    <div className="timeslot-info">
                        {notes.map(note => <span key={note} className="note">{note}</span>)}
                    </div>
                )}
            </div>
        );
    }
}

export default Timeslot;
