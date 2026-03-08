export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Something went wrong while processing your request";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      message,
    },
  });
};

