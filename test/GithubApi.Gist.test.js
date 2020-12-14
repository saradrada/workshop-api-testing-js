const { StatusCodes } = require('http-status-codes');
const agent = require('superagent');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;

const baseURL = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Scenario: Consume DELETE Service', () => {
  let id;
  describe('Given a gist object', () => {
    let gist;
    let newGist;
    before(async () => {
      newGist = {
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
    });

    describe(`When the user sends a POST to create a gist on ${githubUserName}'s github account`, () => {
      before(async () => {
        gist = await agent
          .post(`${baseURL}/gists`, newGist)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
        id = gist.body.id;
      });

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(StatusCodes.CREATED);
        expect(gist.body).to.containSubset(newGist);
      });
    });
  });

  describe('Given the id of a gist', () => {
    describe('When the gist is retrieved', () => {
      let gist;

      before(async () => {
        const response = await agent
          .get(`${baseURL}/gists/${id}`)
          .set('User-Agent', 'agent');
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
        response = await agent
          .delete(`${baseURL}/gists/${id}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Then the gist doesn\'t exist', () => {
        expect(response.status).to.equal(StatusCodes.NO_CONTENT);
      });
    });
  });
});
