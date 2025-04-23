const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY;

const generateToken = ({ id, email, role }) => {
    if (!secret) {
        throw new Error("JWT secret is missing. Please set JWT_KEY in your environment.");
    }

    const safeEmail = email || "noemail@example.com";

    return jwt.sign({ id, email: safeEmail, role }, secret, {
        expiresIn: "1d",
    });

};


module.exports.generateToken = generateToken;
