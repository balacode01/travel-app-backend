const jwt = require('jsonwebtoken');

module.exports = (req,res, next)=> {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'No token provided'});
    }

    console.log(process.env.JWT_SECRET);
    console.log("=========");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({messsage: "Invalid or expired token"});
        }
        req.user = decoded;
        next();
    });
};