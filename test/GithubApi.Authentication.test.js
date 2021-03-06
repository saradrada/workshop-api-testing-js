const { expect } = require('chai');
const agent = require('superagent');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const githubUserName = 'saradrada';
const repository = 'workshop-api-testing-js';
const request = require('./Request').instance;

describe('Github Api Test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await request.get(
        `repos/${githubUserName}/${repository}`
      );

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).equal(
        "PSL's workshop about Api Testing in JavaScript"
      );
    });

    it('Via OAuth2 Tokens by parameter', () => agent
      .get(`${urlBase}/repos/${githubUserName}/${repository}`)
      .query(`access_token=${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent')
      .then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.description).equal(
          "PSL's workshop about Api Testing in JavaScript"
        );
      }));
  });
});
