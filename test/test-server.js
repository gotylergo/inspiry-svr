'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('API', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should 200 on GET requests', function() {
    return chai.request(app)
      .get('/api/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
  });
});