// 404 handler
const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

// Central error handler -> always returns JSON { message }
const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }
  if (err.code === 11000) {
    status = 400;
    message = "That email is already registered";
  }
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  }
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
