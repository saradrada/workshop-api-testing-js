const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Scenario: Consume PUT Service', () => {
  describe(`Given we follow ${githubUserName}'s github account`, () => {
    let response;

    before(async () => {
      response = await agent
        .put(`${urlBase}/user/following/${githubUserName}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it(`When we check we're actually following ${githubUserName}'s github account`, () => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.be.empty;
    });
  });

  describe('Given we have the followers list', () => {
    let list;

    before(async () => {
      const response = await agent
        .get(`${urlBase}/user/following`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      list = response.body;
    });

    it(`When we check we're following ${githubUserName}'s github account`, () => {
      const user = list.find((u) => u.login === githubUserName);
      expect(user).to.exist;
      expect(user.login).to.equal(githubUserName);
      expect(user.url).to.equal(`${urlBase}/users/${githubUserName}`);
    });
  });

  describe(`Given we follow want to follow ${githubUserName}'s github account again`, () => {
    let response;
    let list;

    before(async () => {
      response = await agent
        .put(`${urlBase}/user/following/${githubUserName}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      const responseList = await agent
        .get(`${urlBase}/user/following`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      list = responseList.body;
    });

    it('When we check the idempotency of the method', () => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.be.empty;

      const user = list.find((u) => u.login === githubUserName);
      expect(user).to.exist;
      expect(user.login).to.equal(githubUserName);
      expect(user.url).to.equal(`${urlBase}/users/${githubUserName}`);

      const listDuplicated = list.filter((u) => u.login === githubUserName);
      expect(listDuplicated.length).to.equal(1);
    });
  });
});
