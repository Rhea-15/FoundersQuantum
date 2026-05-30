export function errorHandler(err, req, res, next) {
    console.error('[error]', err.message, err.stack?.split('\n')[1])
  
    if (res.headersSent) return next(err)
  
    const status = err.status || err.statusCode || 500
    res.status(status).json({
      error: err.code || 'internal_error',
      message: err.message || 'An unexpected error occurred.',
    })
  }
  
  export class AppError extends Error {
    constructor(message, code, status = 400) {
      super(message)
      this.code = code
      this.status = status
    }
  }