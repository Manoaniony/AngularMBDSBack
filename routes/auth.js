require('dotenv').config()
let User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

async function login(req, res) {
    const { email, password } = req.body;
    const tokenKey = process.env.TOKEN_KEY;
    const updatedAt = moment().format("DD/MM/YYYY HH:mm");

    try {
        const userFound = await User.findOne({ email });
        if (userFound) {
            const validPassword = await bcrypt.compare(password, userFound.password);
            if (validPassword) {
                const token = jwt.sign({
                    _id: userFound._id,
                    email: userFound.email,
                    profile: userFound.profile,
                    userRoles: userFound.usersRoles,
                }, tokenKey, { expiresIn: '23 hours' });
                const { token: newToken } = await User.findOneAndUpdate({ _id: userFound._id }, { token, updatedAt })
                return res.status(200).json({
                    data: { token: newToken },
                    status: 200,
                    message: "USER_CONNECTED"
                });
            }
            else {
                return res.status(403).json({
                    data: null,
                    status: 403,
                    message: "INVALID_PASSWORD"
                })
            }
        }
        return res.status(403).json(null)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }

}

module.exports = { login }