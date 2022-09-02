const User = require('../models/User');

exports.add = async (req, res) => {
    const { movie, watched } = req.body;
    
    try {
        const user = await User.findById(req.userId);
        const index = user.watchList.findIndex(e => e.movie == movie);

        if (index > -1) {
            user.watchList[index].watched = watched
        }
        else {
            user.watchList.push({movie, watched});
        }

        await user.save();
        
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

exports.delete = async (req, res) => {
    const { movie } = req.params;

    try {
        const user = await User.findById(req.userId);
        user.watchList = user.watchList.filter(e => e.movie != movie);

        await user.save();

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

exports.list = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-watchList._id').populate('-watchList.movie', ['name', 'category']);

        res.status(200).json({
            success: true,
            data: user.watchList
        });
    }
    catch (e) {
        res.status(500).json({
            message: e
        }); 
    }
}