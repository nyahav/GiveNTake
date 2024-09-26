export const ERR_VARIANT = {
  error: 'error',
  warning: 'warning',
  info: 'info'
}

export default class AppError extends Error {
  constructor(message, statusCode, variant = ERR_VARIANT.error) {
    super(message)

    this.statusCode = statusCode || 500
    this.variant = variant
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}
