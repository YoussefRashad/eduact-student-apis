import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/rates', 'Payment/Recharge/Recharge.controller.getPaymentRates')

  Route.group(() => {
    Route.post('/', 'Payment/Recharge/Recharge.controller.rechargeRequest')
    Route.post('/direct', 'Payment/Recharge/Recharge.controller.rechargeWithRechargeCard')
    Route.post('/rollback', 'Payment/Recharge/Recharge.controller.rechargeRollback')
  }).middleware(['auth', 'isStudent', 'isVerifiedAccount'])

  Route.post('/callback', 'RechargeController.rechargeCallback')
})
  .prefix('api/recharge')
  .middleware(['auth', 'isStudent', 'isVerifiedAccount'])
