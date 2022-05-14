import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClassroomService from './Classroom.service'
import Http from 'App/Utils/Http'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import AdmissionFormSubmissionValidator from 'App/Validators/AdmissionFormSubmissionValidator'
export default class ClassroomController {
  classroomService = new ClassroomService()

  /**
   * Get all Classrooms with filters
   * Available filters: type, language, category
   * @param request
   * @returns
   */
  public async fetch({ request }: HttpContextContract) {
    const classrooms = await this.classroomService.fetch(request.qs())
    return Http.respond({
      data: classrooms,
      message: 'Classrooms',
    })
  }

  /**
   *
   * @param request
   * @returns
   */
  public async getClassroom({ request }: HttpContextContract) {
    let classroom = await this.classroomService.getClassroomByLabelOrFail(request.params().label)
    return Http.respond({
      data: classroom,
      message: 'Classroom',
    })
  }

  /**
   * Search classrooms
   * Available search fields: instructor, title, description
   * @param request
   * @returns
   */
  public async search({ request }: HttpContextContract) {
    const classrooms = await this.classroomService.search(request.qs().query)
    return Http.respond({
      data: classrooms,
      message: 'Classrooms',
    })
  }

  /**
   * Get user's enrolled course in a specific classroom
   * @param request
   * @param response
   * @returns
   */
  public async getEnrolledCourses({ request }: HttpContextContract) {
    const courses = await this.classroomService.getEnrolledCourses(request.qs().classroom_id)
    return Http.respond({
      data: courses,
      message: 'Enrolled Courses',
    })
  }

  /**
   *
   * @param request
   * @param params
   */
  public async getAdmissionForm({ request, params }: HttpContextContract) {
    if (!params.classroom_id) throw new ResourceNotFoundException('classroom id is required')
    const form = await this.classroomService.getAdmissionForm(params.classroom_id)
    if (!form) {
      throw new ResourceNotFoundException('Form not found')
    }
    form.submissionStatus = await this.classroomService.checkStudentSubmission(request.user, params.classroom_id)
    return Http.respond({ data: form, message: 'Admission form' })
  }

  /**
   *
   * @param request
   */
  public async submitAdmissionForm({ request }: HttpContextContract) {
    const { classroom_id, responses } = await request.validate(AdmissionFormSubmissionValidator)
    const form = await this.classroomService.getAdmissionForm(classroom_id)
    if (!form) {
      throw new ResourceNotFoundException('form not found')
    }
    //check for valid submission payload
    await this.classroomService.isValidStudentSubmissionOrFail(form, responses)
    //check if the student has pending response already
    await this.classroomService.checkStudentSubmissionOrFail(request.user, classroom_id)
    await this.classroomService.saveStudentResponses(request.user, form, responses)
    return Http.respond({ message: 'Submission successful' })
  }
}
