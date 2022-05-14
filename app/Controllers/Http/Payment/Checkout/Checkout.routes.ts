import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/course', 'Payment/Checkout/Checkout.controller.checkoutSingleCourse')
})
  .prefix('api/checkout')
  .middleware(['auth', 'isVerifiedAccount'])
