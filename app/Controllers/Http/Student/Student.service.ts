import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import Student from 'App/Models/Student'
import User from 'App/Models/User'
import Wallet from 'App/Models/Wallet'
import Utils from 'App/Utils/Utils'
import StudentRepository from './Student.repository'
import ConflictException from 'App/Exceptions/ConflictException'
import Hash from '@ioc:Adonis/Core/Hash'
import ValidationException from 'App/Exceptions/ValidationException'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import CustomException from 'App/Exceptions/CustomException'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Invoice from 'App/Models/Invoice'
import Classroom from 'App/Models/Classroom'
import Course from 'App/Models/Course'
import Env from '@ioc:Adonis/Core/Env'

export default class StudentService {
  private studentRepository: StudentRepository = new StudentRepository()

  /**
   *
   * @param id
   * @param data
   */
  public async updateUser(id: number, data: any) {
    await this.studentRepository.updateUser(id, data)
  }

  /**
   *
   * @param userData
   * @returns
   */
  public async createUser(userData: any): Promise<User> {
    userData.uuid = Utils.generateUUID()
    userData.username = Utils.generateUsername(userData.first_name, userData.last_name)
    return User.create(userData)
  }

  /**
   *
   * @param userData
   */
  public async createStudent(userData: any): Promise<User> {
    const newUser: User = await this.createUser(userData)
    const student: Student = await newUser.related('student').create({
      profile_complete: false,
    })
    await student.related('wallet').create({})
    return newUser
  }

  /**
   *
   * @param field
   * @param value
   * @returns
   */
  public async findByOrFail(field: string, value: string | number): Promise<User> {
    const user = await User.findBy(field, value)
    if (!user) throw new ResourceNotFoundException('User not found')
    return user
  }

