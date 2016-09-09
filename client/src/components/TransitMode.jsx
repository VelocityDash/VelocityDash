import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import { Button, closeButton, Glyphicon, Modal } from 'react-bootstrap';

class Setting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTransitMode: ''
    };

    this.updateSelectedTransitMode = this.updateSelectedTransitMode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ selectedTransitMode: this.props.transitMode });
  }

  updateSelectedTransitMode(value) {
    this.setState({ selectedTransitMode: value });

    console.log(`Updated selectedTransitMode. ${this.state.selectedTransitMode} should equal ${value}`);
  }
  
  handleSubmit() {
    // e.preventDefault();
    var token = localStorage.getItem('token');
    var settings = { transitMode: this.state.selectedTransitMode };

    fetch('http://velocitydash.com/api/users/updateTransit', {
      method: 'POST',
      body: JSON.stringify(settings),
      mode: 'cors-with-forced-preflight',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    })
    .then((res) => res.text())
    .then((data) => { this.props.transitChange(data); })
    .catch((err) => { console.log('Error saving transit mode to DB.\n', err); });

    this.props.toggleTransitMode();
  }

  render() {
    return (
      <div>
        <Modal className="ModalForm" show={this.props.transitModeIsOpen} onHide={this.props.toggleTransitMode}>
          <Modal.Header closeButton>
            <Modal.Title> 
              <div className="modal-title">Transportation Mode</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <form className="transit-form" onSubmit={this.handleSubmit}>
              <RadioGroup name="transit" selectedValue={this.state.selectedTransitMode} onChange={this.updateSelectedTransitMode}>
                <div className="transit-selection">Choose Your Transportation</div>
                <Radio value="driving" /> Driving <br/>
                <Radio value="walking" /> Walking <br/>
                <Radio value="transit" /> Transit <br/>
                <Radio value="bicycling" /> Bicycling
              </RadioGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button bsSize="small" onClick={this.props.toggleTransitMode}>Cancel</Button>
              <Button bsSize="small" type="submit" onClick={this.handleSubmit}>Save Changes</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Setting;