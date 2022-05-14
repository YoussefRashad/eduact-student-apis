import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/all', 'Instructor/Instructor.controller.fetch')
  Route.get('', 'Instructor/Instructor.controller.get')
  Route.group(() => {
    Route.post('apply', 'Instructor/Instructor.controller.apply')
  }).middleware(['auth', 'isStudent'])
}).prefix('api/instructor')
