'use strict'
const express = require('express');
const bodyParser = require('body-parser');

let { Story } = require('./models');

const storiesRouter = express.Router();

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

storiesRouter.use(bodyParser.urlencoded({ extended: true })); storiesRouter.use(bodyParser.json());

// POST one new story

storiesRouter.post('/', [jsonParser, jwtAuth], (req, res) => {
    return Story.find({ user: req.user.username, title: req.body.title })
        .then(story => {
            return Story.create({
                user: req.user.username,
                title: req.body.title.trim(),
                content: req.body.content,
                img: req.body.img,
                genre: req.body.genre
            });
        })
        .then(story => {
            res.status(200).send(story);
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
});

// DELETE one story by ID

storiesRouter.delete('/id/:id', [jsonParser, jwtAuth], (req, res) => {
    return Story.deleteOne({ _id: req.params.id })
        .then(story => res.status(204).json({
            message: `${req.params.id} deleted.`,
            id: `${req.params.id}`
        }))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET one story by id

storiesRouter.get('/id/:id', (req, res) => {
    return Story.findOne({ _id: req.params.id })
        .then(story => {
            res.json(story);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all stories for the current user

storiesRouter.get('/my-stories', [jsonParser, jwtAuth], (req, res) => {
    return Story.find({ user: req.user.username })
        .then(stories => {
            res.json(stories);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// GET all stories

storiesRouter.get('/', (req, res) => {
    return Story.find()
        .then(stories => {
            res.json(stories);
        })
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = { storiesRouter };
