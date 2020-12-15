const chai = require('chai');

const { expect } = chai;
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const request = require('./Request');

describe('Scenario: Consume PUT Service', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    let response;

    describe('When a PUT request is sent to follow the account', () => {
      before(async () => {
        response = await request.put(`user/following/${githubUserName}`);
      });

      it(`Then ${githubUserName}'s github account is followed`, () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.be.empty;
      });
    });
  });

  describe(`Given ${githubUserName}'s followers list`, () => {
    let list;

    describe('When a GET request is sent to get all followers', () => {
      before(async () => {
        const response = await request.get('user/following');
        list = response.body;
      });

      it(`Then ${githubUserName}'s github account is followed`, () => {
        const user = list.find((u) => u.login === githubUserName);
        expect(user).to.exist;
        expect(user.login).to.equal(githubUserName);
        expect(user.url).to.equal(`${urlBase}/users/${githubUserName}`);
      });
    });
  });

  describe(`Given ${githubUserName}'s github account`, () => {
    let response;
    let list;

    describe('When a PUT request is sent to follow the account', () => {
      before(async () => {
        response = await request.put(`user/following/${githubUserName}`);
        const responseList = await request.get('user/following');
        list = responseList.body;
      });

      it('Then the idempotency of the method is correct', () => {
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
});
