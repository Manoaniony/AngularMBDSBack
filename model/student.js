let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let student = Schema({
  matricule: {
    type: String,
    unique: [true, 'Matricule is already exist'], // Ensure uniqueness for the 'matiere' field
    required: [true, 'Matricule is required'] // Add any other validation rules you need
  },
  nom: String
}, {
  // Options de schéma
  toJSON: {
    virtuals: true, // Inclut les propriétés virtuelles lors de la conversion en JSON
    transform: (_, ret) => {
      delete ret.__v; // Exclut l'attribut __v
    },
  },
});

student.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('students', student);
