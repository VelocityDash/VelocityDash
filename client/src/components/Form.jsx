import React from 'react';
import moment from 'moment';
import { Modal, closeButton, Button, Glyphicon } from 'react-bootstrap';
import { addCommands, artyomStart, artyomStop, commands, onFillOutForm } from '../scripts/commands';

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
      repeat: '',
      repeatEvery: '',
      days: [],
      recIsOpen: false,
      artyomListening: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Fill out calendar form with voice
    onFillOutForm((formData) => {
      this.openForm();
      this.setState(formData);
    });

    // Set up commands
    addCommands(commands);

    // Start artyom listener
    artyomStart();
  }

  clickRecur() {
    (this.state.recIsOpen === false) ? this.setState({ recIsOpen: true }) : this.setState({ recIsOpen: false });
  }

  toggleArtyomListener() {
    if (this.state.artyomListening) {
      artyomStop();
      this.setState({ artyomListening: false });
    } else {
      artyomStart();
      this.setState({ artyomListening: true });
    }
  }

  // Update Form's state on input form change
  handleChange(e) {
    var className = e.target.className;
    var value = e.target.value;

    // TO DO: Change default event time to an hour, but need to change date as well if event goes past midnight (use MomentJS)

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
    } else if (className === 'Repeat') {
      this.setState({
        repeat: value
      });
    } else if (className === 'Repeat-Every') {
      this.setState({
        repeatEvery: value
      });
    } else if (className === 'checkbox') {
      if (this.state.days.indexOf(value) === -1) {
        this.setState({
          days: this.state.days.concat([value])
        });
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // TO DO: Use geolocation to update timeZone automatically

    // Create event object with Form's state
    var recur = `RRULE:FREQ=${this.state.repeat};COUNT=${this.state.repeatEvery};BYDAY=${this.state.days.map((day) => day)}`;
    console.log('recur', recur);
    var event;
    if (this.state.recIsOpen === false) {
      event = {
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
    } else {
      event = {
        summary: this.state.summary,
        location: this.state.location,
        start: {
          dateTime: `${this.state.startDate}T${this.state.startTime}:00-07:00`,
          timeZone: 'America/Los_Angeles'
        },
        end: {
          dateTime: `${this.state.endDate}T${this.state.endTime}:00-07:00`,
          timeZone: 'America/Los_Angeles'
        },
        recurrence: [recur]
      };
    }

    // Clear state which the form's values are pointing to
    this.setState({
      summary: '',
      location: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      repeat: '',
      repeatEvery: '',
      days: []
    });

    var token = localStorage.getItem('token');
    console.log('got token for adding event', token);

    // Post event to Google Calendar API
    fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/api/calendar/addEvent', {
      method: 'POST',
      body: JSON.stringify(event),
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    }).then((res) => {
      if (res.status === 200) {
        this.props.refreshEvents();
      // Refreshes today's events in chronological order including new event that was just added
      }
    }).catch((err) => { console.log('Error posting event to Google Calendar:\n', err); });

    this.props.toggleEventForm();
  }

  render() {

    var state = this.state.repeat;
    var day = function() {
      if (state === 'DAILY') {
        return 'Day';
      } else if (state === 'WEEKLY') {
        return 'Week';
      } else if (state === 'MONTHLY') {
        return 'Month';
      } else if (state === 'YEARLY') {
        return 'Year';
      }
    };

    var displayRecur = <div> Repeats:
                  <select className='Repeat' onChange={this.handleChange}>
                    <option value='DAILY'>Daily</option>
                    <option value='WEEKLY'>Weekly</option>
                    <option value='MONTHLY'>Monthly</option>
                    <option value='YEARLY'>Yearly</option>
                  </select>
                  Repeat Every:
                  <select className='Repeat-Every' onChange={this.handleChange}>
                    <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                    <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                    <option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                    <option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                    <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option>
                    <option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                    <option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option>
                    <option value="28">28</option><option value="29">29</option><option value="30">30</option>
                  </select>
                  {day()}
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='MO'/>Monday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='TU'/>Tuesday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='WE'/>Wednesday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='TH'/>Thursday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='FR'/>Friday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='SA'/>Saturday</label>
                    <label><input className='checkbox' onChange={this.handleChange} type='checkbox' value='SU'/>Sunday</label>
                </div>;

    return (
      <div>
        <Modal className="ModalForm" show={this.props.eventFormIsOpen} onHide={this.props.toggleEventForm}>
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="calendar-form-title">Add an event</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalFormBody">
            <form className="calendar-form" onSubmit={this.handleSubmit}>
              <div>
                Event: <input type="text" className="form-event" value={this.state.summary} placeholder="Event" onChange={this.handleChange} />
              </div>
              <div>
                Location: <input type="text" className="form-location" value={this.state.location} placeholder="Location" onChange={this.handleChange} />
              </div>
              <div>
                Date: <input type="text" className="form-date" value={this.state.startDate} placeholder="Date" onChange={this.handleChange} />
              </div>
              <div>
                Time: <input type="text" className="form-time" value={this.state.startTime} placeholder="Time" onChange={this.handleChange} />
              </div>
              {this.state.recIsOpen ? displayRecur : null}

            </form>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <a onClick={this.clickRecur.bind(this)}>Repeat</a>
              <Button bsSize="small" onClick={this.props.toggleEventForm}>Nah</Button>
              <Button bsSize="small" type="submit" onClick={this.handleSubmit}>Looks Good</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Form;
