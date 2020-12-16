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
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify(newGist)
    };

    describe(`When a POST request is sent to create a gist on ${githubUserName}'s github account`, () => {
      before(async () => {
        gist = await isomorphicFetch(`${baseUrl}/gists`, params);
      });

      it.only('Then the gist is created successfuly', () => {
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

    let params = {
      method: 'POST',
      headers: {
        Authorization: `${process.env.ACCESS_TOKEN}`,
        'User-Agent': 'agent'
      },
      body: JSON.stringify(newGist)
    };

    before(async () => {
      const res = await isomorphicFetch(`${baseUrl}/gists`, params);
      id = res.body.id;
    });

    describe('When the gist is retrieved', () => {
      params = {
        method: 'GET',
        headers: {
          Authorization: `${process.env.ACCESS_TOKEN}`,
          'User-Agent': 'agent'
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
        expect(gist.id).to.equal(id);
        expect(gist.public).to.equal(true);
      });
    });

    describe('When the gist is eliminated', () => {
      let response;
      params = {
        method: 'DELETE',
        headers: {
          Authorization: `${process.env.ACCESS_TOKEN}`,
          'User-Agent': 'agent'
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
