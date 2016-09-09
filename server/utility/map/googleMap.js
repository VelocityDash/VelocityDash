const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

const mapTraffic = (data, event) => {
  return {
    url,
    qs: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      origins: data.dataValues.geolocation,
      destinations: event.dataValues.location,
      mode: data.dataValues.transitmode,
      departure_time: 'now',
      units: 'imperial',
      traffic_model: 'best_guess'
    }
  };  
};

const mapTravel = (data, event) => {
  return {
    url,
    qs: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      origins: data.dataValues.geolocation,
      destinations: event.dataValues.location,
      mode: data.dataValues.transitmode,
      arrival_time: event.dataValues.startdatetime,
      units: 'imperial'
    }
  };
};

module.exports = {
  mapTraffic,
  mapTravel
};