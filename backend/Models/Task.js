const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
},{
  versionKey: "Version_key",
}
);

module.exports = mongoose.model("Task", taskSchema);
