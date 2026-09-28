const pool = require("./db")

async function addPasswordResetFields() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS reset_code_expires_at TIMESTAMP
    `)

    console.log("Password reset fields added successfully.")
  } catch (error) {
    console.error("Failed to add password reset fields:", error)
  } finally {
    await pool.end()
  }
}

addPasswordResetFields()