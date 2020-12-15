const chai = require('chai');

const { expect } = chai;

const githubUserName = 'saradrada';
const request = require('./Request').instance;

describe('Scenario: Consume POST and PATCH services', () => {
  describe(`Given ${githubUserName}'s github account`, () => {
    let user;

    describe(`When a GET request is sent to retrieves ${githubUserName}'s information`, () => {
      before(async () => {
        const response = await request.get('user');
        user = response.body;
      });

      it('Then the user has at least 1 public repository', () => {
        expect(user.public_repos).to.be.above(0);
      });
    });
  });

  let repository;
  describe(`Given ${githubUserName}'s github account`, () => {
    let list;
    describe(`When a GET request is sent to get ${githubUserName}'s repository list`, () => {
      before(async () => {
        const response = await request.get(`users/${githubUserName}/repos`);
        list = response.body;
      });

      it('Then at least one repository of the list exists', () => {
        repository = list[0];
        expect(repository).to.exist;
        expect(list).to.have.lengthOf.at.least(1);
      });
    });
  });

  describe(`Given ${githubUserName}'s github account`, () => {
    let issue;
    const modifications = { title: 'Title 3 new issue' };

    before(async () => {
      const response = await request.get(`users/${githubUserName}/repos`);
      const list = response.body;
      repository = list[0];
    });

    describe('When a POST request is sent to create an issue', () => {
      before(async () => {
        issue = await request.post(
          `repos/${githubUserName}/${repository.name}/issues`,
          modifications
        );
      });

      it('Then the issue is created successfully', () => {
        expect(issue.body.title).to.equal('Title 3 new issue');
        expect(issue.body.body).to.be.null;
      });
    });
  });

  describe('Given an issue', () => {
    let modifiedIssue;
    let issueNumber;
    let modifications;

    describe('When a PATCH request is sent to modify the issue', () => {
      before(async () => {
        const req = await request.get(`users/${githubUserName}/repos`);
        repository = req.body[0];

        modifications = { title: 'Issue to be modify' };
        const issue = await request.post(
          `repos/${githubUserName}/${repository.name}/issues`,
          modifications
        );
        issueNumber = issue.body.number;

        modifications = {
          body: `Modified body of the issue number ${issueNumber}`
        };
        modifiedIssue = await request.patch(
          `repos/${githubUserName}/${repository.name}/issues/${issueNumber}`,
          modifications
        );
      });

      it('Then the issue is modified', () => {
        expect(modifiedIssue.body.title).to.equal('Issue to be modify');
        expect(modifiedIssue.body.body).to.equal(
          `Modified body of the issue number ${issueNumber}`
        );
      });
    });
  });
});
