require("dotenv").config()

const pool = require("./db")

async function checkUsers() {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, created_at
       FROM users
       ORDER BY id`
    )

    console.log(result.rows)
  } catch (error) {
    console.error("Database check failed:", error)
  } finally {
    await pool.end()
  }
}

checkUsers()