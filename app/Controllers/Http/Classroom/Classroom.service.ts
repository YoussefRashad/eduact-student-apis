import EnrollCourse from 'App/Models/EnrollCourse'
import EnrollClassroom from 'App/Models/EnrollClassroom'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Student from 'App/Models/Student'
import User from 'App//Models/User'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'
import ClassroomRepository from './Classroom.repository'
import Classroom from 'App/Models/Classroom'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import Course from 'App/Models/Course'
import AdmissionForm from 'App/Models/AdmissionForm'
import AdmissionFormResponse from 'App/Models/AdmissionFormResponse'
import CustomException from 'App/Exceptions/CustomException'
import FormQuestion from 'App/Models/FormQuestion'
import Response from 'App/Models/Response'

export default class ClassroomService {
  classroomRepository = new ClassroomRepository()
  /**
   *
   * @param user
   * @param courses
   * @param purchaseMethod
   */
  async enrollInCourses(user: User, courses: Array<Course>, purchaseMethod: string) {
    const student = await Student.find(user.id)
    const now = new Date()
    courses.map(async (course) => {
      await student?.related('courses').attach({
        [course.id]: {
          purchase_method: purchaseMethod,
          expired: false,
          expire_at: course.expiry_period ? new Date(now.setDate(now.getDate() + course.expiry_period)) : null,
        },
      })
    })
  }

  /**
   *
   * @param user
   * @param classroomIds
   */
  async enrollInClassrooms(user: User, classroomIds: Array<number>) {
    const student = await Student.find(user.id)
    await student?.related('classrooms').attach(classroomIds)
  }

  /**
   *
   * @param userId
   * @param courseId
   */
  async isEnrolledInCourse(userId: number, courseId: number) {
    const enrolled = await EnrollCourse.query().where('user_id', userId).where('course_id', courseId).first()
    return !!enrolled
  }

  /**
   *
   * @param user
   * @param classroomId
   */
  async isEnrolledInClassroom(user: User, classroomId: number) {
    const enrolled = await EnrollClassroom.query().where('user_id', user.id).where('classroom_id', classroomId).first()
    return !!enrolled
  }

  /**
   *
   * @param userId
   * @param classroomId
   */
  async getClassroomEnrollmentRowOrFail(userId: number, classroomId: number) {
    const enrolled = await EnrollClassroom.query().where('user_id', userId).where('classroom_id', classroomId).first()
    if (!enrolled) throw new ForbiddenException('User is not enrolled in this classroom')
    return enrolled
  }

  /**
   *
   * @param queryParams
   * @returns
   */
  public async fetch(queryParams: any) {
    const ctx = HttpContext.get()!
    queryParams = _.pick(queryParams, ['language', 'category', 'sub_type'])
    let { category, ...params } = queryParams
    const query = this.classroomRepository.fetch()
    if (category) this.classroomRepository.filterCategoryByName(query, category)
    //add where clause to all direct column filters got in the params
    for (const [key] of Object.entries(params)) {
      query.where(key, params[key])
    }
    const student = ctx.request.user?.student
    if (student) {
      this.classroomRepository.isStudentEnrolled(query, student)
      if (!category) this.classroomRepository.filterUserClassrooms(query, student)
    }
    this.classroomRepository.filterActiveAndOrderClassrooms(query)
    return query
  }

  /**
   * get classroom by label and current course, number of courses and number of active courses
   * @param label
   * @returns
   */
  async getClassroomByLabelOrFail(label: string): Promise<ModelObject> {
    const ctx = HttpContext.get()!
    const student = ctx.request.user?.student
    const query = Classroom.query()
    this.classroomRepository.getClassroomByLabel(query, label, student)
    if (student) {
      this.classroomRepository.isStudentEnrolled(query, student)
    }
    let classroom = await query.first()
    if (!classroom) throw new ResourceNotFoundException('Classroom not found')
    const classroomCoursesCount = await this.classroomRepository.classroomCoursesCount(classroom)
    classroom.courses_count = Number(classroomCoursesCount.courses_count)
    classroom.active_courses_count = Number(classroomCoursesCount.active_courses_count)
    if (student) {
      //enrolled courses in this classroom
      const courses = await this.classroomRepository.getEnrolledCourses(student.user_id)
      classroom.enrolledCourses = _.filter(courses, { classroom_id: classroom.id })
    }
    return this.groupPrerequisites(classroom)
  }

