const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;
const statusCode = require('http-status-codes');
const md5 = require('md5');

const githubUserName = 'aperdomob';
const repositoryName = 'jasmine-awesome-report';
const request = require('./Request').instance;

describe('Github Api Test', () => {
  describe('Scenario: Consume GET Service', () => {
    describe(`Given ${githubUserName}'s github account`, () => {
      let user;

      describe(`When a GET request is sent to retrieve ${githubUserName}'s information`, () => {
        before(async () => {
          const response = await request.get(`users/${githubUserName}`);
          user = response.body;
        });

        it(`Then the ${githubUserName}'s name, company and location are the expected`, async () => {
          expect(user.name).equal('Alejandro Perdomo');
          expect(user.company).equal('PSL');
          expect(user.location).equal('Colombia');
        });
      });

      let foundedRepository;
      describe(`When a GET request is sent to get ${githubUserName}'s repositories`, () => {
        let repositories;
        before(async () => {
          const response = await request.get(`users/${githubUserName}/repos`);
          repositories = response.body;
          foundedRepository = repositories.find(
            (repository) => repository.name === 'jasmine-awesome-report'
          );
        });

        it(`Then the list of repositories contains the ${repositoryName} repository`, () => {
          expect(foundedRepository.full_name).to.equal(
            'aperdomob/jasmine-awesome-report'
          );
          expect(foundedRepository.private).to.be.equal(false);
          expect(foundedRepository.description).to.be.equal(
            'An awesome html report for Jasmine'
          );
        });
      });

      describe(`When a GET request is sent to download ${repositoryName} repository as a .zip`, () => {
        let repoAsZip;

        before(async () => {
          const response = await request.get(`users/${githubUserName}/repos`);
          const repositories = response.body;

          foundedRepository = repositories.find(
            (repository) => repository.name === 'jasmine-awesome-report'
          );

          repoAsZip = await request.get(
            `${foundedRepository.svn_url}/archive/master.zip`,
            false
          );
        });

        it('Then file is donwloaded properly', () => {
          expect(repoAsZip.status).to.equal(statusCode.OK);
          expect(repoAsZip.headers['content-type']).to.equal('application/zip');
          expect(repoAsZip.ok).to.be.true;
        });
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
        const response = await request.get(
          `repos/${githubUserName}/${repositoryName}/contents`
        );
        contents = response.body;
      });

      it('Then the name, path and sha of the README.md file are the expected', () => {
        const readmeFile = contents.find(
          (file) => file.name === expectedSubset.name
        );
        expect(readmeFile).to.containSubset(expectedSubset);
      });
    });

    describe('Given a README.md file', () => {
      let readmeFile;
      const expectedMd5 = '3449c9e5e332f1dbb81505cd739fbf3f';

      describe('When a GET request is sent to retrieve the README.md file', () => {
        before(async () => {
          const response = await request.get('https://raw.githubusercontent.com/aperdomob/jasmine-awesome-report/development/README.md', false);
          readmeFile = response;
        });

        it('Then the md5 of the README.file is the expected', () => {
          expect(md5(readmeFile)).to.equal(expectedMd5);
          expect(md5(readmeFile).length).to.be.above(0);
          expect(readmeFile.header['content-type']).to.equal(
            'text/plain; charset=utf-8'
          );
          expect(readmeFile.status).to.equal(statusCode.OK);
        });
      });
    });
  });
});
