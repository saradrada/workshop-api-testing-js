const chai = require('chai');
const request = require('./Request').instance;
const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');

const { expect } = chai;
chai.use(require('chai-json-schema'));

describe('Given event Github API resources', () => {
  describe('When a GET request is sent to get the list of public events', () => {
    let response;

    before(async () => {
      response = await request.get('events');
    });

    it('Then the body should have a schema', () => expect(response).to.be.jsonSchema(listPublicEventsSchema));
  });
});
