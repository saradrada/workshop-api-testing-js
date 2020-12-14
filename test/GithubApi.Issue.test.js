const chai = require('chai');
const { expect } = chai;
const githubUserName = 'saradrada';
const config = require('./GithubApi.Config');

describe('Scenario: Consume POST and PATCH services', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    let user;

    describe(`When a GET request is sent to retrieves ${githubUserName}'s information`, () => {
      before(async () => {
        const response = await config.getAgent()
          .get(`${config.getBaseURL()}/user`)
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
    describe(`When a GET request is sent to get ${githubUserName}'s repository list`, () => {
      before(async () => {
        const response = await config.getAgent()
          .get(`${config.getBaseURL()}/users/${githubUserName}/repos`)
          .set('User-Agent', 'agent');
        list = response.body;
      });

      it('Then at least one repository of the list exists', () => {
        repository = list[0];
        expect(repository).to.exist;
        expect(list).to.have.lengthOf.at.least(1);
      });
    });
  });

  describe("Given we have the user's data", () => {
    let issue;
    describe('When a POST request is sent to create an issue', () => {
      before(async () => {
        const response = await config.getAgent()
          .post(`${config.getBaseURL()}/repos/${githubUserName}/${repository.name}/issues`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .send({ title: 'Title 2 new issue' });

        issue = response;
      });

      it('Then the issue is created successfully', () => {
        expect(issue.body.title).to.equal('Title 2 new issue');
        expect(issue.body.body).to.be.null;
      });
    });
  });

  describe('Given an issue', () => {
    let modifiedIssue;
    const issueNumber = 6;

    describe('When a PATCH request is sent to modify the issue', () => {
      before(async () => {
        const response = await config.getAgent()
          .patch(`${config.getBaseURL()}/repos/${githubUserName}
          /${repository.name}/issues/${issueNumber}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .send({ body: `Modified body of the issue number ${issueNumber}` });

        modifiedIssue = response;
      });

      it('Then the issue is modified', () => {
        expect(modifiedIssue.body.title).to.equal('Title 2 new issue');
        expect(modifiedIssue.body.body).to.equal
        (`Modified body of the issue number ${issueNumber}`);
      });
    });
  });
});
