const mongoose = require('mongoose');
const { Schema } = mongoose;

const historyEntrySchema = new Schema(
  {
    action: { type: String, required: true },
    label: { type: String, required: true },
    by: { type: String, required: true },
    at: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new Schema({
  text: { type: String, required: true, trim: true },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const sampleSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    type: { type: String, required: true },
    currentLabel: { type: String, default: null },
    status: { type: String, default: 'Unlabeled' },
    labeledBy: { type: String, default: null },
    history: { type: [historyEntrySchema], default: [] },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt — Isuli's conflict detection needs updatedAt
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // keep frontend's sample.id working unchanged
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model('Sample', sampleSchema);