export const successResponse = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data
})

export const errorResponse = (err: any, message = 'Terjadi kesalahan') => ({
  success: false,
  message,
  error: err instanceof Error ? err.message : err
})