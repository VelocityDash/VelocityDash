import React from 'react';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summary: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    }
  }

  componentDidMount() {
    // Fill out calendar form with voice
    this.props.commands.onFillOutForm((formData) => {
      this.setState(formData);
    });

    // Set up commands
    this.props.commands.addCommands(this.props.commands.commands);
    
    // Start artyom listener
    this.props.commands.artyomStart();
  }

  handleChange(e) {
    var className = e.target.className;
    var value = e.target.value;

    // TO DO: Change default event time to an hour, but need to change date as well if event goes past midnight

    if (className === 'form-event') {
      this.setState({
        summary: value 
      });
    } else if (className === 'form-location') {
      this.setState({
        location: value
      });
    } else if (className === 'form-date') {
      this.setState({
        startDate: value,
        endDate: value
      });
    } else if (className === 'form-time') {
      this.setState({
        startTime: value,
        endTime: value
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault(); 

    // TO DO: Use geolocation to update timeZone automatically

    // Create event object with this.state
    var event = {
      summary: this.state.summary,
      location: this.state.location,
      start: {
        dateTime: `${this.state.startDate}T${this.state.startTime}:00-07:00`,
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: `${this.state.endDate}T${this.state.endTime}:00-07:00`,
        timeZone: 'America/Los_Angeles'
      }
    };

    // Clear state which the form's values are pointing to
    this.setState({
      summary: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    });

    // Post event to Google Calendar API
    fetch('http://localhost:9000/api/calendar/addEvent', {
      method: 'POST',
      body: JSON.stringify(event),
      mode: 'cors-with-forced-preflight',
      headers: {'Content-Type': 'application/json'}
    }).then((res) => {
      console.log('res', res);
      return res.json();
    }).then((data) => {
      // do something
      console.log('data', data);
    }).catch((err) => {
      console.log('err', err);
    });
  }

  render() {
    return (
      <div>
        <form className="calendar-form" onSubmit={this.handleSubmit.bind(this)}>
          Event:<br/>
          <input type="text" className="form-event" value={this.state.summary} placeholder="Event" onChange={this.handleChange.bind(this)} /><br/><br/>
          Location:<br/>
          <input type="text" className="form-location" value={this.state.location} placeholder="Location" onChange={this.handleChange.bind(this)} /><br/><br/>
          Date:<br/>
          <input type="text" className="form-date" value={this.state.startDate} placeholder="Date" onChange={this.handleChange.bind(this)} /><br/><br/>
          Time:<br/>
          <input type="text" className="form-time" value={this.state.startTime} placeholder="Time" onChange={this.handleChange.bind(this)} /><br/><br/>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

module.exports = Form;