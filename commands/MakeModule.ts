import { args, BaseCommand } from '@adonisjs/core/build/standalone'
import execa from 'execa'

export default class MakeModule extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:module'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'A Custom command to make new module with the new module structure'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  @args.string({ name: 'Module Name' })
  public name: string

  public async run() {
    await execa.command(`mkdir ./app/Controllers/Http/${this.name}`)
    await execa.commandSync(`touch ./app/Controllers/Http/${this.name}/${this.name}.controller.ts`)
    await execa.commandSync(
      `echo 'export default class ${this.name}Controller {}'  > ./app/Controllers/Http/${this.name}/${this.name}.controller.ts`,
      { shell: true }
    )
    await execa.commandSync(`touch ./app/Controllers/Http/${this.name}/${this.name}.service.ts`)
    await execa.commandSync(`echo 'export default class ${this.name}Service {}'  > ./app/Controllers/Http/${this.name}/${this.name}.service.ts`, {
      shell: true,
    })
    await execa.commandSync(`touch ./app/Controllers/Http/${this.name}/${this.name}.routes.ts`)
    await execa.commandSync(`echo "import Route from '@ioc:Adonis/Core/Route'" > ./app/Controllers/Http/${this.name}/${this.name}.routes.ts`, {
      shell: true,
    })
    await execa.commandSync(`touch ./app/Controllers/Http/${this.name}/${this.name}.repository.ts`)
    await execa.commandSync(
      `echo "export default class ${this.name}Repository {}" > ./app/Controllers/Http/${this.name}/${this.name}.repository.ts`,
      { shell: true }
    )
    await execa.commandSync(`echo "import 'App/Controllers/Http/${this.name}/${this.name}.routes'"  >> ./start/routes.ts`, { shell: true })
  }
}
