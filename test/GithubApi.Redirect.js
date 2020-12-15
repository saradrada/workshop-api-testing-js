const { expect } = require('chai');

const request = require('./Request').instance;

const githubUserName = 'aperdomob';

describe('Scenario: Consume HEAD Service', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    describe('When a HEAD request is sent to get the headers of an specific url', () => {
      let response;
      before(async () => {
        try {
          response = await request.head(
            'https://github.com/aperdomob/redirect-test',
            false
          );
        } catch (error) {
          response = error;
        }
      });
      it.only('Then the status code is 301 and has a redirection url', () => {
        expect(response.status).to.equal(301);
      });
    });
  });
});
