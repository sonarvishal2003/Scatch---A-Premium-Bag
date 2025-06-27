const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Try both user and admin models
        let user = await userModel.findOne({ email: decoded.email }).select('-password');
        if (!user) {
            user = await ownerModel.findOne({ email: decoded.email }).select('-password');
        }

        if (!user) {
            return res.redirect('/');
        }

        req.user = user;
        res.locals.user = user;
        next();

    } catch {
        return res.redirect('/');
    }
};
