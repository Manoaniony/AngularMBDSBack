require('dotenv').config()
let User = require('../model/user');
const bcrypt = require('bcrypt');

async function postUser(req, res) {
    const saltRounds = Number(process.env.SALTROUNDS);
    let userToCreate = new User();
    userToCreate.email = req.body.email;
    userToCreate.firstName = req.body.firstName;
    userToCreate.lastName = req.body.lastName;
    userToCreate.email = req.body.email;
    userToCreate.password = await bcrypt.hash(req.body.password, saltRounds);
    userToCreate.role = req.body.role;

    userToCreate.save((err) => {
        if (err) {
            res.status(500).json({
                error: err,
                status: 500,
                message: "USER_NOT_CREATED"
            })
        }

        const userToReturn = {
            email: userToCreate.email,
            firstName: userToCreate.firstName,
            lastName: userToCreate.lastName,
        }

        res.status(201).json({
            data: userToReturn,
            status: 201,
            message: "USER_CREATED"
        })
        return;
    })
}

module.exports = { postUser }