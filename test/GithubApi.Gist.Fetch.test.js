const isomorphicFetch = require('isomorphic-fetch');
const chai = require('chai');
const statusCode = require('http-status-codes');
const newGist = require('./commons/fixtures/Gist');

const { expect } = chai;

const baseUrl = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Scenario: Consume DELETE Service with Isomorphic-Fetch', () => {
  describe('Given a gist object', () => {
    let gist;
    const params = {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify(newGist.gist)
    };

    describe(`When a POST request is sent to create a gist on ${githubUserName}'s github account`, () => {
      let gistJson;
      before(async () => {
        gist = await isomorphicFetch(`${baseUrl}/gists`, params);
        gistJson = await gist.json();
      });

      it('Then the gist is created successfuly', () => {
        expect(gist.status).to.equal(statusCode.CREATED);
        expect(gistJson).to.containSubset(newGist.gist);
      });
    });
  });

  describe('Given a gist object', () => {
    let gist;
    let gistJson;
    let id;

    const paramsPost = {
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      },
      body: JSON.stringify(newGist.gist)
    };

    before(async () => {
      gist = await isomorphicFetch(`${baseUrl}/gists`, paramsPost);
      gistJson = await gist.json();
      id = gistJson.id;
    });

    describe('When the gist is retrieved', () => {
      const paramsGet = {
        method: 'GET',
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      };

      before(async () => {
        const response = await isomorphicFetch(
          `${baseUrl}/gists/${id}`,
          paramsGet
        );
        gistJson = await response.json();
      });

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
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      };

      before(async () => {
        response = await isomorphicFetch(
          `${baseUrl}/gists/${id}`,
          paramsDelete
        );
      });

      it("Then the gist doesn't exist", () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });
    });
  });
});
