'use strict'

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const request = require('supertest');

const auth_router = require('../auth/router');
const { Story } = require('../stories');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
console.info(`Using ${TEST_DATABASE_URL}`);

const expect = chai.expect;
chai.use(chaiHttp);

// Seed database with random data

function seedDatabase() {
  console.info('Seeding story data');
  let seedData = [];
  for (let i = 0; i <= 10; i++) {
    seedData.push(generateStory())
  }
  return Story.insertMany(seedData);
}

// Generate a story object

function generateStory() {
  return {
    title: faker.lorem.words(),
    content: faker.lorem.paragraphs(),
    img: 'https://source.unsplash.com/random/350x350',
    genre: faker.lorem.word()
  };
}

// Delete the database

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('Story GET endpoint', function () {
  it('should return all stories', function () {
    let _res;
    return request(app)
      .get('/api/stories/')
      .then(function (res) {
        _res = res;
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        return Story.find().count();
      })
      .then(function (count) {
        let resCount = _res.body.length;
        expect(resCount).to.equal(count);
      })
  });
});

describe('Authenticated user GET endpoint', function () {
  it('should return user stories', function () {
    let testing_token = auth_router.createAuthToken({ username: 'testing' })
    let _res;
    return chai.request(app)
      .get('/api/stories/my-stories')
      .set('Authorization', `bearer ${testing_token}`)
      .then(function (res) {
        _res = res;
        expect(res).to.have.status(200);
        expect(res).to.be.a('object');
        return Story.find().estimatedDocumentCount();
      })
      .then(function (count) {
        let resCount = _res.body.length;
        expect(resCount).to.equal(count);
      })
  });
})

describe('Authenticated user POST endpoint', function () {
  it('should create a new story for user on POST', function () {
    const newStory = generateStory();
    let testing_token = auth_router.createAuthToken({ username: 'testing' })
    return chai.request(app)
      .post('/api/stories')
      .set('Authorization', `bearer ${testing_token}`)
      .send(newStory)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body).to.include.keys(
          '_id', 'title', 'content', 'img', 'genre'
        );
        expect(res.body.title).to.equal(newStory.title);
        expect(res.body.content).to.equal(newStory.content);
        expect(res.body.img).to.equal(newStory.img);
        expect(res.body.genre).to.equal(newStory.genre);
      });
  });
});

describe('Authenticated user PUT endpoint', function () {
  it('should update a story for user on PUT', function () {
    const updatedStory = generateStory();
    let testing_token = auth_router.createAuthToken({ username: 'testing' })
    Story.findOne()
      .then(function (story) {
        return chai.request(app)
          .put(`/api/stories/id/${story._id}`)
          .set('Authorization', `bearer ${testing_token}`)
          .send(updatedStory)
          .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.a('object');
          })
      })
      .catch(err => console.log(err));
  });
})

describe('Authenticated user DELETE endpoint', function () {
  it('should delete a story by ID', function () {
    let testing_token = auth_router.createAuthToken({ username: 'testing' })
    Story.findOne()
      .then(function (story) {
        return chai.request(app)
          .delete(`/api/stories/id/${story._id}`)
          .set('Authorization', `bearer ${testing_token}`)
          .send(story)
          .then(function (res) {
            expect(res).to.have.status(204);
            return Story.findOne(story._id);
          })
          .then(function (_story) {
            expect(_story).to.be.null;
          });

      })
      .catch(err => console.log(err));
  });
});
