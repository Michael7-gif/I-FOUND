const pool = require("./db")

async function createReportsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('lost', 'found')),
        item_name VARCHAR(150) NOT NULL,
        location VARCHAR(255) NOT NULL,
        item_date DATE NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'lost',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Reports table created successfully.")
  } catch (error) {
    console.error("Reports table creation failed:", error)
  } finally {
    await pool.end()
  }
}

createReportsTable()