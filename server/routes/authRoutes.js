const express = require("express")
const bcrypt = require("bcrypt")
const pool = require("../db")
const { sendEmail } = require("../services/emailService")

const router = express.Router()

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, phone_number, whatsapp_number, profile_picture, created_at`,
      [fullName.trim(), normalizedEmail, passwordHash]
    )

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Signup error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the account.",
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        password_hash,
        phone_number,
        whatsapp_number,
        profile_picture
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) {
        console.error("Session regeneration error:", sessionError)

        return res.status(500).json({
          success: false,
          message: "Unable to create login session.",
        })
      }

      req.session.userId = user.id

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save error:", saveError)

          return res.status(500).json({
            success: false,
            message: "Unable to save login session.",
          })
        }

        res.json({
          success: true,
          message: "Login successful.",
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            whatsapp_number: user.whatsapp_number,
            profile_picture: user.profile_picture,
          },
        })
      })
    })
  } catch (error) {
    console.error("Login error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    })
  }
})

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const result = await pool.query(
      `SELECT id, full_name, email
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account was found with that email address.",
      })
    }

    const user = result.rows[0]

    const resetCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await pool.query(
      `UPDATE users
       SET reset_code = $1,
           reset_code_expires_at = $2
       WHERE id = $3`,
      [resetCode, expiresAt, user.id]
    )

    await sendEmail({
      to: user.email,
      subject: "Your I FOUND Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
          <h1 style="margin-bottom: 20px;">I FOUND</h1>
          <p>Hello ${user.full_name},</p>
          <p>We received a request to reset the password for your I FOUND account.</p>
          <p style="margin-top: 25px; margin-bottom: 10px;">Your password reset code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p style="margin-top: 30px;">I FOUND</p>
        </div>
      `,
    })

    res.json({
      success: true,
      message: "Password reset code sent to your email.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request.",
    })
  }
})

router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and reset code are required.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedCode = code.trim()

    const result = await pool.query(
      `SELECT id, reset_code, reset_code_expires_at
       FROM users
       WHERE email = $1
       AND reset_code = $2
       AND reset_code_expires_at > NOW()`,
      [normalizedEmail, normalizedCode]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code.",
      })
    }

    res.json({
      success: true,
      message: "Reset code verified successfully.",
    })
  } catch (error) {
    console.error("Verify reset code error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the reset code.",
    })
  }
})

router.post("/reset-password", async (req, res) => {
  try {
    const {
      email,
      code,
      newPassword,
      confirmPassword,
    } = req.body

    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedCode = code.trim()

    const result = await pool.query(
      `SELECT id
       FROM users
       WHERE email = $1
       AND reset_code = $2
       AND reset_code_expires_at > NOW()`,
      [normalizedEmail, normalizedCode]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code.",
      })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           reset_code = NULL,
           reset_code_expires_at = NULL
       WHERE id = $2`,
      [passwordHash, result.rows[0].id]
    )

    res.json({
      success: true,
      message: "Password reset successfully.",
    })
  } catch (error) {
    console.error("Reset password error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    })
  }
})

router.get("/me", async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      })
    }

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
      req.session.destroy(() => {})

      return res.status(401).json({
        success: false,
        message: "User account not found.",
      })
    }

    res.json({
      success: true,
      user: result.rows[0],
    })
  } catch (error) {
    console.error("Get current user error:", error)

    res.status(500).json({
      success: false,
      message: "Something went wrong while checking your account.",
    })
  }
})

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error)

      return res.status(500).json({
        success: false,
        message: "Unable to log out.",
      })
    }

    res.clearCookie("ifound_session")

    res.json({
      success: true,
      message: "Logged out successfully.",
    })
  })
})

module.exports = router