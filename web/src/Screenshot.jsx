import React from 'react';
import { Section } from 'neal-react';

class Screenshot extends React.Component {
  render() {
    return(
      <Section style={{'textAlign': 'center'}}>
        <img style={{width: '90%'}} src="./assets/velocity_dash.png" />
      </Section>
    );
  }
};

export default Screenshot;