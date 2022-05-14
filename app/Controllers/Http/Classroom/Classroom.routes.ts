import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/all', 'Classroom/Classroom.controller.fetch')
  Route.get('/get/:label', 'Classroom/Classroom.controller.getClassroom')
  Route.get('/search', 'Classroom/Classroom.controller.search')
  Route.group(() => {
    Route.get('/enrolled', 'Classroom/Classroom.controller.getEnrolledCourses')
  })
    .prefix('course')
    .middleware(['auth', 'isStudent', 'isVerifiedAccount'])
}).prefix('api/classroom')

Route.group(() => {
  Route.get('/:classroom_id', 'Classroom/Classroom.controller.getAdmissionForm')
  Route.post('/submit', 'Classroom/Classroom.controller.submitAdmissionForm')
}).prefix('api/admission/form')
