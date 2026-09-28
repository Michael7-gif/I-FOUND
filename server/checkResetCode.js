require("dotenv").config()

const pool = require("./db")

async function checkResetCode() {
  try {
    const result = await pool.query(
      `SELECT email, reset_code, reset_code_expires_at, NOW() AS database_now
       FROM users
       WHERE email = $1`,
      ["mikelchuks0@gmail.com"]
    )

    console.log(result.rows)
  } catch (error) {
    console.error("Database check failed:", error)
  } finally {
    await pool.end()
  }
}

checkResetCode()