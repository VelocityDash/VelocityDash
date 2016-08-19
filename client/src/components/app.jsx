import React from 'react';
import ReactDOM from 'react-dom';
import Time from './Time.jsx';
import Calendar from './Calendar.jsx'
import Form from './Form.jsx';
import Chrono from '../lib/chrono.min.js';
import artyom from '../lib/artyom.min.js';
import $ from '../lib/jquery.js';
const commands = require('../scripts/commands.js');
const Modal = require('react-modal');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  fetchAndUpdateEvents() {
    fetch('http://localhost:9000/api/calendar/getDayEvents')
      .then((res) => res.json())
        .then((data) => {
          let eventList = data.map((event) => {
            return {
              eventName: event.name,
              location: event.location,
              startTime: event.startdatetime,
              eventUrl: event.eventUrl
            };
          });

        this.sortAndUpdateEvents(eventList);
      })
      .catch((err) => {
        console.log('Error retrieving events', err);
      })
  }

  sortAndUpdateEvents(eventList) {
    // Get all event times
    let times = eventList.reduce((array, event) => {
      return array.concat(event.startTime);
    }, []);

    // Sort event times in chronological order
    times.sort((a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`));

    // TO DO: Bug fix - if there are multiple events are at the same time, the last
    // event with the same time will overwrite the first one

    // Sort events based on start time
    let sortedEvents = eventList.reduce((sortedArray, event) => {
      sortedArray[times.indexOf(event.startTime)] = event;
      return sortedArray;
    }, []);

    // Update the state with sorted events
    this.setState({ events: sortedEvents });
  }

  componentDidMount() {
    this.fetchAndUpdateEvents();
  }

  render() {
    return (
      <div>
        <div>
          <Time />
        </div>
        <div>
          <Calendar events={this.state.events} />
        </div>
        <div>
          <Form refreshEvents={this.fetchAndUpdateEvents.bind(this)} commands={commands}/>
        </div>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
