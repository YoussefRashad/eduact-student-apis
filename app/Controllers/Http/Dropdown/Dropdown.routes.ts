import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'Dropdown/Dropdown.controller.fetchCategories')
}).prefix('api/categories')

Route.group(() => {
  Route.get('/', 'Dropdown/Dropdown.controller.educationInfoDropdown')
}).prefix('api/education/info')
