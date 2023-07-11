import './App.scss';
import React from 'react';
import { useParams, NavLink, Link } from "react-router-dom";
import Timeslot from './components/Timeslot/Timeslot.js';
import {officials} from './data/official-sessions.js';
import { ReactComponent as DiscordIcon } from './images/Discord-Logo-Color.svg';
import { ReactComponent as LinkIcon } from './images/link.svg';


const App = () => {
    let { selected_series } = useParams();
    const sortedOfficials = officials.slice().sort((a,b) => {
        return a.shortLabel > b.shortLabel ? 1 : -1
    })
    const filteredOfficials = sortedOfficials.filter(singleSeries => {
        return selected_series ? singleSeries.seriesId === selected_series : true
    })

    function renderLinks(links) {
        return Object.keys(links).map((key) => {
            let linkLabel = ''
            let labelClasses = 'text'
            switch(key) {
                case 'website':
                    linkLabel = <LinkIcon />
                    labelClasses = "svg www"
                    break;
                case 'discord':
                    linkLabel = <DiscordIcon />
                    labelClasses = "svg discord"
                    break;
                case 'facebook':
                    linkLabel = 'Facebook: '
                    break;
                default:
                    linkLabel = <LinkIcon />
                    labelClasses = "svg www"
            }
            return (
                <div key={key} className="link-row">
                    <span className={`label-type ${labelClasses}`}>{linkLabel}</span>
                    <a href={links[key]}>{links[key]}</a>
                </div>
            )
        });
    }

    return (
        <div className="App">
            <header id="nameplate">
                <img src="/images/when-race-travolta.gif" alt="" />
                <div id="nameplate-content">
                    <h1>When Race?</h1>
                </div>
            </header>
            <div className="main-content">
                <div className="problem-contribute">
                    <p>
                        See something incorrect? <a href="mailto:admin@whenrace.com?subject=When%20Race%3F%20Contact&body=Just%20let%20me%20know%20what%20I%20can%20do%20to%20help%20%3A)%0D%0A%0D%0A">Send me an email</a>. Want to contribute? <a href="https://github.com/jamiehs/whenrace/blob/master/src/data/official-sessions.js" target="_blank" rel="noreferrer">The data is on GitHub</a>!
                    </p>
                </div>
                <div className="series-selector">
                    <Link key="all" to="/" className={`${selected_series ? '' : 'selected'}`}>
                        All Series
                    </Link>
                    {sortedOfficials.map(series => {
                        return (
                            <NavLink key={`${series.seriesId}`} to={series.seriesId} activeClassName="selected">
                                {series.shortLabel}
                            </NavLink>
                        )
                    })}
                </div>
                <div className="series-list">
                    {filteredOfficials.map(series => {
                        return (
                            <div key={`${series.seriesId}`} className="series">
                                <header>
                                    <h2>{series.label}</h2>
                                    <div className="cars">
                                        {series.cars.map(car => <span key={`car.${car}`} className="car">{car}</span>)}
                                    </div>
                                    {series.links && Object.keys(series.links).length > 0 && (
                                        <div className="links">
                                            {renderLinks(series.links)}
                                        </div>
                                    )}
                                </header>

                                <span className="official-sessions">
                                    Official Sessions:
                                </span>

                                <div className="timeslots">
                                    {series.sessions.map(session => {
                                        return (
                                            <Timeslot
                                                key={`${session.sessionDay}.${session.sessionTimeGmt}`}
                                                dayIndex={session.sessionDay}
                                                time={session.sessionTimeGmt}
                                                notes={session.notes}
                                            />
                                        )
                                    })}
                                </div>
                            </div> 
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default App;
