import React from 'react';
import ReactDOM from 'react-dom';
import Background from './Background.jsx';
import Time from './Time.jsx';
import Calendar from './Calendar.jsx';
import Form from './Form.jsx';
import SignIn from './SignIn.jsx';
import Setting from './Setting.jsx';
import Navigation from './Navigation.jsx';
import Commands from './Commands.jsx';
import TransitMode from './TransitMode.jsx';
import { speech } from '../scripts/commands';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      transitMode: '',
      eventFormIsOpen: false,
      settingsIsOpen: false,
      commandsIsOpen: false,
      transitModeIsOpen: false,
      openCommandsIntro: true,
      openSettingsIntro: true,
      openTransitIntro: true
    };

    this.toggleEventForm = this.toggleEventForm.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.toggleCommands = this.toggleCommands.bind(this);
    this.toggleTransitMode = this.toggleTransitMode.bind(this);
    this.fetchAndUpdateEvents = this.fetchAndUpdateEvents.bind(this);
    this.onTransitModeChange = this.onTransitModeChange.bind(this);
  }

  toggleEventForm() {
    (!this.state.eventFormIsOpen) ? this.setState({ eventFormIsOpen: true }) : this.setState({ eventFormIsOpen: false });
  }

  toggleSettings() {
    if (!this.state.settingsIsOpen) {
      this.setState({ settingsIsOpen: true });

      if (this.state.openSettingsIntro) {
        this.setState({ openSettingsIntro: false });
        speech.openSettingsModal();
      }
    } else {
      this.setState({ settingsIsOpen: false });
    }
  }

  toggleCommands() {
    if (!this.state.commandsIsOpen) {
      this.setState({ commandsIsOpen: true});

      if (this.state.openCommandsIntro) {
        this.setState({ openCommandsIntro: false });
        speech.openCommandsModal();
      }

    } else {
      this.setState({ commandsIsOpen: false });
    }
  }

  toggleTransitMode() {
    if (!this.state.transitModeIsOpen) {
      this.setState({ transitModeIsOpen: true});

      if (this.state.openTransitIntro) {
        this.setState({ openTransitIntro: false });
        speech.openTransitModal();
      }

    } else {
      this.setState({ transitModeIsOpen: false });
    }
  }

  onTransitModeChange(value) {
    this.setState({ transitMode: value });
  }

  fetchAndUpdateEvents() {
    var token = localStorage.getItem('token');

    // Post event to Google Calendar API
    fetch('http://velocitydash.com/api/calendar/getDayEvents', {
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
          event.startdatetime = moment(event.startdatetime).format('LT');
          return {
            eventName: event.name,
            location: event.location,
            startTime: event.startdatetime,
            eventUrl: event.eventUrl,
            eventId: event.googleCalendarEventId
          };
        });

        // SORTING NEEDS TO SORT BY DATE AS WELL, NOT JUST TIME
        this.sortAndUpdateEvents(eventList);
      })
    .catch((err) => {
      console.log('Error retrieving events', err);
    });
  }

  displayTransitMode() {
    var token = localStorage.getItem('token');

    fetch('http://velocitydash.com/api/users/getTransit', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ transitMode: data.transitmode });
      })
      .catch((err) => {
        console.log('Did not get User info', err);
      });
  }

  // SORTING NEEDS TO SORT BY DATE AS WELL, NOT JUST TIME
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
        <Background />
        <div>
          <Navigation
            toggleEventForm = {this.toggleEventForm}
            toggleSettings = {this.toggleSettings}
            toggleCommands = {this.toggleCommands}
            toggleTransitMode = {this.toggleTransitMode}
            transitMode = {this.state.transitMode}
          />
        </div>
        <div>
          <SignIn />
        </div>
        <div>
          <Time />
        </div>
        <div>
          <Calendar fetch={this.fetchAndUpdateEvents.bind(this)} events={this.state.events} />
        </div>
        <div>
          <Form
            eventFormIsOpen = {this.state.eventFormIsOpen}
            toggleEventForm = {this.toggleEventForm}
            refreshEvents = {this.fetchAndUpdateEvents}
          />
        </div>
        <div>
          <Setting
            settingsIsOpen = {this.state.settingsIsOpen}
            toggleSettings = {this.toggleSettings}
          />
        </div>
        <div>
          <Commands
            commandsIsOpen = {this.state.commandsIsOpen}
            toggleCommands = {this.toggleCommands}
          />
        </div>
        <div>
          <TransitMode
            transitModeIsOpen = {this.state.transitModeIsOpen}
            toggleTransitMode = {this.toggleTransitMode}
            transitChange = {this.onTransitModeChange}
            transitMode = {this.state.transitMode}
          />
        </div>
      </div>
    );
  }
}

// export default App;

ReactDOM.render(<App />, document.getElementById('app'));
