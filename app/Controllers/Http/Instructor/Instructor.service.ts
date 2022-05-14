import InstructorRepository from 'App/Controllers/Http/Instructor/Instructor.repository'
import Student from 'App/Models/Student'
import ConflictException from 'App/Exceptions/ConflictException'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import Instructor from 'App/Models/Instructor'

export default class InstructorService {
  private instructorRepository = new InstructorRepository()

  /**
   *
   * @param student
   */
  public async fetch(student: Student) {
    return this.instructorRepository.fetch(student)
  }

  /**
   *
   * @param label
   */
  public async get(label: string) {
    return this.instructorRepository.getFullInstructorProfileOrFail(label)
  }

  /**
   *
   * @param instructorId
   * @param code
   */
  public async apply(code: string, instructorId: number) {
    const ctx = HttpContext.get()!
    const instructorCode = await this.instructorRepository.getInstructorCodeOrFail(code, instructorId)
    const student = await ctx.request.user.related('student').query().first()
    if (instructorCode.studentId === student?.user_id) {
      throw new ConflictException('This code already used by you')
    }
    if (instructorCode.studentId) {
      throw new ConflictException('This code is used by another student')
    }
    await this.instructorRepository.updateInstructorCode(instructorCode, { studentId: ctx.request.user.id })
    const instructor = await Instructor.find(instructorId)
    const centerClassrooms = await instructor?.related('centerClassrooms').query()
    if (centerClassrooms) await student?.related('classrooms').attach(centerClassrooms.map((e) => e.id))
  }
}
