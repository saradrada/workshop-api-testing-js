/* const agent = require('superagent');
const chai = require('chai');

const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'saradrada';

describe('Scenario: Consume POST and PATCH services', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    let user;

    describe(`When sends a GET request to retrieves ${githubUserName}'s information`, () => {
      before(async () => {
        const response = await agent
          .get(`${urlBase}/user`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
        user = response.body;
      });

      it('Then we check the user has at least 1 public repository', () => {
        expect(user.public_repos).to.be.above(0);
      });
    });

  });

  let repository;
  describe(`Given ${githubUserName}'s github account`, () => {
    let list;
    describe(`When sends a GET request to get ${githubUserName}'s repository list`, () => {
      before(async () => {
        const response = await agent
          .get(`${urlBase}/users/${githubUserName}/repos`)
          .set('User-Agent', 'agent');
        list = response.body;
      });

      it('Then at least one repository of the list exists', () => {
        repository = list[0];
        expect(repo).to.exist;
        expect(list.size).to.have.lengthOf.at.least(1);
      });
    });
  });

  describe("Given we have the user's data", () => {
    let issue;
    before(async () => {
      const response = await agent
        .post(`${urlBase}/repos/${githubUserName}/${repository.name}/issues`)
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
}); */
