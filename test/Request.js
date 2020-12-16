const agent = require('superagent');

class Request {
  constructor() {
    this.urlBase = 'https://api.github.com';
  }

  setUrlBase(path) {
    this.urlBase = path;
  }

  get(path, useBaseUrl = true) {
    return agent
      .get(useBaseUrl ? `${this.urlBase}/${path}` : path)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);
  }

  delete(path, useBaseUrl = true) {
    return agent
      .delete(useBaseUrl ? `${this.urlBase}/${path}` : path)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);
  }

  post(path, input, useBaseUrl = true) {
    return agent
      .post(useBaseUrl ? `${this.urlBase}/${path}` : path, input)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);
  }

  patch(path, input, useBaseUrl = true) {
    return agent
      .patch(useBaseUrl ? `${this.urlBase}/${path}` : path, input)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
  }

  put(path, useBaseUrl = true) {
    return agent
      .put(useBaseUrl ? `${this.urlBase}/${path}` : path)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);
  }

  head(path, useBaseUrl = true) {
    console.log('🚀 ~ file: Request.js ~ line 49 ~ Request ~ head ~ path', path);
    return agent.head(useBaseUrl ? `${this.urlBase}/${path}` : path);
  }
}

module.exports.instance = new Request();
