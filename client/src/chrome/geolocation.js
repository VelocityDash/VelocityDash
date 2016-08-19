const getGeolocation = () => {
  let geoOptions = { timeout: 10000 };
  
  const geoSuccess = (position) => {
    let geolocation = `${position.coords.latitude} ${position.coords.longitude}`;

    fetch('http://localhost:9000/api/users/getGeolocation')
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
  fetch('http://localhost:9000/api/users/updateGeolocation', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ geolocation })
  })
  .then((success) => {
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