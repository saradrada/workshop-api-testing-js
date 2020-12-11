const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');
const agent = require('superagent');

const baseURL = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Scenario: Consume DELETE Service', () => {
  describe(`Given we can create a gist on ${githubUserName}'s github account`, () => {
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
    before(async () => {
      const response = await agent
        .post(`${baseURL}/gists`, newGist)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      gist = response;
    });

    it('When we check we created the gist', () => {
      expect(gist.status).to.equal(StatusCodes.CREATED);
      expect(gist.body).to.containSubset(newGist);
    });
  });

  describe('Given a gist', () => {
    describe('When the gist is retrieved', () => {
      let gist;
      const gistId = 'ba6c6d4219ef9ad2d49d8031224be5e7';
      before(async () => {
        const response = await agent
          .get(`${baseURL}/gists/${gistId}`)
          .set('User-Agent', 'agent');

        gist = response;
      });

      it('Then the gist is created correctly', () => {
        expect(gist).to.exist;
      });
    });
  });
});
