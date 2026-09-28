const express = require("express")
const pool = require("../db")
const requireAuth = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      type,
      itemName,
      location,
      itemDate,
      description,
      imageUrl,
    } = req.body

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Report type must be lost or found.",
      })
    }

    if (
      !itemName?.trim() ||
      !location?.trim() ||
      !itemDate ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      })
    }

    const status = type === "lost" ? "lost" : "found"

    const result = await pool.query(
      `INSERT INTO reports
        (user_id, type, item_name, location, item_date, description, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING
        id,
        user_id,
        type,
        item_name,
        location,
        item_date,
        description,
        image_url,
        status,
        created_at`,
      [
        req.session.userId,
        type,
        itemName.trim(),
        location.trim(),
        itemDate,
        description.trim(),
        imageUrl || null,
        status,
      ]
    )

    res.status(201).json({
      success: true,
      message: `${
        type === "lost" ? "Lost" : "Found"
      } item reported successfully.`,
      report: result.rows[0],
    })
  } catch (error) {
    console.error("Create report error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to create report.",
    })
  }
})

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        type,
        item_name,
        location,
        item_date,
        description,
        image_url,
        status,
        created_at
       FROM reports
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.userId]
    )

    res.json({
      success: true,
      reports: result.rows,
    })
  } catch (error) {
    console.error("Get my reports error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to load your reports.",
    })
  }
})

router.get("/lost", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        r.id,
        r.type,
        r.item_name,
        r.location,
        r.item_date,
        r.description,
        r.image_url,
        r.status,
        r.created_at,
        u.full_name AS poster_name,
        u.phone_number AS poster_phone,
        u.whatsapp_number AS poster_whatsapp,
        u.profile_picture AS poster_profile_picture
       FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.type = 'lost'
       ORDER BY r.created_at DESC`
    )

    res.json({
      success: true,
      reports: result.rows,
    })
  } catch (error) {
    console.error("Get lost reports error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to load lost items.",
    })
  }
})

router.get("/found", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        r.id,
        r.type,
        r.item_name,
        r.location,
        r.item_date,
        r.description,
        r.image_url,
        r.status,
        r.created_at,
        u.full_name AS poster_name,
        u.phone_number AS poster_phone,
        u.whatsapp_number AS poster_whatsapp,
        u.profile_picture AS poster_profile_picture
       FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.type = 'found'
       ORDER BY r.created_at DESC`
    )

    res.json({
      success: true,
      reports: result.rows,
    })
  } catch (error) {
    console.error("Get found reports error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to load found items.",
    })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        r.id,
        r.type,
        r.item_name,
        r.location,
        r.item_date,
        r.description,
        r.image_url,
        r.status,
        r.created_at,
        u.full_name AS poster_name,
        u.phone_number AS poster_phone,
        u.whatsapp_number AS poster_whatsapp,
        u.profile_picture AS poster_profile_picture
       FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.id = $1`,
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      })
    }

    res.json({
      success: true,
      report: result.rows[0],
    })
  } catch (error) {
    console.error("Get report error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to load report.",
    })
  }
})

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM reports
       WHERE id = $1
       AND user_id = $2
       RETURNING id`,
      [req.params.id, req.session.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found or you do not have permission to delete it.",
      })
    }

    res.json({
      success: true,
      message: "Report deleted successfully.",
    })
  } catch (error) {
    console.error("Delete report error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to delete report.",
    })
  }
})

router.put("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      "lost",
      "found",
      "claimed",
      "returned",
      "closed",
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status.",
      })
    }

    const result = await pool.query(
      `UPDATE reports
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING
        id,
        type,
        item_name,
        location,
        item_date,
        description,
        image_url,
        status,
        created_at`,
      [status, req.params.id, req.session.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found or you do not have permission to update it.",
      })
    }

    res.json({
      success: true,
      message: "Report status updated successfully.",
      report: result.rows[0],
    })
  } catch (error) {
    console.error("Update report status error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to update report status.",
    })
  }
})

module.exports = router