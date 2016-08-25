const Chrono = require('../../dist/lib/chrono.min.js');

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
  let hours = (date.slice(0, 2) > 12) ? date.slice(0, 2) - 12 : date.slice(0, 2);
  let minutes = date.slice(3, 5);
  let amPm = (date.slice(0, 2) < 12) ? 'AM' : 'PM';

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
  (date.month < 10) ? `0${date.month}` : `${date.month}`;
  (date.day < 10) ? `0${date.day}` : `${date.day}`;

  // Format time
  let time = '';
  (date.hour > 12) ? time += `${Number(date.hour) - 12}:` : time += `${date.hour}:`;
  (date.minute < 10) ? time += `0${date.minute} ` : time += `${date.minute} `;
  (date.hour >= 12) ? time += 'PM' : time += 'AM';

  // Generate form data object to pass to this.setState
  let formInfo = {
    summary: eventName,
    location: location,
    startDate: `${date.month}/${date.day}/${date.year}`,
    startTime: time,
    endDate: `${date.month}/${date.day}/${date.year}`,
    endTime: time
  };

  handleFormData(formInfo);
};

const speech = {
  openCommandsModal: () => {
    artyom.say('Here are a list of voice commands. You can doo things like create an event, opening websites and search YouTube.');
  },
  openTransitModal: () => {
    artyom.say('Please select your transportation mode. I will notify you if there is traffic, and when you need to leave by, to arrive on time.');
  },
  openSettingsModal: () => {
    artyom.say('Please enter the number where you would like to receive traffic text notifications. This can be changed at any time.');
  }
};

/********************************************************
  ARTYOM COMMANDS
********************************************************/

const commands = [
  {
    indexes: ['stop listening'],
    action: (i) => { artyomStop(); }
  },
  {
    indexes: ['what time is it'],
    action: (i) => { artyom.say(`It is currently ${getTime()}.`); }
  },
  {
    indexes: ['what\'s the date today'],
    action: (i) => { artyom.say(`Today is ${getDate()}.`); }
  },
  {
    indexes: ['open *', 'go to *'],
    smart: true,
    action: (i, wildcard) => {
      artyom.say(`Opening ${wildcard.replace('.', ' dot ')}.`);
      window.open(`http://${wildcard}`);
    }
  },
  {
    indexes: ['search YouTube for *'],
    smart: true,
    action: (i, wildcard) => {
      artyom.say(`Searching YouTube for ${wildcard}.`);
      window.open(`https://www.youtube.com/results?search_query=${wildcard}`);
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
];

/********************************************************
  EXPORTS
********************************************************/

module.exports = {
  artyomStart,
  artyomStop,
  fillOutForm: fillOutForm,
  addCommands: artyom.addCommands,
  commands,
  onFillOutForm: (callback) => {
    handleFormData = callback;
  },
  speech
};