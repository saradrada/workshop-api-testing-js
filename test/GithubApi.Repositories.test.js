const agent = require('superagent');
const statusCode = require('http-status-codes');
const md5 = require('md5');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const { expect } = chai;

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repositoryName = 'jasmine-awesome-report';

describe('Github Api Test', () => {
  describe('Scenario: Consume GET Service', () => {
    describe(`Given we have ${githubUserName}'s data`, () => {
      let user;
      // runs once before all the test in a describe
      before(async () => {
        const response = await agent
          .get(`${urlBase}/users/${githubUserName}`)
          .set('User-Agent', 'agent');

        user = response.body;
      });

      it("When we verify the user's name, company and location", async () => {
        expect(user.name).equal('Alejandro Perdomo');
        expect(user.company).equal('PSL');
        expect(user.location).equal('Colombia');
      });
    });

    let foundedRepository;
    describe(`Given we have the repository list of ${githubUserName} `, () => {
      let repositories;
      before(async () => {
        const response = await agent
          .get(`${urlBase}/users/${githubUserName}/repos`)
          .set('User-Agent', 'agent');

        repositories = response.body;
      });

      it(`When we check if contains the ${repositoryName} repository`, () => {
        foundedRepository = repositories.find(
          (repository) => repository.name === 'jasmine-awesome-report'
        );

        expect(foundedRepository.full_name).to.equal(
          'aperdomob/jasmine-awesome-report'
        );
        expect(foundedRepository.private).to.be.equal(false);
        expect(foundedRepository.description).to.be.equal(
          'An awesome html report for Jasmine'
        );
      });
    });

    describe(`Given that we downloaded the ${repositoryName} repository as a .zip`, () => {
      let repoAsZip;

      before(async () => {
        const response = await agent.get(
          `${foundedRepository.svn_url}/archive/master.zip`
        );
        repoAsZip = response;
      });

      it('When we check that the file donwloaded properly', () => {
        expect(repoAsZip.status).to.equal(statusCode.OK);
      });
    });

    describe(`Given we have the content list of the ${repositoryName} repository`, () => {
      let contents;
      const expectedSubset = {
        name: 'README.md',
        path: 'README.md',
        sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
      };

      before(async () => {
        const response = await agent
          .get(`${urlBase}/repos/${githubUserName}/${repositoryName}/contents`)
          .set('User-Agent', 'agent');
        contents = response.body;
      });

      it('When we check the name, path and sha of the README.md file', () => {
        const readmeFile = contents.find((file) => file.name === expectedSubset.name);
        expect(readmeFile).to.containSubset(expectedSubset);
      });
    });

    describe('When we donwload the README.md file', () => {
      let readmeFile;
      const expectedMd5 = '3449c9e5e332f1dbb81505cd739fbf3f';

      before(async () => {
        const response = await agent
          .get('https://raw.githubusercontent.com/aperdomob/jasmine-awesome-report/development/README.md')
          .set('User-Agent', 'agent');

        readmeFile = response;
      });

      it('When we check the md5 of the README.file', () => {
        expect(md5(readmeFile)).to.equal(expectedMd5);
      });
    });
  });
});
