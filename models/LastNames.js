var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NameSchema = new Schema({
  // `title` must be of type String
  name: String,
  // `body` must be of type String
  rank: Number,
  count:Number,
  yearsOnList: Number
});

// This creates our model from the above schema, using mongoose's model method
var LastNames = mongoose.model("LastName", NameSchema);

// Export the Note model
module.exports = LastNames;