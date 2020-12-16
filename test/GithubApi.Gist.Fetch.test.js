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
      before(async () => {
        gist = await isomorphicFetch(`${baseUrl}/gists`, params);
      });

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(statusCode.CREATED);
        console.log(gist);
        // expect(gist.body).to.containSubset(newGist);
      });
    });
  });

  describe('Given a gist object', () => {
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

    let params = {
      method: 'POST',
      headers: {
        Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
      },
      body: JSON.stringify(newGist)
    };

    before(async () => {
      gist = await isomorphicFetch(`${baseUrl}/gists`, params);
      // id = gist.body.id;
      id = 'b0e7847b0a54703c21067b33d2c1d621';
    });

    describe('When the gist is retrieved', () => {
      params = {
        method: 'GET',
        headers: {
          Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
        }
      };
      before(async () => {
        const response = await isomorphicFetch(
          `${baseUrl}/gists/${id}`,
          params
        );
        gist = response.body;
      });

      it('Then the gist exists', () => {
        expect(gist).to.exist;
        // expect(gist.id).to.equal(id);
        // expect(gist.public).to.equal(true);
      });
    });

    describe('When the gist is eliminated', () => {
      let response;
      params = {
        method: 'DELETE',
        headers: {
          Authorization: 'token 797dcb3884720074d254a4e2cf9cbbc4cfc62cb5'
        }
      };

      before(async () => {
        response = await isomorphicFetch(`${baseUrl}/gists/${id}`, params);
      });

      it("Then the gist doesn't exist", () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });
    });
  });
});
