let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let noteSchema = Schema({
  matricule: { type: String, required: true, index: true },
  matiere: { type: String, required: true, index: true },
  score: { type: Number, required: true }
}, {
  // Options de schéma
  toJSON: {
    virtuals: true, // Inclut les propriétés virtuelles lors de la conversion en JSON
    transform: (_, ret) => {
      delete ret.__v; // Exclut l'attribut __v
    },
  },
});
noteSchema.index({ matricule: 1, matiere: 1 }, { unique: true })
noteSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('notes', noteSchema);