  public groupPrerequisites(classroom: Classroom) {
    const cl = classroom.toJSON()
    cl.tabs.forEach((tab: any) => {
      tab.sections.forEach((section: any) => {
        section.courses.forEach((course: any) => {
          course.prerequisites = _.groupBy(course.prerequisites, 'pivot.pivot_path')
        })
      })
    })
    return cl
  }

  /**
   *
   * @param searchKey
   * @returns
   */
  public async search(searchKey: string) {
    const ctx = HttpContext.get()!
    const classrooms = await this.classroomRepository.search(searchKey)
    let query = this.classroomRepository.fetch().whereIn(
      'id',
      classrooms.map((classroom) => {
        return classroom.id
      })
    )
    if (ctx.request.user) {
      this.classroomRepository.filterUserClassrooms(query, ctx.request.user?.student)
    }
    this.classroomRepository.filterActiveAndOrderClassrooms(query)
    return query.exec()
  }

  /**
   * get user's enrolled courses in classroom
   * @param classroom_id
   * @returns
   */
  public async getEnrolledCourses(classroom_id: number) {
    const ctx = HttpContext.get()!
    const student = ctx.request.user.student
    return this.classroomRepository.getEnrolledCoursesByClassroomId(classroom_id, student.user_id)
  }

  /**
   *
   * @param classroomId
   */
  public async getAdmissionForm(classroomId: number) {
    const classroom = await Classroom.find(classroomId)
    if (!classroom) throw new ResourceNotFoundException('Classroom not found')
    return AdmissionForm.query()
      .preload('questions', (query) => {
        query.orderBy('order')
      })
      .where('id', classroom.admission_form_id)
      .where('active', true)
      .first()
  }

  /**
   *
   * @param user
   * @param classroomId
   */
  public async checkStudentSubmission(user: User, classroomId: number) {
    const form = await this.getAdmissionForm(classroomId)
    if (!form) return false
    const sampleResponse = await AdmissionFormResponse.query()
      .where('student_id', user.id)
      .where('admission_form_id', form.id)
      .where('status', 'pending')
      .first()
    return !!sampleResponse
  }

  /**
   *
   * @param form
   * @param responses
   */
  public async isValidStudentSubmissionOrFail(form: AdmissionForm, responses: Object) {
    const ids = await this.getFormQuestionIds(form)
    // validates responses have the right question id and all questions is submitted
    for (const response_question_id of Object.keys(responses)) {
      if (!ids.includes(parseInt(response_question_id))) throw new CustomException('question id does not belong to this form', 400)
    }
    if (Object.keys(responses).length !== ids.length) {
      throw new CustomException('All fields in the for are required', 400)
    }
  }

  /**
   *
   * @param form
   */
  public async getFormQuestionIds(form: AdmissionForm) {
    const ids = await FormQuestion.query().select('question_id').where('admission_form_id', form.id)
    return ids.map((form) => form.questionId)
  }

  /**
   *
   * @param user
   * @param classroomId
   */
  public async checkStudentSubmissionOrFail(user: User, classroomId: number) {
    const submitted = await this.checkStudentSubmission(user, classroomId)
    if (submitted) throw new CustomException('You already have pending Admission request', 400)
  }

  /**
   *
   * @param user
   * @param form
   * @param responses
   */
  public async saveStudentResponses(user: User, form: AdmissionForm, responses: any) {
    // saves submission answers
    const studentResponse = await AdmissionFormResponse.create({
      admission_form_id: form.id,
      student_id: user.id,
    })
    //save question responses
    for (const key in responses) {
      await Response.create({
        admission_form_response_id: studentResponse.id,
        question_id: Number(key),
        student_id: user.id,
        answer: responses[key],
      })
    }
  }
}
