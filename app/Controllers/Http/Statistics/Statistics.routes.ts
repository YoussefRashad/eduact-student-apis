import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Statistics/Statistics.controller.siteStatistics')
}).prefix('api/statistics')
