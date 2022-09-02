const User = require('../models/User');
const jwtHelpers = require('../utils/jwtHelpers');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && bcrypt.compareSync(password, user.password)) {
        
        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                accessToken: jwtHelpers.sign({ sub: user.id })
            }
        });
    }
    res.status(401).json({
        message: 'Invalid user'
    });
}

exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    const user = User({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
    });
    try {
        await user.save();        

        console.log(user);

        res.status(200).json({
            success: true
        });
    }
    catch (e) {
        res.status(500).json({
            message: e
        });
    }
}

exports.me = async (req, res) => {

    const user = await User.findOne(req.useId);

    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
}