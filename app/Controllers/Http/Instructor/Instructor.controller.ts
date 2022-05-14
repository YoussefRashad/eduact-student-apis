import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Http from 'App/Utils/Http'
import InstructorService from 'App/Controllers/Http/Instructor/Instructor.service'
import InstructorCenterApplyValidator from 'App/Validators/InstructorCenterApplyValidator'

export default class InstructorController {
  private instructorService = new InstructorService()

  /**
   * Get all Instructors with all their preloaded data
   * @param request
   */
  public async fetch({ request }: HttpContextContract) {
    const instructors = await this.instructorService.fetch(request.input('student'))
    return Http.respond({ data: instructors, message: 'Instructors' })
  }

  /**
   * Get single instructor with all preloaded data
   * @param request
   */
  public async get({ request }: HttpContextContract) {
    const instructor = await this.instructorService.get(request.input('label'))
    return Http.respond({ data: instructor, message: 'Instructor' })
  }

  /**
   *
   * @param request
   */
  public async apply({ request }: HttpContextContract) {
    const payload = await request.validate(InstructorCenterApplyValidator)
    await this.instructorService.apply(payload.code, payload.instructorId)
    return Http.respond({ message: 'Application accepted' })
  }
}
