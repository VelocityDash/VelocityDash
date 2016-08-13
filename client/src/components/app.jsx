import React from 'react';
import ReactDOM from 'react-dom';
import Time from './Time.jsx';
import Calendar from './Calendar.jsx'
import Form from './Form.jsx';
import Chrono from '../lib/chrono.min.js';
import artyom from '../lib/artyom.min.js';
import $ from '../lib/jquery.js';
const commands = require('../scripts/commands.js');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          summary: 'Hacking All Day',
          location: 'Hack Reactor',
          startTime: '13:00'
        },
        {
          summary: 'Dinner',
          location: 'Sushiritto',
          startTime: '19:00'
        },
        {
          summary: 'Drinks',
          location: 'Tempest',
          startTime: '22:00'
        }
      ]
    }
  }

  appendEvent(event) {
    this.setState({
      events: this.state.events.concat([event])
    });
  }

  componentDidMount() {
    fetch('http://localhost:9000/api/calendar/getEvent')
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

        // Get all event times
        let times = eventList.reduce((array, event) => {
          return array.concat(event.startTime);
        }, []);

        // Sort event times in chronological order
        times.sort((a, b) => {
          return new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`);
        });

        // Sort events based on start time
        let sortedEvents = eventList.reduce((sortedArray, event) => {
          sortedArray[times.indexOf(event.startTime)] = event;
          return sortedArray;
        }, []);

        this.setState({
          events: sortedEvents
        });

        this.setState({ events: sortedEvents });
      })
      .catch((err) => {
        console.log('Error retrieving events', err);
      })
  }

  render() {
    return (
      <div>
        <div>
          <Time />
        </div>
        <div>
          <Form appendEvent={this.appendEvent.bind(this)} commands={commands}/>
        </div>
        <div>
          <Calendar events={this.state.events} />
        </div>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
