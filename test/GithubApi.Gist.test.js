const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const { expect } = chai;
const githubUserName = 'aperdomob';
const config = require('./GithubApi.Config');

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

    describe(`When the user sends a POST to create a gist on ${githubUserName}'s github account`,
      () => {
        before(async () => {
          gist = await config.getAgent()
            .post(`${config.getBaseURL()}/gists`, newGist)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
          id = gist.body.id;
        });

        it('Then the gist is created successfuly', () => {
          expect(gist.status).to.equal(config.getStatusCode().CREATED);
          expect(gist.body).to.containSubset(newGist);
        });
      });
  });

  describe('Given the id of a gist', () => {
    describe('When the gist is retrieved', () => {
      let gist;

      before(async () => {
        const response = await config.getAgent()
          .get(`${config.getBaseURL()}/gists/${id}`)
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
        response = await config.getAgent()
          .delete(`${config.getBaseURL()}/gists/${id}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it("Then the gist doesn't exist", () => {
        expect(response.status).to.equal(config.getStatusCode().NO_CONTENT);
      });
    });
  });
});
