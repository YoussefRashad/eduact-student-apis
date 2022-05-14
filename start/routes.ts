/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})
import 'App/Controllers/Http/Student/Student.routes'
import 'App/Controllers/Http/Authentication/Authentication.routes'
import 'App/Controllers/Http/Instructor/Instructor.routes'
import 'App/Controllers/Http/Classroom/Classroom.routes'
import 'App/Controllers/Http/Newsfeed/Newsfeed.routes'
import 'App/Controllers/Http/Settings/Settings.routes'
import 'App/Controllers/Http/Dropdown/Dropdown.routes'
import 'App/Controllers/Http/Statistics/Statistics.routes'
import 'App/Controllers/Http/Payment/Recharge/Recharge.routes'
import 'App/Controllers/Http/Payment/Transactions/Transactions.routes'
import 'App/Controllers/Http/Payment/Checkout/Checkout.routes'
