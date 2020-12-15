const agent = require('superagent');

const urlBase = 'https://api.github.com';

function getRequest(path) {
  return agent
    .get(`${urlBase}/${path}`)
    .set('User-Agent', 'agent')
    .auth('token', process.env.ACCESS_TOKEN);
}

function deleteRequest(path) {
  return agent
    .delete(`${urlBase}/${path}`)
    .set('User-Agent', 'agent')
    .auth('token', process.env.ACCESS_TOKEN);
}

function postRequest(path, input) {
  return agent
    .post(`${urlBase}/${path}`, input)
    .set('User-Agent', 'agent')
    .auth('token', process.env.ACCESS_TOKEN);
}

function patchRequest(path, input) {
  return agent
    .patch(`${urlBase}/${path}`, input)
    .auth('token', process.env.ACCESS_TOKEN)
    .set('User-Agent', 'agent');
}

function putRequest(path) {
  return agent
    .put(`${urlBase}/${path}`)
    .set('User-Agent', 'agent')
    .auth('token', process.env.ACCESS_TOKEN);
}

module.exports.get = getRequest;
module.exports.delete = deleteRequest;
module.exports.post = postRequest;
module.exports.patch = patchRequest;
module.exports.put = putRequest;
