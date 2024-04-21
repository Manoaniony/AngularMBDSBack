require('dotenv').config()
let User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const tokenKey = process.env.TOKEN_KEY;

async function login(req, res) {
    const { email, password } = req.body;
    const updatedAt = moment().format("DD/MM/YYYY HH:mm");

    try {
        const userFound = await User.findOne({ email });
        if (userFound) {
            const validPassword = await bcrypt.compare(password, userFound.password);
            if (validPassword) {
                const token = jwt.sign({
                    _id: userFound._id,
                }, tokenKey, { expiresIn: '23 hours' });
                const { token: newToken } = await User.findOneAndUpdate({ _id: userFound._id }, { token, updatedAt })
                return res.status(200).json({
                    data: {
                        token: newToken,
                        email: userFound.email,
                        firstName: userFound.firstName,
                        lastName: userFound.lastName,
                        role: userFound.role,
                    },
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

async function me(req, res) {
    const { authorization } = req.headers;
    try {
        const tokenParsed = authorization.split(" ");

        const { _id } = jwt.verify(tokenParsed[1], tokenKey);
        const userFound = await User.findOne({ _id });
        if (userFound) {
            const { _id, email, firstName, lastName, role } = userFound
            return res.status(200).json({
                data: { _id, email, firstName, lastName, role },
                status: 200,
                message: "AUTHORIZED"
            });
        }
        throw new Error("no access");
    } catch (error) {
        console.log("No Access ", error);
        return res.status(401).json({
            data: null,
            status: 401,
            message: "UNAUTHORIZED"
        })
    }
}

function internalServer(_, res) {
    res.status(500).json({
        data: null,
        status: 500,
        message: "INTERNAL_SERVER"
    })
}

function forbidden(_, res) {
    res.status(403).json({
        data: null,
        status: 403,
        message: "FORBIDDEN"
    })
}

function unauthorized(_, res) {
    res.status(401).json({
        data: null,
        status: 401,
        message: "UNAUTHORIZED"
    })
}

function ok(_, res) {
    res.status(200).json({
        data: { ok: true },
        status: 200,
        message: "OK"
    })
}

module.exports = { login, me, internalServer, forbidden, unauthorized, ok }