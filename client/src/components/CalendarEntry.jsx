import React from 'react';

const CalendarEntry = (props) => {
  console.log('list entry ', props.event);
  const getTime = (time) => {
    console.log(time.length);
    // const date = time.slice(0, time.length - 18);
    let hours = time.slice(0, 2);
    let minutes = time.slice(3, 5);
    let amPm;
    console.log('hours', hours);
    console.log('minutes', minutes);

    if (hours >= 12) {
      amPm = 'PM';
      hours = hours - 12;
    } else {
      amPm = 'AM';
    }

    return `${hours}:${minutes} ${amPm}`;
  };

  let start = getTime(props.event.startTime)
  return (
    <div className='calendar-entry'>
      <div className='event-start'>
        {start}
      </div>
      <div className='event-summary-location'>
        {props.event.summary} at {props.event.location}
      </div>
    </div>
  )
}

export default CalendarEntry;
