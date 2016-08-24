// TODO: FIX BUGS.
// It will attempt to make a fetch even if the user is not logged in yet. It also handles all responses as success even though if they have no token, the server will block the API endpoint and return an error status code.
const getGeolocation = () => {
  let geoOptions = { timeout: 10000 };




  const geoSuccess = (position) => {
    let geolocation = `${position.coords.latitude} ${position.coords.longitude}`;
      // add token here too;
    var token = localStorage.getItem('token');
    fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/api/users/getGeolocation', {
      method: 'GET',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // If current geolocation doesn't match geolocation in DB, then update DB
      if (data.geolocation !== geolocation) {
        updateGeolocation(geolocation);
      } else {
        console.log('Geolocation not updated as current geolocation has not changed.');
      }
    })
    .catch((err) => {
      console.log('Error retrieving user\'s geolocation from database.\n', err);
    });
  };

  const geoError = (error) => {
    if (error.code === 0) {
      console.log(`Geolocation error occurred: unknown error`);
    } else if (error.code === 1) {
      console.log(`Geolocation error occurred: permission denied`);
    } else if (error.code === 2) {
      console.log(`Geolocation error occurred: position unavailable`);
    } else if (error.code === 3) {
      console.log(`Geolocation error occurred: timed out`);
    }
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

const updateGeolocation = (geolocation) => {
  var token = localStorage.getItem('token');

  fetch('http://ec2-52-43-234-146.us-west-2.compute.amazonaws.com/api/users/updateGeolocation', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({ geolocation })
  })
  .then((success) => {
    // this is buggy, always returning success, ex: even if it doesn't have the token
    console.log('Geolocation was successfully updated!');
  })
  .catch((err) => {
    console.log('An error occurred while updating geolocation.');
  });
};

getGeolocation();

// Checks for user's geolocation every 10 minutes
setInterval(() => {
  getGeolocation();
}, 600000);
