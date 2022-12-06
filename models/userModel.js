const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: { type: String, required: true, unique: true },
	balance: { 
    type: Number, 
    required: true,
    get: v => Math.round(v),
    set: v => Math.round(v),
    default: 0 
  },
	inventory: { type: Array, required: true, default: [] },
	cooldowns: {
		type: Map,
		of: Date,
		required: true,
		default: new Map(),
	},
  status: {
    type: String,
    enum: ["idle", "moving", "cutting"],
    default: "idle"
  },
  location: {
    type: String,
    enum: ["village", "small-mountains"],
    default: "village"
  }
})

const Profile = mongoose.model('Profiles', userSchema);

module.exports = Profile;