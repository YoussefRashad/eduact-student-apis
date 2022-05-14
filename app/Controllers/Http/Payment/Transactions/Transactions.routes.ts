import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/callback/fawry', 'RechargeController.fawryServerCallback').middleware(['verifyFawryCallbackSignature'])
    Route.post('/callback/accept', 'TransactionController.acceptTransactionNotification').middleware(['verifyAcceptNotificationCallbackSignature'])
    Route.post('/callback/opay', 'TransactionController.OpayServerCallback').middleware(['verifyOpayCallbackSignature'])
  }).prefix('callback')
})
  .prefix('api/transactions')
  .middleware(['auth, isStudent'])
