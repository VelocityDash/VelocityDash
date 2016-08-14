import React from 'react';
import CalendarEntry from './CalendarEntry.jsx';
const moment = require('moment');

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className='calendar'>
        <div className='calendar-title'>
          <div>Today</div>
        </div>
        <div>{this.props.events.map((event, i) =>
          <CalendarEntry key={i} event={event} />
        )}
        </div>
      </div>
    )
  }
}

export default Calendar;
