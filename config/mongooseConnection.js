const mongoose = require('mongoose');
const config = require('config');
const dbgr = require('debug')('development:mongoose');

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
    .then(() => {
        dbgr("MongoDB connection successful");
    })
    .catch((err) => {
        dbgr("MongoDB connection error:", err);
    });

module.exports = mongoose.connection;