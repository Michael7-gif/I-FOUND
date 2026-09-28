const express = require("express")
const pool = require("../db")
const requireAuth = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        phone_number,
        whatsapp_number,
        profile_picture
       FROM users
       WHERE id = $1`,
      [req.session.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      })
    }

    res.json({
      success: true,
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Get profile error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to load profile.",
    })
  }
})

router.put("/", requireAuth, async (req, res) => {
  try {
    const { fullName, phoneNumber, whatsappNumber } = req.body

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      })
    }

    const result = await pool.query(
      `UPDATE users
       SET full_name = $1,
           phone_number = $2,
           whatsapp_number = $3
       WHERE id = $4
       RETURNING
        id,
        full_name,
        email,
        phone_number,
        whatsapp_number,
        profile_picture`,
      [
        fullName.trim(),
        phoneNumber ? phoneNumber.trim() : null,
        whatsappNumber ? whatsappNumber.trim() : null,
        req.session.userId,
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Update profile error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    })
  }
})

router.put("/picture", requireAuth, async (req, res) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Profile picture URL is required.",
      })
    }

    const result = await pool.query(
      `UPDATE users
       SET profile_picture = $1
       WHERE id = $2
       RETURNING
        id,
        full_name,
        email,
        phone_number,
        whatsapp_number,
        profile_picture`,
      [imageUrl, req.session.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      })
    }

    res.json({
      success: true,
      message: "Profile picture updated successfully.",
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Update profile picture error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to update profile picture.",
    })
  }
})

module.exports = router