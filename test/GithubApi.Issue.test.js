const agent = require('superagent');
const chai = require('chai');

const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'saradrada';

describe('Scenario: Consume POST and PATCH services', () => {
  describe("Given we have the user's information", () => {
    let user;
    before(async () => {
      const response = await agent
        .get(`${urlBase}/user`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = response.body;
    });

    it('When we check the user has at least 1 public repository', () => {
      expect(user.public_repos).to.be.above(0);
    });
  });

  let repositoryName;
  describe(`Given we have ${githubUserName}'s list of repositories`, () => {
    let list;
    before(async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUserName}/repos`)
        .set('User-Agent', 'agent');
      list = response.body;
    });

    it('When we check that at least one reposotory exists', () => {
      const repo = list[0];
      repositoryName = repo.name;
      expect(repo).to.exist;
    });
  });

  describe("Given we have the user's data", () => {
    let issue;
    before(async () => {
      const response = await agent
        .post(`${urlBase}/repos/${githubUserName}/${repositoryName}/issues`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .send({ title: 'Title 2 new issue' });

      issue = response;
    });

    it('When we create an issue', () => {
      expect(issue.body.title).to.equal('Title 2 new issue');
      expect(issue.body.body).to.be.null;
    });
  });

  describe('Given we created an issue', () => {
    let modifiedIssue;
    const issueNumber = 6;
    before(async () => {
      const response = await agent
        .patch(`${urlBase}/repos/${githubUserName}/${repositoryName}/issues/${issueNumber}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .send({ body: `Modified body of the issue number ${issueNumber}` });

      modifiedIssue = response;
    });

    it('When we modify an issue', () => {
      expect(modifiedIssue.body.title).to.equal('Title 2 new issue');
      expect(modifiedIssue.body.body).to.equal(`Modified body of the issue number ${issueNumber}`);
    });
  });
});
