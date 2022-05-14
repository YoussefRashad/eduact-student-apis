import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AcceptCash from 'App/lib/Payment/Accept/AcceptCash'
import AcceptOnline from 'App/lib/Payment/Accept/AcceptOnline'
import AcceptKiosk from 'App/lib/Payment/Accept/AcceptKiosk'
import AcceptEwallet from 'App/lib/Payment/Accept/AcceptEwallet'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class AcceptProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    this.app.container.singleton('Payment/AcceptOnline', () => {
      return new AcceptOnline(this.app.env)
    })
    this.app.container.singleton('Payment/AcceptCash', () => {
      return new AcceptCash(this.app.env)
    })
    this.app.container.singleton('Payment/AcceptKiosk', () => {
      return new AcceptKiosk(this.app.env)
    })
    this.app.container.singleton('Payment/AcceptEwallet', () => {
      return new AcceptEwallet(this.app.env)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
