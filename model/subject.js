let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let subject = Schema({
  label: {
    type: String,
    required: [true, 'Label is required'], // Add any other validation rules you need
    unique: [true, 'Label already exist'], // Add any other validation rules you need
  },
  nomProf: String,
  imgProf: String
}, {
  // Options de schéma
  toJSON: {
    virtuals: true, // Inclut les propriétés virtuelles lors de la conversion en JSON
    transform: (_, ret) => {
      delete ret.__v; // Exclut l'attribut __v
    },
  },
});

subject.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('subjects', subject);
