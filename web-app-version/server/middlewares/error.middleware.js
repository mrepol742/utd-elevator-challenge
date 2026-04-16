export default function errorMiddleware(err, req, res, next) {
  console.error(err); // log for debugging

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
