var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ConnectionsSchema = new Schema({
  // `title` must be of type String
  team:String,
  year:Number,
  players:{ type: String, index: { unique: true }},
});

// This creates our model from the above schema, using mongoose's model method
var Connections = mongoose.model("Connections", ConnectionsSchema);

// Export the Note model
module.exports = Connections;