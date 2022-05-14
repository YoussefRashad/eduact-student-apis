export default {
  Error: {
    // Frontend redirection codes
    Redirect: {
      PHONE_VERIFICATION: 101,
      EMAIL_VERIFICATION: 102,
      COMPLETE_PROFILE: 103,
      ADMISSION_FORM_REQUIRED: 201,
    },
    // Refer to https://www.postgresql.org/docs/8.2/errcodes-appendix.html
    Database: {
      UNIQUE_VIOLATION: 23505,
      FOREIGN_KEY_VIOLATION: 23503,
    },
    // Refer to https://www.restapitutorial.com/httpstatuscodes.html
    Http: {
      INTERNAL_SERVER_ERROR: 500,
      BAD_REQUEST: 400,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      UNAUTHORIZED: 401,
      CONFLICT: 409,
    },
  },
}
