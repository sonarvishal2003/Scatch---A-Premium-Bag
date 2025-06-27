// const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');

// module.exports = async (req, res, next) => {
//     if (!req.cookies.token) {
//         req.flash("error", "You need to login first");
//         return res.redirect('/');
//     }
//     try {
//         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
//         let user = await userModel
//             .findOne({ email: decoded.email })
//             .select("-password");
//         req.user = user;
//         next();
//     } catch (err) {
//         req.flash("error", "something went wrong");
//         return res.redirect('/');
//     }
// };

// const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');
// const ownerModel = require('../models/ownerModel');

// module.exports = async (req, res, next) => {
//     if (!req.cookies.token) {
//         req.flash("error", "You need to login first");
//         return res.redirect('/');
//     }

//     try {
//         let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

//         let user = await userModel
//             .findOne({ email: decoded.email })
//             .select("-password");

//         if (!user) {
//             req.flash("error", "User not found");
//             return res.redirect('/');
//         }

//         req.user = user;
//         next();

//     } catch (err) {
//         console.error("JWT verification failed:", err);
//         req.flash("error", "Something went wrong");
//         return res.redirect('/');
//     }
// };


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
