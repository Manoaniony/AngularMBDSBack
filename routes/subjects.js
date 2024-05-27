let Subject = require('../model/subject');

function getSubjects(req, res) {
  let aggregateQuery = Subject.aggregate();

  Subject.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    },
    (err, data) => {
      if (err) {
        res.send(err)
      }
      res.status(200).send({
        data,
        status: 200,
      });
    }
  );
}

// Récupérer un assignment par son id (GET)
function getSubject(req, res) {
  let subjectId = req.params.id;
  Subject.findById(subjectId, (err, subject) => {
    if (err) {
      res.status(404).json({
        data: null,
        status: 404,
        message: "SUBJECT_NOT_FOUND"
      })
      return;
    }
    res.status(200).send({
      data: subject,
      status: 200,
    });
    return;
  })
}

// Ajout d'un matiere (POST)
function postSubject(req, res) {
  let subject = new Subject();
  subject.label = req.body.label;
  subject.nomProf = req.body.nomProf;
  subject.imgProf = req.body.imgProf;

  subject.save((err) => {
    if (err) {
      console.log("ERRRRR ", err);
      if (err.name.includes("MongoError") && err.code == "11000") {
        return res.status(422).json({
          data: null,
          error: {
            name: "LABEL_ALREADY_EXIST",
            code: err.code
          },
          status: 422,
          message: "SUBJECT_NOT_CREATED"
        })
      }
    }
    return res.status(201).json({
      data: subject,
      status: 201,
      message: "SUBJECT_ADDED"
    })
  })
}

async function updateSubject(req, res) {
  try {
    Subject.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, newValue) => {
      if (err) {
        return res.json({
          data: newValue,
          status: 400,
          error: {
            name: "ERROR",
            code: err.code
          },
          message: "SUBJECT_NOT_UPDATED"
        })
      } else {
        return res.json({
          data: newValue,
          status: 200,
          message: "SUBJECT_UPDATED"
        })
      }
    });
  } catch (err) {
    return res.json({
      data: null,
      status: 400,
      error: {
        name: "ERROR",
        code: err.code
      },
      message: "SUBJECT_NOT_UPDATED"
    })
  }
}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteSubject(req, res) {

  Subject.findByIdAndRemove(req.params.id, (err, subject) => {
    if (err) {
      res.send(err);
    }
    return res.json({
      data: subject,
      status: 200,
      message: "SUBJECT_DELETED"
    })
  })
}

module.exports = {
  getSubjects,
  getSubject,
  postSubject,
  updateSubject,
  deleteSubject
};
