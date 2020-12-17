const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;
const statusCode = require('http-status-codes');
const newGist = require('./commons/fixtures/Gist');
const request = require('./Request').instance;

const githubUserName = 'aperdomob';

describe('Scenario: Consume DELETE Service', () => {
  describe('Given a gist object', () => {
    let gist;

    describe(`When the user sends a POST to create a gist on ${githubUserName}'s github account`, () => {
      before(async () => {
        gist = await request.post('gists', newGist.gist);
      });

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(statusCode.CREATED);
        expect(gist.body).to.containSubset(newGist.gist);
      });
    });
  });

  describe('Given a gist', () => {
    let gist;
    let id;

    before(async () => {
      const res = await request.post('gists', newGist.gist);
      id = res.body.id;
    });

    describe('When the gist is retrieved', () => {
      before(async () => {
        const response = await request.get(`gists/${id}`);
        gist = response.body;
      });

      it('Then the gist exists', () => {
        expect(gist).to.exist;
        expect(gist.id).to.equal(id);
        expect(gist.public).to.equal(true);
      });
    });

    describe('When the gist is eliminated', () => {
      let response;

      before(async () => {
        response = await request.delete(`gists/${id}`);
      });

      it("Then the gist doesn't exist", () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });
    });
  });
});
