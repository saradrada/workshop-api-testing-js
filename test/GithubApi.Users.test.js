const chai = require('chai');

const { expect } = chai;

const responseTime = require('superagent-response-time');
const request = require('./Request').instance;

describe('Scenario: Consume HEAD Service', () => {
  let userList;
  let listSize;
  describe('Given github users', () => {
    describe('When a GET request is sent to get all users', () => {
      let resTime;
      before(async () => {
        const callback = (req, time) => {
          resTime = time;
        };
        userList = await request.get('users').use(responseTime(callback));
        listSize = Object.keys(userList.body).length;
      });

      it('Then the response time is less than 5 seconds', () => {
        expect(resTime).to.be.below(5000);
      });

      it("And the user's list size is 30 (default size)", () => {
        expect(listSize).to.equal(30);
      });
    });

    describe('When a GET request is sent to gett only 10 users', () => {
      before(async () => {
        userList = await request.get('users').query({ per_page: '10' });
        listSize = Object.keys(userList.body).length;
      });

      it("Then the user's list size is exactly 10", () => {
        expect(listSize).to.equal(10);
      });
    });

    describe('When a GET request is sent to gett only 50 users', () => {
      before(async () => {
        userList = await request.get('users').query({ per_page: '50' });
        listSize = Object.keys(userList.body).length;
      });

      it("Then the user's list size is exactly 50", () => {
        expect(listSize).to.equal(50);
      });
    });
  });
});
