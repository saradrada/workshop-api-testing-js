const chai = require('chai');

const { expect } = chai;

const responseTime = require('superagent-response-time');
const request = require('./Request').instance;

describe('Scenario: Consume HEAD Service', () => {
  describe('Given github users', () => {
    describe('When a GET request is sent to get all users', () => {
      let resTime;
      before(async () => {
        const callback = (req, time) => {
          resTime = time;
        };
        await request.get('users').use(responseTime(callback));
      });
      it.only('Then the response time is less than 5 seconds', () => {
        expect(resTime).to.be.below(5000);
      });
    });
  });
});
