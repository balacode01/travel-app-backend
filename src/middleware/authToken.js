const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    console.log("🔹 Received Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ JWT Verification Failed:", err.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.log("✅ Decoded User:", decoded); // This should log `{ id: 'some-uuid', email: 'user@example.com' }`
        req.user = decoded;
        next();
    });
};
