/********************************************************
  HELPER FUNCTIONS
********************************************************/

// Start listening for voice commands
const artyomStart = () => {
  artyom.initialize({
    lang: 'en-GB',
    continuous: true,
    debug: false,
    listen: true
  });

  artyom.say('Started listening.');
};

// Stop listening for voice commands
const artyomStop = () => {
  artyom.fatality();
  artyom.say('Goodbye.');
};

// Get current time
const getTime = () => {
  const date = Date().slice(16, Date().length - 15);
  let hours = date.slice(0, 2);
  let minutes = date.slice(3, 5);
  let amPm;

  if (hours >= 12) {
    hours = hours - 12;
    amPm = 'PM';
  } else {
    amPm = 'AM';
  }

  return `${hours} ${minutes} ${amPm}`;
};

// Get current date
const getDate = () => {
  const date = Date().slice(0, 15);
  let day = date.slice(0, 3);
  let month = date.slice(4, 7);
  let dateNum = Number(date.slice(8, 10));

  let months = {
    'Jan': 'January',
    'Feb': 'February',
    'Mar': 'March',
    'Apr': 'April',
    'May': 'May',
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'August',
    'Sept': 'September',
    'Oct': 'October',
    'Nov': 'Novermber',
    'Dec': 'December'
  };

  let days = {
    'Mon': 'Monday',
    'Tue': 'Tuesday',
    'Wed': 'Wednesday',
    'Thu': 'Thursday',
    'Fri': 'Friday',
    'Sat': 'Saturday',
    'Sun': 'Sunday'
  };

  day = days[day];
  month = months[month];

  return `${day} ${month} ${dateNum}`;
};

// Capitalizes every word in a given string
const capitalizeEveryWord = (string) => {
  return string.split(' ').reduce((output, word) => {
    return output += `${word[0].toUpperCase()}${word.slice(1, word.length)} `;
  }, '').trim();
};

// Function that will take formData
let handleFormData = () => {
  throw new Error('Missing callback function for onFillOutForm!');
};

const fillOutForm = (wildcard) => {
  // Separate event name, date/time and location
  let split = wildcard.split(' at ');
  let eventName = capitalizeEveryWord(split[0]);
  let location;
  let dateObject;

  // Set location and dateObject depending on the order of command
  if (Chrono.parse(split[1]).length === 1) {
    dateObject = Chrono.parse(split[1])[0].start;
    location = capitalizeEveryWord(split[2]);
  } else if (Chrono.parse(split[2]).length === 1) {
    dateObject = Chrono.parse(split[2])[0].start;
    location = capitalizeEveryWord(split[1]);
  } else if (Chrono.parse(split[1]).length === 0 || Chrono.parse(split[2]).length === 0) {
    console.warn(`Command can be said in two ways:\n [event] at [date/time] at [location]\n [event] at [location] at [date/time]`);
  }

  // TO DO: Add console.warn if order of wildcard said wrong

  // Parse date/time information into object
  let date = Object.assign(dateObject.impliedValues, dateObject.knownValues);

  // Add leading zeroes to month/day if less than 10
  (date.month < 10) ? date.month = `0${date.month}` : date.month = `${date.month}`;
  (date.day < 10) ? date.day = `0${date.day}` : date.day = `${date.day}`;

  // Add leading zeroes to hour/minute if less than 10
  let time = '';
  (date.hour < 10) ? time += `0${date.hour}:` : time += `${date.hour}:`;
  (date.minute < 10) ? time += `0${date.minute}` : time += `${date.minute}`;

  // Generate form data object to pass to this.setState
  let formInfo = {
    summary: eventName,
    location: location,
    startDate: `${date.year}-${date.month}-${date.day}`,
    startTime: time,
    endDate: `${date.year}-${date.month}-${date.day}`,
    endTime: time
  };

  handleFormData(formInfo);

  // artyom.say(`Added ${eventName} at ${location} to the calendar. If everything on the form looks good, say add to calendar.`);
};

// let handleVoiceSubmit = () => {
//   throw new Error('Missing callback function for onVoiceSubmit!');
// };

// const voiceSubmit = () => {
//   console.log('Inside voiceSubmit');
//   handleVoiceSubmit();
// };

/********************************************************
  ARTYOM COMMANDS
********************************************************/

const commands = [
  {
    indexes: ['stop listening'],
    action: (i) => { artyomStop() }
  },
  {
    indexes: ['render spotify playlist'],
    action: (i) => {
      artyom.say('Rendering Spotify playlist.');

      $playlist = $('<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3Ababybluejeff%3Aplaylist%3A6toivxuv2M1tBLjLWZwf3d" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
      $playlist.appendTo($('#main1'));
    }
  },
  {
    indexes: ['stop the music'],
    action: (i) => {
      $('#main1').empty();

      artyom.say('Removing Spotify playlist.');
    }
  },
  {
    indexes: ['what time is it'],
    action: (i) => { artyom.say(`It is currently ${getTime()}.`) }
  },
  {
    indexes: ['what\'s the date today'],
    action: (i) => { artyom.say(`Today is ${getDate()}.`) }
  },
  {
    indexes: ['open *', 'go to *'],
    smart: true,
    action: (i, wildcard) => {
      artyom.say(`Opening ${wildcard.replace('.', ' dot ')}.`);
      window.open(`http://${wildcard}`)
    }
  },
  {
    indexes: ['search YouTube for *'],
    smart: true,
    action: (i, wildcard) => {
      artyom.say(`Searching YouTube for ${wildcard}.`);
      window.open(`https://www.youtube.com/results?search_query=${wildcard}`)
    }
  },
  {
    indexes: ['search Amazon for *'],
    smart: true,
    action: (i, wildcard) => {
      artyom.say(`Searching Amazon for ${wildcard}.`);
      window.open(`https://www.amazon.com/s/ref=nb_sb_noss_2/180-3667157-6088933?url=search-alias%3Daps&field-keywords=${wildcard}`);
    }
  },
  {
    indexes: ['create event *', 'add event *', 'make event *'],
    smart: true,
    action: (i, wildcard) => {
      fillOutForm(wildcard);
    }
  }
  // {
  //   indexes: ['looks good', 'add to calendar'],
  //   action: (i) => {
  //     console.log('Inside artyom command');
  //     voiceSubmit();
  //   }
  // }
];

/********************************************************
  EXPORTS
********************************************************/

module.exports = {
  artyomStart,
  artyomStop,
  // fillOutForm: fillOutForm,
  addCommands: artyom.addCommands,
  commands,
  onFillOutForm: (callback) => {
    handleFormData = callback;
  }
  // onVoiceSubmit: (callback) => {
  //   handleVoiceSubmit = callback;
  // }
};
