import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'Student/Student.controller.getStudentProfile')
    Route.put('/', 'Student/Student.controller.updateStudentProfile').middleware(['FilterUserObject'])
    Route.put('/complete', 'Student/Student.controller.completeProfile').middleware(['FilterUserObject'])
    Route.put('/password/change', 'Student/Student.controller.changePassword')
    Route.post('/picture/upload', 'Student/Student.controller.uploadProfilePic')
    Route.post('/wallet/history', 'Student/Student.controller.getWalletHistory')
    Route.post('/timeline', 'Student/Student.controller.getTimeline')
    Route.post('/invoices', 'Student/Student.controller.getAllInvoices')
    Route.get('/classrooms', 'Student/Student.controller.getEnrolledClassrooms')
    Route.get('/courses', 'Student/Student.controller.getPurchasedCourses')
  })
    .prefix('profile')
    .middleware(['auth', 'isStudent'])

  Route.group(() => {
    Route.post('/', 'Student/Student.controller.parentStudentProfile')
    Route.post('/check', 'Student/Student.controller.parentStudentProfileCheck')
    Route.post('/course', 'Student/Student.controller.ProgressInCourse')
  })
    .prefix('progress')
    .middleware(['auth', 'isStudent', 'isVerifiedAccount'])
}).prefix('api/student')
