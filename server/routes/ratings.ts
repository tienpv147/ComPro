import express from "express";
import UserModel from "../models/user";

const ratings = express.Router();

ratings.get("/all", async (req, res) => {
    const search = req.query.search || "";

    const users = await UserModel.find({
        "username": {$regex: search, $options: "i"},
        "problems_solved_count": { $gte: 1 }
    }).sort({
        "rating": -1,
        "username": 1
    });

    if (!users.length) {
        res.json([])
        return;
    }

    const ratingUsers = users.map(user => ({
        username: user.username,
        problems_solved: user.problems_solved,
        problems_attempted: user.problems_attempted,
        problems_solved_count: user.problems_solved_count,
        views: user.views,
        solution_count: user.solution_count,
        rating: user.rating
    }));

    res.json(ratingUsers);
});

export default ratings;