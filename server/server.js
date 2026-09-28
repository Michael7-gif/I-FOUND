const express = require("express")
const cors = require("cors")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
require("dotenv").config()

const pool = require("./db")
const authRoutes = require("./routes/authRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const profileRoutes = require("./routes/profileRoutes")
const reportRoutes = require("./routes/reportRoutes")

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: "ifound_session",
    secret: process.env.SESSION_SECRET || "ifound-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "I FOUND backend is running.",
  })
})

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")

    res.json({
      success: true,
      message: "Database connected successfully.",
      time: result.rows[0].now,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    })
  }
})

app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/reports", reportRoutes)

app.listen(PORT, () => {
  console.log(`I FOUND backend running on port ${PORT}`)
})