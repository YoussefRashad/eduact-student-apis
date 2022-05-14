import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Newsfeed/Newsfeed.controller.newsfeeds')
}).prefix('api/newsfeed')
