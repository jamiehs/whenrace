import './Timeslot.scss';
import moment from 'moment-timezone';
import React from 'react';

import {nextRaceDay} from '../../helpers.js'

// prevents GMT race days from being localized or shifted inadvertantly
const dayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",]

class Timeslot extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timestamp: Date.now()
        }
    }
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ timestamp: Date.now() }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let {
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
