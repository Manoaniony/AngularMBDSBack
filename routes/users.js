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
            console.log("ERROR NAME ", err.name);
            console.log("ERROR MONGO ", err.code);
            if (err.name.includes("MongoError") && err.code == "11000") {
                return res.status(422).json({
                    data: null,
                    error: {
                        name: "EMAIL_ALREADY_EXIST",
                        code: err.code
                    },
                    status: 500,
                    message: "USER_NOT_CREATED"
                })
            }
            return;
        }

        const userToReturn = {
            email: userToCreate.email,
            firstName: userToCreate.firstName,
            lastName: userToCreate.lastName,
        }

        return res.status(201).json({
            data: userToReturn,
            status: 201,
            message: "USER_CREATED"
        })

    })
}

module.exports = { postUser }