  /**
   *
   * @param value
   * @returns
   */
  public async findByEmailOrPhoneOrFail(value: string): Promise<User> {
    const user = await this.studentRepository.findByEmailOrPhone(value)
    if (!user) throw new ResourceNotFoundException('User not found')
    return user
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getUserProfile(id: number): Promise<User> {
    let userProfile = await this.studentRepository.getUserProfile(id)
    if (!userProfile) throw new ResourceNotFoundException('User Not Found')
    userProfile.type = await this.studentRepository.getUserType(id)
    return userProfile
  }

  /**
   * Create student wallet if it doesn't exist
   * @param student
   * @returns
   */
  public async createStudentWallet(student: Student): Promise<Wallet | void> {
    await student.load('wallet')
    if (!student.wallet) {
      return student.related('wallet').create({})
    }
  }

  /**
   *
   * @param id
   * @param userObj
   */
  public async updateStudentProfile(id: number, userObj: any) {
    await this.studentRepository.updateStudentProfile(id, userObj)
  }

  /**
   *
   * @param authedUserId
   * @param userObj
   * @returns
   */
  public async completeProfile(authedUserId: number, userObj: any) {
    //check phone number unique
    if (
      userObj.student.parent1_phone === userObj.phone_number ||
      userObj.student.parent2_phone === userObj.phone_number ||
      userObj.student.parent1_phone === userObj.student.parent2_phone
    ) {
      throw new ConflictException('Duplicate phone number')
    }
    //update profile data
    await this.updateStudentProfile(authedUserId, userObj)
    await Student.query().where('user_id', authedUserId).update({ profile_complete: true })
  }
  /**
   * @param user
   * @param price
   */
  async isSufficient(user: User, price: number): Promise<Wallet> {
    let wallet = await user.related('wallet').query().first()
    if (!wallet) {
      wallet = await user.related('wallet').create({})
    }
    if (!(Number(wallet.amount) >= Number(price))) {
      throw new BadRequestException('Insufficient Wallet Amount')
    }
    return wallet
  }

  /**
   *
   * @param user
   * @param old_password
   * @param new_password
   * @param confirm_new_password
   */
  public async changePassword(user: User, old_password: string, new_password: string, confirm_new_password: string) {
    if (!(await Hash.verify(old_password, user.password))) throw new CustomException('Incorrect Password', 400)
    if (new_password !== confirm_new_password) throw new CustomException("Passwords doesn't match", 400)
    user.password = new_password
    await user.save()
  }

  /**
   * @param user
   * @param amount
   * @param invoice
   * @param reason
   * @param refund
   * @param system
   */
  async addToWallet(
    user: User,
    amount: number,
    invoice: Invoice | undefined = undefined,
    reason: string | undefined = undefined,
    refund: boolean = false,
    system: boolean = false
  ): Promise<void> {
    if (invoice && Number(amount) !== Number(invoice.price)) {
      throw new CustomException('Server Error', 500)
    }
    let wallet = await user.related('wallet').query().first()
    if (!wallet) {
      wallet = await user.related('wallet').create({})
    }
    const newAmount = wallet.amount + amount
    // add wallet log
    await user.related('walletLogs').create({
      old_amount: wallet.amount,
      amount: amount,
      new_amount: newAmount,
      description: reason,
      invoice_id: invoice ? invoice.id : undefined,
    })
    wallet.amount = newAmount
    await wallet.save()
    //add timeline log if not admin
    if (!system) await this.addRechargeTimelineLog(user, amount, refund)
  }

  /**
   *
   * @param userId
   * @param requestBody
   * @returns
   */
  public async getWalletHistory(userId: number, requestBody: any) {
    return await this.studentRepository.getWalletHistory(userId, requestBody)
  }

  /**
   * @param user
   * @param amount
   * @param invoice
   * @param reason
   */
  async deductFromWallet(
    user: User,
    amount: number,
    invoice: Invoice | undefined = undefined,
    reason: string | undefined = undefined
  ): Promise<void> {
    if (invoice && Number(amount) !== Number(invoice.price)) {
      throw new CustomException('Server Error', 500)
    }
    const wallet = await this.isSufficient(user, amount)
    const newAmount = wallet.amount - amount
    // add wallet log
    await user.related('walletLogs').create({
      old_amount: wallet.amount,
      amount: -amount,
      new_amount: newAmount,
      description: reason,
      invoice_id: invoice?.id,
    })
    wallet.amount = newAmount
    await wallet.save()
  }

  /**
   *
   * @param userId
   * @param requestBody
   * @returns
   */
  public async getTimeline(userId: number, requestBody: any) {
    return await this.studentRepository.getTimeline(userId, requestBody)
  }

  /**
   *
   * @param user
   * @param classroom
   * @param plan
   */
  async addSubscribeTimelineLog(user: User, classroom: Classroom, plan: string): Promise<void> {
    // add timeline log
    await user.related('timelineLogs').create({
      event: 'classroom subscription',
      tag: 'subscribe',
      description: `Classroom ${classroom.title} ${plan}ly subscription.`,
    })
  }

  /**
   *
   * @param userId
   * @param requestBody
   * @returns
   */
  public async getAllInvoices(userId: number, requestBody: any) {
    const { filters, from, to } = requestBody
    return await this.studentRepository.getAllInvoices(filters, from, to, userId)
  }

  /**
   * get all enrolled classrooms for the user when the classroom is active with its category and educationYears and the instructor of the classroom
   * @param userId
   * @returns
   */
  public async getEnrolledClassrooms(userId: number) {
    return await this.studentRepository.getEnrolledClassrooms(userId)
  }

  /**
   * @param user
   * @param classroom
   * @param plan
   */
  async addRenewTimelineLog(user: User, classroom: Classroom, plan: string): Promise<void> {
    // add timeline log
    await user.related('timelineLogs').create({
      event: 'subscription renewal',
      tag: 'renew',
      description: `Classroom ${classroom.title} ${plan}ly subscription renewal.`,
    })
  }

  /**
   *
   * @param parentPhone
   * @param username
   * @returns
   */
  public async findStudentForParentOrFail(parentPhone: string, username: string) {
    const user = await User.query().where('username', username).preload('student').first()
    if (!user) throw new ResourceNotFoundException('User not found')
    if (user.student.parent1_phone !== parentPhone && user.student.parent2_phone !== parentPhone) {
      throw new ResourceNotFoundException('Invalid parent phone')
    }
    return user
  }

  /**
   * @param user
   * @param classroom
   * @param plan
   */
  async addCancelTimelineLog(user: User, classroom: Classroom, plan: string): Promise<void> {
    // add timeline log
    await user.related('timelineLogs').create({
      event: 'subscription cancellation',
      tag: 'cancel',
      description: `Classroom ${classroom.title} ${plan}ly subscription cancellation.`,
    })
  }

  /**
   *
   * @param user
   */
  public async uploadProfilePic(user: User) {
    const ctx = HttpContext.get()!
    let now = Date.now()
    const image = ctx.request.file('photo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif'],
    })
    if (!image) {
      throw new ResourceNotFoundException('The image does not exist')
    }
    await this.validateProfilePic(image)
    try {
      const path = `${user.first_name}${user.last_name}${user.id}${now}.${image.extname}`
      await image.moveToDisk(
        `profilepictures/students`,
        {
          name: path,
          visibility: 'public',
        },
        's3'
      )
      const imagePath = `${Env.get('S3_ENDPOINT')}/${Env.get('S3_BUCKET')}/profilepictures/students/${path}`
      await user.merge({ profile_photo: imagePath }).save()
    } catch (error) {
      throw new ValidationException('file upload failed: ' + error.message)
    }
  }

  /**
   *@params file
   */
  async validateProfilePic(file: any) {
    if (file.type !== 'image') {
      throw 'File must be of type image'
    }
    if (!['jpeg', 'jpg', 'png'].includes(file.subtype)) {
      throw 'File extension must be jpeg , jpg or png'
    }
    if (file.size > 2 * 1000000) {
      throw `${file.clientName}'s size exceeded limit`
    }
  }

  /**
   * @param user
   * @param course
   */
  async addPurchaseTimelineLog(user: User, course: Course): Promise<void> {
    // add timeline log
    await user.related('timelineLogs').create({
      event: 'wallet course purchase',
      tag: 'purchase',
      description: `Purchase course ${course.name}.`,
    })
  }

  /**
   *
   * @param field
   * @param course_id
   * @returns
   */
  public async getProgressInCourse(field: string, course_id: number, username: string) {
    console.log(username)
    return await this.studentRepository.getCourse(field, course_id)
  }

  /**
   * @param user
   * @param course
   * @param code
   */
  async addScratchcardTimelineLog(user: User, course: Course, code: string): Promise<void> {
    // add timeline log
    await user.related('timelineLogs').create({
      event: 'code course purchase',
      tag: 'code',
      description: `Purchase course ${course.name} with code ${code}.`,
    })
  }

  /**
   *
   * @param user
   * @returns
   */
  public async getParentStudentProfile(user: User) {
    return await this.studentRepository.getParentStudentProfile(user)
  }

  /**
   * @param user
   * @param amount
   * @param refund
   */
  async addRechargeTimelineLog(user: User, amount: number, refund: boolean = false): Promise<void> {
    // add timeline log
    if (refund) {
      await user.related('timelineLogs').create({
        event: 'wallet refund',
        tag: 'refund',
        description: `Wallet refund with ${amount} EGP.`,
      })
    } else {
      await user.related('timelineLogs').create({
        event: 'wallet recharge',
        tag: 'recharge',
        description: `Wallet recharge with ${amount} EGP.`,
      })
    }
  }
}
