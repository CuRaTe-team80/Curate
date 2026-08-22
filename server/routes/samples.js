// server/routes/samples.js
const express = require("express");
const router = express.Router();
const Sample = require("../models/Sample");

// PATCH /samples/:id
// Expects the request body to include the fields being updated (e.g. label,
// status) plus `clientUpdatedAt` — the updatedAt timestamp the client had
// when it last fetched this sample. If the sample has changed in the
// database since then, someone else edited it first, so we reject with 409
// instead of silently overwriting their change.
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { clientUpdatedAt, ...updates } = req.body;

  if (!clientUpdatedAt) {
    return res.status(400).json({
      message: "clientUpdatedAt is required to detect conflicts.",
    });
  }

  try {
    const sample = await Sample.findById(id);

    if (!sample) {
      return res.status(404).json({ message: "Sample not found." });
    }

    const currentUpdatedAt = new Date(sample.updatedAt).getTime();
    const clientKnownUpdatedAt = new Date(clientUpdatedAt).getTime();

    if (currentUpdatedAt > clientKnownUpdatedAt) {
      // The record changed after the client's last fetch — a conflict.
      return res.status(409).json({
        message:
          "This sample was modified by someone else since you last loaded it.",
        currentSample: sample,
      });
    }

    Object.assign(sample, updates);
    const updatedSample = await sample.save();

    return res.status(200).json(updatedSample);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid sample id." });
    }
    return res.status(500).json({ message: "Server error updating sample." });
  }
});

module.exports = router;