/* const chai = require('chai');
const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');

const { expect } = chai;
chai.use(require('chai-json-schema')); */
const request = require('./Request').instance;

describe('Given event Github API resources', () => {
  describe('When wanna verify the List public events', () => {
    let response;

    before(async () => {
      response = await request.get('events');
    });

    it.only('Then the body should have a schema', () => {
      console.log(response);
    });
  });
});
