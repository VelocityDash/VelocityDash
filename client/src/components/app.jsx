import React from 'react';
import ReactDOM from 'react-dom';
import Time from './Time.jsx';
import Calendar from './Calendar.jsx';
import Form from './Form.jsx';
import SignIn from './SignIn.jsx';
import Setting from './Setting.jsx';
// import commands from '../scripts/commands.js';
import Navigation from './Navigation.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      displayTransitMode: '',
      eventFormIsOpen: false,
      settingsIsOpen: false
    };

    this.toggleEventForm = this.toggleEventForm.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.fetchAndUpdateEvents = this.fetchAndUpdateEvents.bind(this);
    this.handleTransChange = this.handleTransChange.bind(this);
  }

  toggleEventForm() {
    (!this.state.eventFormIsOpen) ? this.setState({ eventFormIsOpen: true }) : this.setState({ eventFormIsOpen: false });
  }

  toggleSettings() {
    (!this.state.settingsIsOpen) ? this.setState({ settingsIsOpen: true }) : this.setState({ settingsIsOpen: false });
  }

  fetchAndUpdateEvents() {
    var token = localStorage.getItem('token');

    // Post event to Google Calendar API
    fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/api/calendar/getDayEvents', {
      method: 'GET',
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
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
    });
  }

  handleTransChange(value) {
    this.setState({ displayTransitMode: value });
  }

  displayTransitMode() {
    var token = localStorage.getItem('token');

    fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/api/users/getTransit', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        // this.setState({
        //   selectedOption: data.transitmode
        // })
        // pass data back to app jsx
        console.log('setting data', data);
        this.setState({
          displayTransitMode: data.transitmode
        });
      })
      .catch((err) => {
        console.log('Did not get User info', err);
      });
  }

  sortAndUpdateEvents(eventList) {
    // Get all event times
    let times = eventList.reduce((array, event) => {
      return array.concat(event.startTime);
    }, []);

    // Sort event times in chronological order
    times.sort((a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`));

    // TO DO: Bug fix - if there are multiple events are at the same time, the last event with the same time will overwrite the first one

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
    this.displayTransitMode();
  }

  render() {
    return (
      <div>
        <div>
          <Navigation toggleEventForm={this.toggleEventForm} toggleSettings={this.toggleSettings} />
        </div>
        <div>
          <SignIn />
        </div>
        <div className="transit-mode">
          Transportation Mode:&nbsp;
          {this.state.displayTransitMode}
        </div>
        <div>
          <Time />
        </div>
        <div>
          <Calendar events={this.state.events} />
        </div>
        <div>
          <Form refreshEvents={this.fetchAndUpdateEvents} eventFormIsOpen={this.state.eventFormIsOpen} toggleEventForm={this.toggleEventForm} />
        </div>
        <div>
          <Setting transitChange={this.handleTransChange} transitMode={this.state.displayTransitMode} settingsIsOpen={this.state.settingsIsOpen} toggleSettings={this.toggleSettings} />
        </div>
      </div>
    );
  }
}

// export default App;

ReactDOM.render(<App />, document.getElementById('app'));
