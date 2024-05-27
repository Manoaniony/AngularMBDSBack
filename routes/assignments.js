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
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if (err) {
                res.send(err)
            }
            res.send(data);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId, (err, assignment) => {
        if (err) { res.send(err) }
        res.json(assignment);
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
    assignment.id = req.body.id;
    assignment.label = req.body.label;
    assignment.img = req.body.img;
    assignment.matiere = req.body.matiere;
    assignment.eleves = [];
    assignment.matiere = req.body.matiere;

    assignment.save((err, assignmentSaved) => {
        if (err) {
            console.log("error ", err);
            if (err.name.includes("MongoError") && err.code == "11000") {
                // switch
                return res.status(422).json({
                    data: null,
                    error: {
                        name: "MATIERE_ALREADY_EXIST",
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
                    code: err.code
                },
                status: 422,
                message: "STUDENT_NOT_ADDED"
            })
        }
        return res.json({
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

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }

        // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, ajoutNoteEleve, postAssignments };
