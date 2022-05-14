import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Course from 'App/Models/Course'
import Classroom from 'App/Models/Classroom'
import User from 'App/Models/User'
import Scratchcard from 'App/Models/Scratchcard'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import CoursePrerequisite from 'App/Models/CoursePrerequisite'
import BadRequestException from 'App/Exceptions/BadRequestException'
import _ from 'lodash'
import TransactionsRepository from 'App/Controllers/Http/Payment/Transactions/Transactions.repository'
import InvoicesRepository from 'App/Controllers/Http/Payment/Invoices/Invoices.repository'
import ClassroomService from 'App/Controllers/Http/Classroom/Classroom.service'
import StudentService from 'App/Controllers/Http/Student/Student.service'
import AdmissionFormResponse from 'App/Models/AdmissionFormResponse'
import RedirectionException from 'App/Exceptions/RedirectionException'
import Codes from 'App/Constants/Codes'

export default class CheckoutService {
  private transactionRepository = new TransactionsRepository()
  private invoiceRepository = new InvoicesRepository()
  private classroomService = new ClassroomService()
  private studentService = new StudentService()

  /**
   * Check if the course is buyable or throw an exception
   * Check if the user is not enrolled in the course or throw exception
   * @param {*} user
   * @param {*} course
   * @param {*} classroom
   */
  public async isCourseBuyableOrFail(user: User, course: Course, classroom: Classroom) {
    if (!course.active) throw new ForbiddenException('Course is not active')
    if (!course.buyable) throw new ForbiddenException('Course is not buyable')
    const enrolled = await this.classroomService.getClassroomEnrollmentRowOrFail(user.id, classroom.id)
    if (!enrolled.active) {
      throw new ForbiddenException('User enrollment is suspended')
    }
    const isEnrolledInCourse = await this.classroomService.isEnrolledInCourse(user.id, course.id)
    if (isEnrolledInCourse) {
      throw new ForbiddenException('User is enrolled in this course')
    }
  }

  /**
   * Check if the course is expired
   * @param {*} course
   */
  public async isCourseExpired(course: Course) {
    if (course.expired) throw new ForbiddenException('Course is expired')
  }

  /**
   * Enroll User with wallet
   * @param {*} user
   * @param {*} course
   * @param classroom
   */
  public async buyCourse(user: User, course: Course, classroom: Classroom) {
    await this.studentService.isSufficient(user, course.price)
    await this.classroomService.enrollInCourses(user, [course], 'wallet')
    // making invoices and transactions of the enrollment
    const { invoice } = await this.createInvoiceWithTransaction(user, course)
    //deducting amount from wallet if the enrollment is successful with specifying the reason for debugging
    await this.studentService.deductFromWallet(user, invoice.price, invoice, `Purchase course ${course.name}`)
    // add purchase log
    await this.setEnrollmentInClassroom(user, classroom)
    await this.studentService.addPurchaseTimelineLog(user, course)
  }

  /**
   * Enroll user with scrtch card code
   * @param {*} user
   * @param {*} code
   * @param {*} course
   * @param {*} classroom
   */
  public async enrollWithScratchcard(user: User, code: string, course: Course, classroom: Classroom) {
    const card = await Scratchcard.query().where('code', code).where('classroom_id', classroom.id).first()
    if (!card) throw new ResourceNotFoundException('Invalid Code')
    if (card.user_id) throw new ForbiddenException('This Code has been used before!')
    if (card.course_id && Number(course.id) !== Number(card.course_id))
      throw new ForbiddenException(`This code an only be used on ${course.name} course`)
    await this.classroomService.enrollInCourses(user, [course], 'scratchcard')
    card.user_id = user.id
    card.course_id = course.id
    await card.save()
    //Add code purchase log
    await this.studentService.addScratchcardTimelineLog(user, course, code)
    await this.setEnrollmentInClassroom(user, classroom)
  }

  /**
   * Enroll User in Free Course
   * @param user
   * @param course
   * @param classroom
   * @returns {Promise<void>}
   */
  public async enrollFreeCourse(user: User, course: Course, classroom: Classroom) {
    await this.classroomService.enrollInCourses(user, [course], 'free')
    await this.setEnrollmentInClassroom(user, classroom)
  }

  /**
   * Create the needed invoice and associated tansaction for the purchase
   * @param {*} user
   * @param {*} course
   */
  public async createInvoiceWithTransaction(user: User, course: Course) {
    const trx = await this.transactionRepository.createWalletTransaction(course.price)
    const invoice = await this.invoiceRepository.createWalletInvoice(trx, user.id, 'purchase')
    await invoice.related('courses').attach([course.id])
    return { invoice, trx }
  }

  /**
   * Set the status of classroom enrollment in different admission cases
   * @param {*} user
   * @param {*} classroom
   */
  public async setEnrollmentInClassroom(user: User, classroom: Classroom) {
    const enrolled = await this.classroomService.isEnrolledInClassroom(user, classroom.id)
    if (!enrolled) {
      await this.classroomService.enrollInClassrooms(user, [classroom.id])
    }
  }

  /**
   * Check if the user satisfies all prerequisites
   * @param user
   * @param course
   * @returns {Promise<void>}
   */
  public async checkCoursePrerequisites(user: User, course: Course) {
    const prerequisites = await CoursePrerequisite.query().where('course_id', course.id)
    if (prerequisites.length === 0) return
    const prerequisitesGroupedByPath = _.groupBy(prerequisites, 'path')
    let prerequisitesNames = []
    for (const prerequisitesPath of Object.keys(prerequisitesGroupedByPath)) {
      const pathCourses = prerequisitesGroupedByPath[prerequisitesPath]
      const prerequisitesPathIds = _.map(pathCourses, 'prerequisite')
      const enrolledCourses = await user.related('courses').query().whereIn('id', prerequisitesPathIds)
      const enrolledCoursesIds = _.map(enrolledCourses, 'id')
      if (enrolledCoursesIds.length === prerequisitesPathIds.length) return
      prerequisitesNames.push(`${_.map(await course.related('prerequisites').query().where('path', prerequisitesPath), 'name').join(' & ')}`)
    }
    throw new BadRequestException(`You have to purchase the following courses first: ${prerequisitesNames.join(' OR ')}`)
  }

  /**
   *
   * @param id
   */
  public async getCourseByIdOrFail(id: number): Promise<Course> {
    const course = await Course.query().where('id', id).preload('classroom').first()
    if (!course) throw new ResourceNotFoundException('Course Not Found')
    return course
  }

  /**
   *
   * @param classroom
   * @param studentId
   */
  public async hasPassedAdmission(classroom: Classroom, studentId: number) {
    if (!classroom.has_admission) {
      return
    }
    const admission = await AdmissionFormResponse.query()
      .where('admission_form_id', classroom.admission_form_id)
      .where('student_id', studentId)
      .orderBy('created_at', 'desc')
      .first()
    if (!admission) {
      throw new RedirectionException('Admission form required', Codes.Error.Redirect.ADMISSION_FORM_REQUIRED)
    }
    if (admission.status !== 'accepted') {
      throw new ForbiddenException('Admission pending approval')
    }
  }

  /**
   *
   * @param classroom
   */
  public async incrementClassroomEnrolledCount(classroom: Classroom) {
    classroom.enrolled_count += 1
    await classroom.save()
  }
}
