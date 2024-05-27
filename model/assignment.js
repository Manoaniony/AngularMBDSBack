let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const EleveSchema = new Schema({
    matricule: {
        type: String,
        required: [true, 'Matricule is required'],
    },
    nom: String,
    rendu: Boolean,
    note: Number,
    remarque: String,
    dateDeRendu: Date,
});
EleveSchema.index({ 'matricule': 1 }, { unique: true })

let AssignmentSchema = Schema({
    label: {
        type: String,
        required: [true, 'Label is required']
    },
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: 'subjects', required: true },
    eleves: [EleveSchema]
}, {
    // Options de schéma
    toJSON: {
        virtuals: true, // Inclut les propriétés virtuelles lors de la conversion en JSON
        transform: (_, ret) => {
            delete ret.__v; // Exclut l'attribut __v
        },
    },
});

// Function to check for duplicate matricules
const checkDuplicateMatricules = function (next) {
    const eleves = this.eleves || (this._update && this._update.eleves);
    console.log("ELEVES ", eleves);
    if (eleves) {
        const matricules = eleves.map(eleve => eleve.matricule);
        if (new Set(matricules).size !== matricules.length) {
            return next(new Error('Duplicate matricules are not allowed'));
        }
    }
    next();
};

// // Apply pre-save and pre-update hooks
// AssignmentSchema.pre('save', checkDuplicateMatricules);
// AssignmentSchema.pre('save', checkDuplicateMatricules);
AssignmentSchema.pre('updateOne', checkDuplicateMatricules);


AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignments', AssignmentSchema);
