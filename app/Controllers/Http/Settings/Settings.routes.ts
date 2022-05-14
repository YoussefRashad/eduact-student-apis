import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Settings/Settings.controller.settings')
}).prefix('api/settings')
