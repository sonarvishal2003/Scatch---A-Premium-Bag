const userModel = require('../models/userModel');
const ownerModel = require('../models/ownerModel');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateTokens');

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect('/');
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt,async (err, hash)=> {
                // Store hash in your password DB.
                if (err) {
                    return res.send(err.message);
                }
                else {
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    });
                    
                   let token = generateToken(user);
                   res.cookie("token", token);
                   res.redirect('/shop');
                }
            });
        });

    } catch (err) {
        res.send(err.message);
    }
}


module.exports.loginUser = async (req, res) => {
    const { email, password, loginType } = req.body;

    try {
        const isOwnerLogin = loginType === "owner";
        const model = isOwnerLogin ? ownerModel : userModel;

        const user = await model.findOne({ email });
        if (!user) {
            req.flash("error", "Email or password is incorrect");
            return res.redirect('/');
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash("error", "Email or password is incorrect");
            return res.redirect('/');
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: isOwnerLogin ? 'admin' : 'user',
        });

        //  Set JWT in cookie for development
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax", // Prevents CSRF in most cases
            // secure: false // not needed in development
        });

        //  Redirect to appropriate dashboard
        return res.redirect(isOwnerLogin ? "/owners/admin" : "/shop");

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        return res.redirect('/');
    }
};



module.exports.logout = (req, res) => {
    res.cookie("token", "");
    res.redirect('/');
};