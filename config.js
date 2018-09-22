'use strict';
exports.PORT = process.env.PORT || 3001;
exports.TEST_PORT = process.env.TEST_PORT || 3011;
exports.CLIENT_ORGIN = process.env.CLIENT_ORGIN || "http://localhost:3000/";
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY;
