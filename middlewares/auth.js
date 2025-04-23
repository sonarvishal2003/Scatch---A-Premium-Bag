const jwt = require("jsonwebtoken");
const secret = process.env.JWT_KEY;

function verifyAdmin(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, secret);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Not an Admin" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = verifyAdmin;
