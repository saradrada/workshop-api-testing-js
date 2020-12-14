const baseURL = 'https://api.github.com';
const agent = require('superagent');
const statusCode = require('http-status-codes');

exports.getBaseURL = () => baseURL;
exports.getAgent = () => agent;
exports.getStatusCode = () => statusCode;
