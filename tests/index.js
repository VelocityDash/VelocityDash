const app = require('./../server/app.js');
const chai = require('chai');
const request = require('supertest');
// const sinon = require('sinon');
var addTravel = require('./../server/utility/addTravel.js');
const expect = chai.expect;


describe('server integration testing', () => {
  before((done) => {
    server = app.listen(3030, () => {
      console.log('Test server is listening on 3030');
      setTimeout(function() {
        done();
      }, 3000);
    });
  })

  after(() => {
    server.close();
  })

  describe('/test', () => {
    it('should return 200', (done) => {
      request(server)
      .get('/api/test')
      .expect(200)
      .end((err, res) => {
        done();
      })
    });
  })

  describe('/api/calendar/addEvent', () => {
    it('should return the calendar data object', (done) => {
      // depending on how long the server is running, it will add the event into the database, and do the rest of the work but done() is called after getting back the response from Google Calendar API. 
      var body = {
        summary: 'Chilling',
        location: 'Sutro Baths, San Francisco', 
        start: {
          dateTime: '2016-08-16T19:30:00-07:00',
          timeZone: 'America/Los_Angeles'
        },
        end: {
          dateTime: '2016-08-16T20:30:00-07:00',
          timeZone: 'America/Los_Angeles'
        }
      };
      request(server)
      .post('/api/calendar/addEvent')
      .send(body)
      // BE CAREFUL ABOUT SEND, IT IS THE REQ.BODY, AND SUPERTEST WILL STRINGIFY OBJECT FOR YOU
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        expect(res.body.status).to.equal('confirmed');
        setTimeout(() => {
          // done is in setTimeout to let the rest of the larger function run
          done();
        }, 2000);
      })
    });
  });

  describe('/api/calendar/getDayEvents', () => {

    // in the future, should test to make sure the events are for the right day, could maybe do a string comparison with Date.now()
    it('should return the events for today', (done) => {
      request(server)
      .get('/api/calendar/getDayEvents')
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.property('id');
        expect(res.body[0]).to.have.property('googleCalendarEventId');
        expect(res.body).to.be.instanceof(Array);
        done();
      })
    });
  })


})