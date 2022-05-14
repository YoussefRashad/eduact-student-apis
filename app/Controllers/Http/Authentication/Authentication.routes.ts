import Route from '@ioc:Adonis/Core/Route'

//Auth Routes:
//--------------
Route.group(() => {
  Route.post('/signup', 'Authentication/Authentication.controller.signup')
  Route.post('/login', 'Authentication/Authentication.controller.login')
  Route.post('/email/confirm', 'Authentication/Authentication.controller.confirmEmailAddress')
  //Password forget cycle
  Route.group(() => {
    Route.post('/forget', 'Authentication/Authentication.controller.forgetPassword')
    Route.post('/reset', 'Authentication/Authentication.controller.resetPassword')
  }).prefix('/password')
  //Resending verifications
  Route.post('/email/verification/resend', 'Authentication/Authentication.controller.resendEmailVerification')
  Route.post('/password/verification/resend', 'Authentication/Authentication.controller.forgetPassword')
}).prefix('/api/auth')
