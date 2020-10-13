const agent = require('superagent');

const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repositoryName = 'jasmine-awesome-report';

describe('Github Api Test', () => {
  describe('Consume GET Service', () => {
    describe("Verification of user's data", () => {
      let user;
      // runs once before all the test in a describe
      before(async () => {
        const response = await agent
          .get(`${urlBase}/users/${githubUserName}`)
          .set('User-Agent', 'agent');

        user = response.body;
      });

      it("Verification of user's name, company and location", async () => {
        expect(user.name).equal('Alejandro Perdomo');
        expect(user.company).equal('PSL');
        expect(user.location).equal('Colombia');
      });
    });
  });

  describe('Verify if the repository list contains the expected repository', () => {
    let repositories;
    before(async () => {
      const response = await agent
        .get(`${urlBase}/users/${githubUserName}/repos`)
        .set('User-Agent', 'agent');

      repositories = response.body;
    });

    it(`Check if contains the ${repositoryName} repository`, () => {
      const repo = repositories.find(
        (repository) => repository.name === 'jasmine-awesome-report'
      );

      expect(repo.full_name).to.equal('aperdomob/jasmine-awesome-report');
      expect(repo.private).to.be.equal(false);
      expect(repo.description).to.be.equal('An awesome html report for Jasmine');
    });
  });
});
