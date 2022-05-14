import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import Course from 'App/Models/Course'
import EnrollClassroom from 'App/Models/EnrollClassroom'
import Student from 'App/Models/Student'
import TimeLineLog from 'App/Models/TimeLineLog'
import User from 'App/Models/User'
import WalletLog from 'App/Models/WalletLog'
import ControllersUtils from 'App/Utils/ControllersUtils'
import Address from 'App/Models/Address'
import Invoice from 'App/Models/Invoice'

export default class StudentRepository {
  /**
   * find user by email or phone number for login
   * @param identifier
   * @returns
   */
  public async findByEmailOrPhone(identifier: string): Promise<User | null> {
    return User.query().where('email', identifier).orWhere('phone_number', identifier).first()
  }

  /**
   *
   * @param id
   * @returns
   */
  async getUserProfile(id: number): Promise<User | null> {
    return await User.query()
      .where('id', id)
      .preload('student', (query) => {
        query.preload('address')
        query.preload('wallet')
      })
      .preload('instructor')
      .first()
  }

  /**
   *
   * @param id
   * @returns
   */
  async getUserType(id: number): Promise<Array<string>> {
    let type = []
    const user = await User.query().where('id', id).preload('student').preload('instructor').first()
    if (!user) {
      throw new ResourceNotFoundException('User not found')
    }
    if (user.student) type.push('student')
    if (user.instructor) type.push('instructor')
    return type
  }

  /**
   * get all enrolled classrooms for the user when the classroom is active with its category and educationYears and the instructor of the classroom
   * @param userId
   * @returns
   */
  public async getEnrolledClassrooms(userId: number) {
    const student = await Student.query()
      .where('user_id', userId)
      .preload('classrooms', (classroomsQuery) => {
        classroomsQuery
          .where('classrooms.active', true)
          .preload('instructor', (instructorQuery) => {
            instructorQuery.preload('user')
          })
          .preload('category')
          .preload('educationYears')
      })
      .firstOrFail()
    return student.classrooms
  }

  /**
   *
   * @param id
   * @param data
   */
  public async updateUser(id: number, data: any) {
    await User.query().where('id', id).update(data)
  }

  /**
   *
   * @param id
   * @param data
   */
  public async updateStudent(id: number, data: any) {
    await Student.query().where('user_id', id).update(data)
  }

  /**
   *
   * @param id
   * @param userObj
   */
  public async updateStudentProfile(id: number, userObj: any) {
    let { student, address, ...user } = userObj
    if (Object.keys(user).length) await this.updateUser(id, user)
    if (student) await this.updateStudent(id, student)
    //check and update address
    if (address) {
      if (await Address.query().where('user_id', id).first()) {
        await Address.query().where('user_id', id).update(address)
      } else {
        await Address.create(Object.assign({}, { ...address, user_id: id }))
      }
    }
  }

  /**
   *
   * @param filters
   * @param from
   * @param to
   * @param userId
   * @returns invoices
   */
  public async getAllInvoices(filters: any[], from: string, to: string, userId: number) {
    const invoiceQuery = Invoice.query()
      .where('user_id', userId)
      .select('*', 'invoices.created_at', 'invoices.id')
      .join('transactions', 'invoices.transaction_id', 'transactions.id')
      .orderBy('invoices.created_at', 'desc')
    const searchColumns: any[] = []
    await ControllersUtils.applyAllQueryUtils(invoiceQuery, from, to, filters, null, searchColumns, null, 'invoices')
    return invoiceQuery.preload('transaction').preload('courses', (courseQuery) => {
      courseQuery.preload('classroom')
    })
  }

  /**
   * get course with his classroom
   * @param field
   * @param value
   * @returns
   */
  public async getCourse(field: string, value: any) {
    return Course.query().preload('classroom').where(field, value).first()
  }

  /**
   *
   * @param user
   * @returns
   */
  public async getParentStudentProfile(user: User) {
    let analytics = {
      completed: 0,
      in_progress: 0,
      notStarted: 0,
      expired: 0,
      inComplete: 0,
      failed: 0,
    }
    const enrolledClassroom = await EnrollClassroom.query()
      .where('user_id', user.id)
      .preload('classroom', (classroomQuery) => {
        classroomQuery
          .preload('courses', (courseQuery) => {
            courseQuery.preload('students', (studentQuery) => {
              studentQuery.where('enroll_courses.user_id', user.id)
            })
          })
          .preload('instructor', (instructorQuery) => {
            instructorQuery.preload('user')
          })
          .preload('category')
          .preload('educationYears')
      })
    return {
      enrolledClassroom,
      analytics,
    }
  }

  /**
   *
   * @param userId
   * @param requestBody
   * @returns
   */
  public async getWalletHistory(userId: number, requestBody: any) {
    const { filters, from, to, sortBy, page, perPage, query } = requestBody
    const walletHistoryQuery = WalletLog.query().where('user_id', userId)
    const searchColumns: any[] = []
    await ControllersUtils.applyAllQueryUtils(walletHistoryQuery, from, to, filters, sortBy, searchColumns, query, 'wallet_logs')
    return await walletHistoryQuery
      .preload('invoice', (query) => {
        query.preload('transaction')
      })
      .paginate(page, perPage)
  }

  /**
   *
   * @param userId
   * @param requestBody
   * @returns
   */
  public async getTimeline(userId: number, requestBody: any) {
    const { filters, from, to, sortBy, page, perPage, query } = requestBody
    const timelineQuery = TimeLineLog.query().where('user_id', userId)
    const searchColumns: any[] = []
    await ControllersUtils.applyAllQueryUtils(timelineQuery, from, to, filters, sortBy, searchColumns, query, 'timelines')
    return await timelineQuery.paginate(page, perPage)
  }
}
