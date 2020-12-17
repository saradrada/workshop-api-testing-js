const { expect } = require('chai');
const statusCode = require('http-status-codes');

const request = require('./Request').instance;

const githubUserName = 'aperdomob';

describe('Scenario: Consume HEAD Service', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    const redirectUrl = 'https://github.com/aperdomob/new-redirect-test';

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

      it('Then the status code is 301 and has a redirection url', () => {
        expect(response.status).to.equal(301);
        expect(response.response.headers.location).to.equal(redirectUrl);
      });
    });

    describe('When a GET request is sent to get a github repository', () => {
      let response;

      before(async () => {
        response = await request.get(redirectUrl, false);
      });

      it('Then gets the repository successfully', () => {
        expect(response.status).to.equal(statusCode.OK);
      });
    });
  });
});
