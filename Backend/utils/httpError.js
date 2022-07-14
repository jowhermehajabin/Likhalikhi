class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.statusCode = errorCode;
    this.status = `${errorCode}`.startsWith("4") ? "fail" : "error";
  }
}

module.exports = HttpError;
