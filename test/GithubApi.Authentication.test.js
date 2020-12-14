const { expect } = require('chai');
const config = require('./GithubApi.Config');

const urlBase = 'https://api.github.com';
const githubUserName = 'saradrada';
const repository = 'workshop-api-testing-js';

describe('Github Api Test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await config
        .getAgent()
        .get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(config.getStatusCode().OK);
      expect(response.body.description).equal(
        "PSL's workshop about Api Testing in JavaScript"
      );
    });

    it('Via OAuth2 Tokens by parameter', () => config
      .getAgent()
      .get(`${urlBase}/repos/${githubUserName}/${repository}`)
      .query(`access_token=${process.env.ACCESS_TOKEN}`)
      .set('User-Agent', 'agent')
      .then((response) => {
        expect(response.status).to.equal(config.getStatusCode().OK);
        expect(response.body.description).equal(
          "PSL's workshop about Api Testing in JavaScript"
        );
      }));
  });
});
