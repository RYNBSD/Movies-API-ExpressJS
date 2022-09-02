const Movie = require('../models/Movie');

exports.create = async (req, res) => {
    const { name, category, description } = req.body;
    const movie = Movie({
        name, 
        category,
        description
    });

    try {  
        await movie.save();
        res.status(200).json({
            success: true
        });
    }
    catch (e) {
        res.status(500).json({
            success: e
        });
    }
}

exports.find = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id).select('-reviews');
        if (!movie) return res.status(404).json({message: "Not Found"});

        res.status(200).json({
            success: true,
            data: movie
        });
    }
    catch(e) {
        res.status(500).json({ message: e });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, category, description } = req.body;

    try {
        await Movie.updateOne(
            {_id: id}, 
            {
                $set: {
                    name, category, description
                }
            }
        );
        res.status(200).json({
            success: true
        });
    }
    catch(e) {
        res.status(500).json({
            message: e
        });
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    
    try {
        await Movie.deleteOne({_id: id});

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
        const page = req.params?.page || 1;
        const limit = 2
        const skip = (page - 1) * limit;

        const movies = await Movie.find().select('-reviews').skip(skip).limit(limit);
        
        const total = await Movie.countDocuments();
        const pages = Math.ceil(total/limit);

        res.status(200).json({
            success: true,
            pages,
            data: movies
        });
    }
    catch (e) {
        res.status(500).json({
            message: e
        });
    }
}

exports.review = async (req, res) => {
    const { id } = req.params;
    
    try {
        const movie = await Movie.findById(id).select('-reviews._id').populate('reviews.user', 'name');
        if (!movie) return res.status(404).json({ message: "Not Found" });

        res.status(200).json ({
            success: true,
            data: movie.reviews
        });
    }
    catch (e) {
        res.status(500).json ({
            message: e
        });
    }
}

exports.addReview = async (req, res) => {
    const { id } = req.params;
    const { comment, rate } = req.body;

    try {
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: 'Not Found' });

        const isRated = movie.reviews.findIndex(m => m.user == req.userId);
        if (isRated > -1) 
            return res.status(403).send({ message: 'Review is already added' });

        const totalRate = movie.reviews.reduce((sum, review) => sum + review.rate, 0);
        const finalRate = (totalRate + rate) / (movie.reviews.length + 1);

        await Movie.updateOne(
            { _id: id },
            {
                $push: {
                    reviews: {
                        user: req.userId, comment, rate
                    }
                },
                $set: {
                    rate: finalRate
                }
            }
        );

        res.status(201).json ({
            success: true
        });
    }
    catch (e) {
        res.status(500).json ({
            message: e
        });
    }
}
