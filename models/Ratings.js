const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Ratings", ratingSchema);
