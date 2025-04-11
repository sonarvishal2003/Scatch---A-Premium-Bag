const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/scatch")
    .then(() => {
        dbgr("MongoDB connection successful");
    })
    .catch((err) => {
        dbgr("MongoDB connection error:", err);
    });

module.exports = mongoose.connection;
// This code connects to a MongoDB database using Mongoose. It logs a success message if the connection is established successfully, and an error message if there is an error during the connection process.