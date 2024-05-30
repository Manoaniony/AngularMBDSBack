let Assignment = require('../model/assignment');
let Note = require('../model/note');

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

function getAssignments(req, res) {
    const aggregateQuery = Assignment.aggregate(
        [
            {
                $lookup: {
                    from: 'subjects', // The name of the related collection ('subjects' in this case)
                    localField: 'matiere',
                    foreignField: '_id',
                    as: 'matiere', // The field where the populated subjects will be stored
                },
            },
            {
                $unwind: '$matiere', // Unwind the array to get a single object
            },
            {
                $addFields: {
                    matiere: '$matiere', // Rename the field to 'matiere'
                },
            },
        ]
    )

    // Execute the aggregatePaginate query
    Assignment.aggregatePaginate(aggregateQuery, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    }, (err, data) => {
        if (err) {
            res.send(err)
        }
        res.status(200).send({
            data,
            status: 200,
        });
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId).populate('matiere').exec((err, assignment) => {
        if (err || !assignment) {
            res.status(404).json({
                data: null,
                status: 404,
                message: "ASSIGNMENT_NOT_FOUND"
            })
            return;
        }
        console.log(assignment.matiere);
        res.status(200).send({
            data: assignment,
            status: 200,
        });
        return;
    })

    /*
    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
    */
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save((err) => {
        if (err) {
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!` })
    })
}

function postAssignments(req, res) {
    let assignment = new Assignment();
    // assignment.id = req.body.id;
    assignment.label = req.body.label;
    // assignment.img = req.body.img;
    assignment.matiere = req.body.matiere;
    assignment.eleves = [];
    // assignment.matiere = req.body.matiere;

    assignment.save((err, assignmentSaved) => {
        if (err) {
            if (err.name.includes("MongoError") && err.code == "11000") {
                // switch
                return res.status(422).json({
                    data: null,
                    error: {
                        name: "LABEL_MATIERE_ALREADY_EXIST",
                        code: err.code
                    },
                    status: 422,
                    message: "ASSIGNMENT_NOT_CREATED"
                })
            }
            else {
                return res.status(422).json({
                    data: null,
                    error: {
                        name: "ERROR",
                        code: err.code
                    },
                    status: 400,
                    message: "ASSIGNMENT_NOT_CREATED"
                })
            }
        }
        return res.json({
            data: assignmentSaved,
            status: 201,
            message: "ASSIGNMENT_CREATED"
        })
    })
}

async function ajoutNoteEleve(req, res) {
    let assignmentId = req.params.id;
    const filter = { _id: req.params.id };
    try {
        const assignmentToUpdate = Assignment.findById(assignmentId).then((response) => {
            console.log("response on find ", response);
            let assignmentToUpdate = response;
            assignmentToUpdate.eleves.push(req.body.eleve);
            console.log("assignmentToUpdate >>>> ", assignmentToUpdate);
            return Assignment.updateOne(filter, assignmentToUpdate)
                .then((responseUpdate) => {
                    console.log("ResponseUpdate ", responseUpdate);
                    if (responseUpdate.nModified) {
                        return assignmentToUpdate;
                    }
                    else {
                        return response
                    }
                })
                .catch((error) => {
                    console.log("Error on update one ", error);
                    throw error;
                })
        }).catch((error) => {
            console.log("ERRRRRR >>>> ", error);
            throw error
        })
        const responseToRequest = await assignmentToUpdate;
        return await res.json({
            data: responseToRequest,
            status: 201,
            message: "STUDENT_ADDED"
        })
    } catch (err) {
        if (err.message.includes("matricule")) {
            return res.status(422).json({
                data: null,
                error: {
                    name: "MATRICULE_ALREADY_EXIST",
                    code: err.code || 11000
                },
                status: 422,
                message: "STUDENT_NOT_ADDED"
            })
        }
        return res.status(400).json({
            data: null,
            status: 400,
            error: {
                name: "ERROR",
                code: err.code
            },
            message: "STUDENT_NOT_ADDED"
        })
    }
}

function getNote(req, res) {
    let _id = req.params.id;
    let matricule = req.params.matricule;
    Assignment.findOne({ _id }, (err, assignment) => {
        const eleve = assignment?.eleves?.find((eleve) => (eleve?.matricule === matricule));
        if (err) {
            return res.status(400).json({
                data: null,
                error: {
                    name: "ERROR",
                    code: err.code
                },
                status: 400,
            })
        }
        else if (!eleve) {
            return res.status(404).json({
                data: null,
                error: {
                    name: "ERROR",
                },
                status: 404,
                message: "NOTE_NOT_FOUND"
            })
        }
        return res.status(200).json({
            data: eleve,
            status: 200,
        })
    })
}

async function updateNote(req, res) {
    const filter = { _id: req.params.id };
    const assignmentId = req.params.id;
    const matricule = req.params.matricule;
    console.log({ assignmentId, matricule });
    try {
        const assignmentToUpdate = Assignment.findById(assignmentId).then((response) => {
            console.log("response on find ", response);
            if (!response) {
                console.log("no response");
            }
            let assignmentToUpdate = response;
            let eleves = assignmentToUpdate.eleves;
            let existEleve = assignmentToUpdate.eleves?.find((eleve) => (eleve?.matricule === matricule))
            if (!existEleve) {
                throw new Error("Student doesn't exist")
            }
            const elevesUpdated = eleves?.map((eleve) => {
                if (eleve?.matricule === matricule) {
                    return { ...req.body.eleve, matricule };
                }
                return eleve;
            });
            assignmentToUpdate.eleves = elevesUpdated;
            return Assignment.updateOne(filter, assignmentToUpdate)
                .then((responseUpdate) => {
                    console.log("ResponseUpdate ", responseUpdate);
                    if (responseUpdate.nModified) {
                        return assignmentToUpdate;
                    }
                    else {
                        return response
                    }
                })
                .catch((error) => {
                    console.log("Error on update one ", error);
                    throw error;
                })
        }).catch((error) => {
            console.log("ERRRRRR >>>> ", error?.message?.includes("Cast to ObjectId failed"));
            throw error
        })
        const responseToRequest = await assignmentToUpdate;
        return await res.json({
            data: responseToRequest,
            status: 201,
            message: "STUDENT_ADDED"
        })
    } catch (err) {
        console.log("err on catch ", err);
        if (err?.message?.includes("Cast to ObjectId failed")) {
            return res.status(404).json({
                data: null,
                status: 404,
                error: {
                    name: "ERROR",
                    code: err.code
                },
                message: "ASSIGNMENT_NOT_EXIST"
            })
        }
        if (err?.message?.includes("Student doesn't exist")) {
            return res.status(404).json({
                data: null,
                status: 404,
                error: {
                    name: "ERROR",
                    code: err.code
                },
                message: "STUDENT_NOT_EXIST"
            })
        }
        return res.status(400).json({
            data: null,
            status: 400,
            error: {
                name: "ERROR",
                code: err.code
            },
            message: "STUDENT_NOT_UPDATED"
        })
    }
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    let _id = req.params.id;
    Assignment.findByIdAndUpdate(_id, req.body, { new: true }, (err, assignment) => {
        console.log("assignment updated ", assignment);
        if (err) {
            res.status(400).json({
                data: null,
                status: 400,
                error: {
                    name: "ERROR",
                    code: err.code
                },
                message: "STUDENT_NOT_ADDED"
            })
        } else {
            res.status(200).json({
                data: assignment,
                status: 200,
                message: "ASSIGNMENT_UPDATED"
            })
        }
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        return res.json({
            data: assignment,
            status: 200,
            message: "ASSIGNMENT_DELETED"
        })
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, ajoutNoteEleve, postAssignments, updateNote, getNote };
