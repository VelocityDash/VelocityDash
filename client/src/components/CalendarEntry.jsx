import React from 'react';

const CalendarEntry = (props) => {
  return (
    <div className='calendar-entry'>
      <div className='event-start'>
        {props.event.startTime}
      </div>
      <div className='event-summary-location'>
        <a className='event-link' href={props.event.eventUrl} target='new'>{props.event.eventName} at {props.event.location}</a>
      </div>
    </div>
  )
}

export default CalendarEntry;
