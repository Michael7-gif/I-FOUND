function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to upload an image.",
    })
  }

  next()
}

module.exports = requireAuth