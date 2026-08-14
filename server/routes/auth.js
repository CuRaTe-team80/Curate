const express = require("express");

const router = express.Router();

// =====================================================
// Planned User Mongoose Schema Fields
// Sprint 1: Fields only. Actual schema will be implemented
// in Sprint 3.
// =====================================================

// User fields:
// - _id
// - name
// - email
// - password
// - createdAt
// - updatedAt

// =====================================================
// Planned Sample Mongoose Schema Fields
// Sprint 1: Fields only. Actual schema will be implemented
// in Sprint 3.
// =====================================================

// Sample fields:
// - _id
// - userId
// - content
// - type
// - imageUrl
// - label
// - status
// - createdAt
// - updatedAt

// =====================================================
// POST /auth/register
// Placeholder registration route
// =====================================================

router.post("/register", (req, res) => {
  res.status(201).json({
    success: true,
    message: "User registration placeholder",
    data: {
      email: req.body?.email || "example@example.com",
    },
  });
});

// =====================================================
// POST /auth/login
// Placeholder login route
// =====================================================

router.post("/login", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User login placeholder",
    data: {
      email: req.body?.email || "example@example.com",
      token: "placeholder-token",
    },
  });
});

module.exports = router;