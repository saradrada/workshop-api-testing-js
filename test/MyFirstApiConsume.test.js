const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {});

it('Consume GET Service', async () => {
  const response = await agent.get('https://httpbin.org/ip');

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('origin');
});

it('Consume GET Service with query parameters', async () => {
  const query = {
    name: 'John',
    age: '31',
    city: 'New York'
  };

  const response = await agent.get('https://httpbin.org/get').query(query);

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body.args).to.eql(query);
});

it('Consume HEAD Service', async () => {
  const response = await agent.head('https://httpbin.org/');

  expect(response.status).to.equal(statusCode.OK);
});

it('Consume PATCH Service', async () => {
  const response = await agent.patch('https://httpbin.org/patch?name=Saris');

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('json');
  expect(response.body).to.have.property('origin');
  expect(response.body).to.have.property('url');
});

it('Consume PATCH Service with query parameters', async () => {
  const query = {
    name: 'Saris',
    age: '24',
    city: 'Cali'
  };
  const response = await agent.patch('https://httpbin.org/patch').query(query);

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('json');
  expect(response.body).to.have.property('origin');
  expect(response.body).to.have.property('url');
});

it('Consume PUT Service', async () => {
  const response = await agent.put('https://httpbin.org/put?name=Carlos');

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('files');
  expect(response.body).to.have.property('form');
});

it('Consume PUT Service with query parameters', async () => {
  const query = {
    name: 'Carlos',
    age: '29'
  };
  const response = await agent.put('https://httpbin.org/put?name=Carlos').query(query);

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('files');
  expect(response.body).to.have.property('form');
});

it('Consume DELETE Service', async () => {
  const response = await agent.delete('https://httpbin.org/delete?name=Carlos');

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('form');
  expect(response.body).to.have.property('headers');
});

it('Consume DELETE Service with query parameters', async () => {
  const query = {
    name: 'Isa'
  };

  const response = await agent.delete('https://httpbin.org/delete').query(query);

  expect(response.status).to.equal(statusCode.OK);
  expect(response.body).to.have.property('args');
  expect(response.body).to.have.property('files');
});
