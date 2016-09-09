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
      dateFormatError: false,
      timeFormatError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickRecur = this.clickRecur.bind(this);
    this.clearAndToggleForm = this.clearAndToggleForm.bind(this);
  }

  componentDidMount() {
    // Fill out calendar form with voice
    onFillOutForm((formData) => {
      this.props.toggleEventForm();
      this.setState(formData);
    });
  }

  clickRecur() {
    (this.state.recIsOpen === false) ? this.setState({ recIsOpen: true, repeat: 'DAILY' }) : this.setState({ recIsOpen: false, repeat: '' });
  }

  clearAndToggleForm() {
    this.props.toggleEventForm();

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
  }

  dateFormatValid(date) {
    if (date.indexOf('/') === -1) { return false; }

    let dateSplit = date.split('/');
    let month = Number(dateSplit[0]);
    let day = Number(dateSplit[1]);
    let year = Number(dateSplit[2]);

    if (month < 1 || month > 12) { return false; }
    if (day < 1 || day > 31) { return false; }
    if ((year.toString()).length !== 4) { return false; }

    return true;
  }

  timeFormatValid(time) {
    if (time.indexOf(':') === -1) { return false; }
    if (time[time.length - 3] !== ' ') { return false; }

    let timeSplit = time.split(':');
    let hour = Number(timeSplit[0]);
    let minute = Number(timeSplit[1].split(' ')[0]);
    let amPm = timeSplit[1].split(' ')[1];

    if (hour < 1 || hour > 12) { return false; }
    if (minute < 0 || minute > 59) { return false; }

    if (amPm === 'am' || amPm === 'AM' || amPm === 'pm' || amPm === 'PM') {
      // do nothing
    } else {
      return false;
    }

    return true;
  }

  convertDate(date) {
    let dateSplit = date.split('/');
    let month = (Number(dateSplit[0]) < 10) ? `0${Number(dateSplit[0])}` : `${Number(dateSplit[0])}`;
    let day = (Number(dateSplit[1]) < 10) ? `0${Number(dateSplit[1])}` : `${Number(dateSplit[1])}`;
    let year = Number(dateSplit[2]);

    return `${year}-${month}-${day}`;
  }

  convertToMilitaryTime(time) {
    let split = time.split(':');
    let hours = Number(split.shift());
    let minutes = Number(split.join('').split(' ')[0]);
    let amPm = (split.join('').split(' ')[1]).toUpperCase();

    if (amPm === 'PM' && hours !== 12) { hours += 12; }

    return `${hours}:${minutes}`;
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
    } else if (className === 'repeat') {
      this.setState({
        repeat: value
      });
    } else if (className === 'repeat-every') {
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

    // Form validation to check for date and/or time in incorrect format
    if (!this.dateFormatValid(this.state.startDate) && !this.timeFormatValid(this.state.startTime)) {
      console.log('Error in both date and time format.');
      this.setState({
        dateFormatError: true,
        timeFormatError: true
      });
    }

    if (!this.dateFormatValid(this.state.startDate) && !this.state.dateFormatError) {
      this.setState({ dateFormatError: true });
    } else if (this.dateFormatValid(this.state.startDate) && this.state.dateFormatError) {
      this.setState({ dateFormatError: false });
    }

    if (!this.timeFormatValid(this.state.startTime) && !this.state.timeFormatError) {
      this.setState({ timeFormatError: true });
    } else if (this.timeFormatValid(this.state.startTime) && this.state.timeFormatError) {
      this.setState({ timeFormatError: false });
    }

    // If both date and time are valid, post to Google Calendar API
    if (this.dateFormatValid(this.state.startDate) && this.timeFormatValid(this.state.startTime)) {
      // Create event object with Form's state
      let date = this.convertDate(this.state.startDate);
      let time = this.convertToMilitaryTime(this.state.startTime);
      var recur;

      if (this.state.repeat !== 'WEEKLY') {
        recur = `RRULE:FREQ=${this.state.repeat};COUNT=${this.state.repeatEvery};`;
      } else {
        recur = `RRULE:FREQ=${this.state.repeat};COUNT=${this.state.repeatEvery};BYDAY=${this.state.days.map((day) => day)}`;
      }

      let event;
      if (this.state.recIsOpen === false) {
        event = {
          summary: this.state.summary,
          location: this.state.location,
          start: {
            dateTime: `${date}T${time}:00-07:00`,
            timeZone: 'America/Los_Angeles'
          },
          end: {
            dateTime: `${date}T${time}:00-07:00`,
            timeZone: 'America/Los_Angeles'
          }
        };
      } else {
        event = {
          summary: this.state.summary,
          location: this.state.location,
          start: {
            dateTime: `${date}T${time}:00-07:00`,
            timeZone: 'America/Los_Angeles'
          },
          end: {
            dateTime: `${date}T${time}:00-07:00`,
            timeZone: 'America/Los_Angeles'
          },
          recurrence: [recur]
        };
      }

      let token = localStorage.getItem('token');

      // Post event to Google Calendar API
      fetch('http://velocitydash.com/api/calendar/addEvent', {
        method: 'POST',
        body: JSON.stringify(event),
        mode: 'cors-with-forced-preflight',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        }
      }).then((res) => {
        if (res.status === 200) { this.props.refreshEvents(); }
      }).catch((err) => { console.log('Error posting event to Google Calendar:\n', err); });

      this.clearAndToggleForm();
    }
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
                  <select className='repeat' onChange={this.handleChange}>
                    <option value='DAILY'>Daily</option>
                    <option value='WEEKLY'>Weekly</option>
                    <option value='MONTHLY'>Monthly</option>
                    <option value='YEARLY'>Yearly</option>
                  </select>
                  Repeat Every:
                  <select className='repeat-every' onChange={this.handleChange}>
                    <option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
                    <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                    <option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                    <option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                    <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option>
                    <option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                    <option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option>
                    <option value="28">28</option><option value="29">29</option><option value="30">30</option>
                  </select>
                  {day()} <br/>
                </div>;

    var dateErrorMessage = (this.state.dateFormatError) ? 'Date in incorrect format' : '';
    var timeErrorMessage = (this.state.timeFormatError) ? 'Time in incorrect format' : '';

    var displayDays = <div>
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
              <div className="modal-title">Add an event</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <form className="event-form" onSubmit={this.handleSubmit}>
              <div>
                Event:<br/>
                <input type="text" className="form-event" value={this.state.summary} placeholder="Event name" onChange={this.handleChange} />&nbsp;
              </div>
              <div>
                Location:<br/>
                <input type="text" className="form-location" value={this.state.location} placeholder="Location of event" onChange={this.handleChange} />&nbsp;
              </div>
              <div>
                Date:<br/>
                <input type="text" className="form-date" value={this.state.startDate} placeholder="M/D/YYYY" onChange={this.handleChange} />&nbsp;
                {dateErrorMessage}
              </div>
              <div>
                Time:<br/>
                <input type="text" className="form-time" value={this.state.startTime} placeholder="h:mm am/pm" onChange={this.handleChange} />&nbsp;
                {timeErrorMessage}
              </div>
              {this.state.recIsOpen ? displayRecur : null}
              {this.state.repeat === 'WEEKLY' && this.state.recIsOpen ? displayDays : null }
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button bsSize="small" className='repeat-button' onClick={this.clickRecur}>Add Recurrence</Button>
              <Button bsSize="small" onClick={this.clearAndToggleForm}>Cancel</Button>
              <Button bsSize="small" type="submit" onClick={this.handleSubmit}>Add Event</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Form;
