const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    title: String,
    details: String,
    image: {
      buffer: Buffer,
      mimetype: String
    }
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("post", postSchema);
