'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const storySchema = Schema({
    user: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        min: 1,
    },
    content: {
        type: String,
        default: false,
    },
    img: {
        type: String,
        required: true,
        min: 1,
    },
    genre: {
        type: String,
        required: true,
        min: 1,
    },
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };
