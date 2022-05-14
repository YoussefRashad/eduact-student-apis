module.exports = {
  //Prefix to wrap named variables in html files
  prefix: '%%',
  //Html Files to include with an array of available variables
  files: {
    'verify-en': ['name', 'verify_url'],
    'verify-ar': ['name', 'verify_url'],
    'resetPassword-en': ['name', 'reset_url'],
    'resetPassword-ar': ['name', 'reset_url'],
    'approved-en': ['name', 'classroom_name', 'classroom_url'],
    'approved-ar': ['name', 'classroom_name', 'classroom_url'],
    'denied-en': ['name', 'classroom_name', 'instructor_name', 'classroom_url'],
    'denied-ar': ['name', 'classroom_name', 'instructor_name', 'classroom_url'],
    'test-ar': ['classroom_name', 'instructor_name', 'unit_name', 'percentage'],
  },
}
