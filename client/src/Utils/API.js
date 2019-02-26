import axios from "axios";

export default {
  // Gets all books
  getTeams: function() {
    return axios.get("/api/teams");
  },
  // Gets the book with the given id
  getTeam: function(id) {
    return axios.get("/api/teams/" + id);
  },
  getPlayer: function(id) {
    return axios.get("/api/player/" + id);
  },
  // Deletes the book with the given id
  deleteBook: function(id) {
    return axios.delete("/api/books/" + id);
  },
  // Saves a book to the database
  saveBook: function(bookData) {
    return axios.post("/api/books", bookData);
  },
  playerMap: function(bookData) {
    return axios.get("/api/playerMap");
  }
};
