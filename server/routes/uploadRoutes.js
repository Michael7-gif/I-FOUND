const express = require("express")
const multer = require("multer")
const cloudinary = require("../config/cloudinary")
const requireAuth = require("../middleware/authMiddleware")

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, and WebP images are allowed.")
      )
    }

    callback(null, true)
  },
})

router.post(
  "/image",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image was uploaded.",
        })
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ifound",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )

        uploadStream.end(req.file.buffer)
      })

      res.status(201).json({
        success: true,
        message: "Image uploaded successfully.",
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      })
    } catch (error) {
      console.error("Image upload error:", error)

      res.status(500).json({
        success: false,
        message: "Unable to upload image.",
      })
    }
  }
)

module.exports = router