import React from 'react';
import { Section, CustomerQuotes, CustomerQuote } from 'neal-react';

class Creators extends React.Component {
  render() {
    return (
      <Section>
        <CustomerQuotes>
          <CustomerQuote name="Carl Chen" title="Velocity co-creator" imageUrl="./assets/carl_chen_circle.png">
            <p>
            The new tab is something you see all the time so we designed Velocity to be sleek and minimal. Built in React, the dashboard loads and updates changes very quickly.
            </p>
          </CustomerQuote>
          <CustomerQuote name="Derek Hoang" title="Velocity co-creator" imageUrl="./assets/derek_hoang_circle.png">
            <p>
            Our app efficiently saves users time from checking their Google Calendar and Google Maps for directions, traffic, and arrival time. Users will never have to worry about arriving late to an event again. We'll tell you when and where you'll need to be!
            </p>
          </CustomerQuote>
          <CustomerQuote name="Jeff Leu" title="Velocity co-creator" imageUrl="./assets/jeff_leu_circle.png">
            <p>
            The Google Chrome browser's native APIs are quite powerful, so it was very exciting to make a voice-activated dashboard that leveraged its technologies.
            </p>
          </CustomerQuote>
        </CustomerQuotes>
      </Section>
    );
  }
}

export default Creators;
