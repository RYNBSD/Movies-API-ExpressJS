const jwtHelpers = require('../utils/jwtHelpers');
const User = require('../models/User');

exports.check = async (req, res, next) => {

    const user = await User.findById(req.userId);
    user.isAdmin ? next() : res.status(403).json({message: 'Forbidden'})
}