var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var PlayerSchema = new Schema({
  // `title` must be of type String
  name: { type: String, index: { unique: true }},
  // `body` must be of type String
  _id: Number,
  hasPlayedWith: [this],


});

// This creates our model from the above schema, using mongoose's model method
var Players = mongoose.model("Player", PlayerSchema);

// Export the Note model
module.exports = Players;