const isomorphicFetch = require('isomorphic-fetch');
const chai = require('chai');
const statusCode = require('http-status-codes');

const { expect } = chai;

const baseUrl = 'https://api.github.com';
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
    const params = {
      method: 'POST',
      headers: {
        Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
      },
      body: JSON.stringify(newGist)
    };

    describe(`When a POST request is sent to create a gist on ${githubUserName}'s github account`, () => {
      let gistJson;
      before(async () => {
        gist = await isomorphicFetch(`${baseUrl}/gists`, params);
        gistJson = await gist.json();
      }, 20000);

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(statusCode.CREATED);
        expect(gistJson).to.containSubset(newGist);
      });
    });
  });

  describe('Given a gist object', () => {
    let gist;
    let gistJson;
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

    const paramsPost = {
      method: 'POST',
      headers: {
        Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
      },
      body: JSON.stringify(newGist)
    };

    before(async () => {
      gist = await isomorphicFetch(`${baseUrl}/gists`, paramsPost);
      gistJson = await gist.json();
      id = gistJson.id;
    }, 20000);

    describe('When the gist is retrieved', () => {
      const paramsGet = {
        method: 'GET',
        headers: {
          Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
        }
      };

      before(async () => {
        const response = await isomorphicFetch(
          `${baseUrl}/gists/${id}`,
          paramsGet
        );
        gistJson = await response.json();
      }, 20000);

      it('Then the gist exists', () => {
        expect(gistJson).to.exist;
        expect(gistJson.id).to.equal(id);
        expect(gistJson.public).to.equal(true);
      });
    });

    describe('When the gist is eliminated', () => {
      let response;

      const paramsDelete = {
        method: 'DELETE',
        headers: {
          Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
        }
      };

      before(async () => {
        response = await isomorphicFetch(`${baseUrl}/gists/${id}`, paramsDelete);
      });

      it("Then the gist doesn't exist", () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });
    });
  });
});
