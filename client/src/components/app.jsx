import React from 'react';
import ReactDOM from 'react-dom';
import Chrono from '../lib/chrono.min.js';
import artyom from '../lib/artyom.min.js';
import $ from '../lib/jquery.js';
const commands = require('../scripts/commands.js');

import Form from './Form.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Form commands={commands}/>
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));