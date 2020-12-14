const chai = require('chai');
const { expect } = chai;
const githubUserName = 'aperdomob';
const config = require('./GithubApi.Config');

describe('Scenario: Consume PUT Service', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    let response;

    describe('When a PUT request is sent to follow the account', () => {
      before(async () => {
        response = await config
          .getAgent()
          .put(`${config.getBaseURL()}/user/following/${githubUserName}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN); // For rate limiting
      });

      it(`Then ${githubUserName}'s github account is followed`, () => {
        expect(response.status).to.equal(config.getStatusCode().NO_CONTENT);
        expect(response.body).to.be.empty;
      });
    });
  });

  describe(`Given ${githubUserName}'s followers list`, () => {
    let list;

    describe('When a GET request is sent to get all followers', () => {
      before(async () => {
        const response = await config
          .getAgent()
          .get(`${config.getBaseURL()}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        list = response.body;
      });

      it(`Then ${githubUserName}'s github account is followed`, () => {
        const user = list.find((u) => u.login === githubUserName);
        expect(user).to.exist;
        expect(user.login).to.equal(githubUserName);
        expect(user.url).to.equal(
          `${config.getBaseURL()}/users/${githubUserName}`
        );
      });
    });
  });

  describe(`Given ${githubUserName}'s github account`, () => {
    let response;
    let list;

    describe('When a PUT request is sent to follow the accoung', () => {
      before(async () => {
        response = await config
          .getAgent()
          .put(`${config.getBaseURL()}/user/following/${githubUserName}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        const responseList = await config
          .getAgent()
          .get(`${config.getBaseURL()}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        list = responseList.body;
      });

      it('Then the idempotency of the method is verified', () => {
        expect(response.status).to.equal(config.getStatusCode().NO_CONTENT);
        expect(response.body).to.be.empty;

        const user = list.find((u) => u.login === githubUserName);
        expect(user).to.exist;
        expect(user.login).to.equal(githubUserName);
        expect(user.url).to.equal(
          `${config.getBaseURL()}/users/${githubUserName}`
        );

        const listDuplicated = list.filter((u) => u.login === githubUserName);
        expect(listDuplicated.length).to.equal(1);
      });
    });
  });
});
