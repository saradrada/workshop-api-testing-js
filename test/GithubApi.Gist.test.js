const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;
const statusCode = require('http-status-codes');
const request = require('./Request').instance;

const githubUserName = 'aperdomob';

describe('Scenario: Consume DELETE Service', () => {
  describe('Given a gist object', () => {
    let gist;
    const newGist = {
      description: 'Gist description',
      public: true,
      files: {
        'example.tsx': {
          filename: 'example.tsx',
          type: 'text/plain',
          content: 'Example content'
        }
      }
    };

    describe(`When the user sends a POST to create a gist on ${githubUserName}'s github account`, () => {
      before(async () => {
        gist = await request.post('gists', newGist);
      }, 20000);

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(statusCode.CREATED);
        expect(gist.body).to.containSubset(newGist);
      });
    });
  });

  describe('Given a gist', () => {
    let gist;
    let id;
    const newGist = {
      description: 'Gist description',
      public: true,
      files: {
        'example.tsx': {
          filename: 'example.tsx',
          type: 'text/plain',
          content: 'Example content'
        }
      }
    };

    before(async () => {
      const res = await request.post('gists', newGist);
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
