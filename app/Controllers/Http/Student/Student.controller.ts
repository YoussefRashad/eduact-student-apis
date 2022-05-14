import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Messages from 'App/Constants/Messages'
import Http from 'App/Utils/Http'
import CompleteProfile from 'App/Validators/CompleteProfile'
import UpdateUser from 'App/Validators/UpdateUser'
import StudentService from './Student.service'
import ChangePassword from 'App/Validators/ChangePassword'
import GeneralAllValidator from 'App/Validators/GeneralAllValidator'
import FetchInvoicesValidator from 'App/Validators/FetchInvoicesValidator'
import ParentStudentProfile from 'App/Validators/ParentStudentProfile'
import StudentProgressInCourse from 'App/Validators/StudentProgressInCourse'

export default class StudentController {
  studentService = new StudentService()
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async getStudentProfile({ request }: HttpContextContract) {
    //getting the whole user profile from database
    let userProfile = await this.studentService.getUserProfile(request.user.id)
    //return response to user
    return Http.respond({
      data: {
        ...userProfile.$attributes,
        ...userProfile.$preloaded,
        type: userProfile?.type,
      },
      message: Messages.user.success.USER_PROFILE,
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async updateStudentProfile({ request }: HttpContextContract) {
    const requestBody = await request.validate(UpdateUser)
    await this.studentService.updateStudentProfile(request.user.id, requestBody)
    return Http.respond({
      message: Messages.user.success.EDIT_PROFILE,
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  public async completeProfile({ request }: HttpContextContract) {
    const requestBody = await request.validate(CompleteProfile)
    await this.studentService.completeProfile(request.user.id, requestBody)
    return Http.respond({
      message: Messages.user.success.EDIT_PROFILE,
    })
  }
  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async changePassword({ request }: HttpContextContract) {
    const { old_password, new_password, confirm_new_password } = await request.validate(ChangePassword)
    await this.studentService.changePassword(request.user, old_password, new_password, confirm_new_password)
    return Http.respond({
      message: Messages.user.success.CHANGE_PASSWORD,
    })
  }

  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async uploadProfilePic({ request }: HttpContextContract) {
    await this.studentService.uploadProfilePic(request.user)
    return Http.respond({
      message: request.user.profile_photo,
    })
  }

  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async getWalletHistory({ request }: HttpContextContract) {
    const requestBody = await request.validate(GeneralAllValidator)
    const walletLogs = await this.studentService.getWalletHistory(request.user.id, requestBody)
    /**
     * TODO: response body changed
     */
    return Http.respond({
      data: walletLogs.toJSON().data,
      meta: walletLogs.toJSON().meta,
      message: 'User wallet History',
    })
  }

  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async getTimeline({ request }: HttpContextContract) {
    const requestBody = await request.validate(GeneralAllValidator)
    const timeLines = await this.studentService.getTimeline(request.user.id, requestBody)
    /**
     * TODO: response body changed
     */
    return Http.respond({
      data: timeLines.toJSON().data,
      meta: timeLines.toJSON().meta,
      message: 'User Timeline',
    })
  }

  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async getAllInvoices({ request }: HttpContextContract) {
    const requestBody = await request.validate(FetchInvoicesValidator)
    const invoices = await this.studentService.getAllInvoices(request.user.id, requestBody)
    /**
     * TODO: response body changed
     */
    return Http.respond({
      data: invoices,
      message: 'User invoices',
    })
  }

  /**
   * get all enrolled classrooms for the user when the classroom is active with its category and educationYears and the instructor of the classroom
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async getEnrolledClassrooms({ request }: HttpContextContract) {
    let enrolledClassrooms = await this.studentService.getEnrolledClassrooms(request.user.id)
    /**
     * TODO: response body changed
     */
    return Http.respond({
      data: enrolledClassrooms,
      message: 'User Classrooms',
    })
  }

  /**
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async parentStudentProfileCheck({ request }: HttpContextContract) {
    const { parentPhone, username } = await request.validate(ParentStudentProfile)
    await this.studentService.findStudentForParentOrFail(parentPhone, username)
    return Http.respond({
      message: 'parent login',
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async ProgressInCourse({ request }: HttpContextContract) {
    /**
     * TODO: Needs to add implementation progress
     * TODO: change api route from api/student/course/progress to api/student/progress/course
     * TODO: talent lms
     */
    const { course_id, username } = await request.validate(StudentProgressInCourse)
    const progress = await this.studentService.getProgressInCourse('id', course_id, username)
    return Http.respond({
      data: progress,
      message: 'parent login',
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  public async parentStudentProfile({ request }: HttpContextContract) {
    /**
     * TODO: Needs to calculate the analytics of the classroom
     * TODO: Talent lms
     */
    const { parentPhone, username } = await request.validate(ParentStudentProfile)
    const user = await this.studentService.findStudentForParentOrFail(parentPhone, username)
    const progress = await this.studentService.getParentStudentProfile(user)
    return Http.respond({
      data: progress,
      message: 'student profile',
    })
  }
}
