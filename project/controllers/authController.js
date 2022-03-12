const authService = require('../services/authService');

/**
 * 회원가입
 */
exports.createUser = async (req, res, next) => {
    const user = req.body;

    try {
        const result = await authService.createUser(user);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};