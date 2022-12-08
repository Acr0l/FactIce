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
	inventory: {
    tool: {
      type: String,
      default: "stone_pickaxe",
      required: true,
      enum: ["stone_pickaxe"]
    },
    storage: {
      name: {
        type: String,
        default: "leather_bag",
        required: true,
        enum: ["leather_bag"]
      },
      capacity: {
        type: Number,
        default: 10,
        required: true
      },
      stored: {
        type: Array,
        default: []
      }
    },
    transport: {
      type: String,
      default: ""
    },
    unequipped: { type: Array, default: []}
  },
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

userSchema.virtual('spaceLeft').get(() => (this.inventory.storage.capacity - this.inventory.storage.stored.reduce((a,b) => a.quantity + b.quantity), 0))
const Profile = mongoose.model('Profiles', userSchema);

module.exports = Profile;