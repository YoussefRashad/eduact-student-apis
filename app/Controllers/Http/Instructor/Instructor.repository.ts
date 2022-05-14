import Instructor from 'App/Models/Instructor'
import Student from 'App/Models/Student'
import { ModelQueryBuilder } from '@adonisjs/lucid/build/src/Orm/QueryBuilder'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import User from 'App/Models/User'
import { RelationSubQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import _ from 'lodash'
import InstructorCode from 'App/Models/InstructorCode'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class InstructorRepository {
  /**
   * Count instructors
   */
  public async instructorCount() {
    return Instructor.query().count('*')
  }

  /**
   *
   * @param student
   */
  public async fetch(student: Student) {
    const instructors = await User.query()
      .whereHas('instructor', (query) => {
        this.filterUserInstructors(query, student)
        query.where('is_active', true)
      })
      .preload('instructor')
    return _.orderBy(instructors, 'instructor.weight')
  }

  /**
   * Filter instructor for students by education info
   * @param query
   * @param student
   */
  public filterUserInstructors(query: ModelQueryBuilder | RelationSubQueryBuilderContract<typeof Instructor>, student: Student) {
    if (student) {
      if (student.education_type_id) {
        query.whereHas('educationType', (q: ModelQueryBuilder) => {
          q.where('education_type_id', student.education_type_id)
        })
      }
      if (student.education_language_id) {
        query.whereHas('educationLanguage', (q: ModelQueryBuilder) => {
          q.where('education_language_id', student.education_language_id)
        })
      }
      if (student.education_section_id) {
        query.whereHas('educationSection', (q: ModelQueryBuilder) => {
          q.where('education_section_id', student.education_section_id)
        })
      }
      if (student.education_year_id) {
        query.whereHas('educationYear', (q: ModelQueryBuilder) => {
          q.where('education_year_id', student.education_year_id)
        })
      }
    }
  }

  /**
   *
   * @param label
   */
  public async getFullInstructorProfileOrFail(label: string): Promise<Instructor> {
    const instructor = await Instructor.query()
      .preload('educationTypes')
      .preload('educationLanguages')
      .preload('educationYears')
      .preload('educationSections')
      .preload('user')
      .preload('onlineClassrooms', (builder) => {
        builder.where('classrooms.active', true).orderBy('weight', 'asc')
        builder.preload('instructor', (builder) => {
          builder.preload('user')
        })
        builder.preload('category')
        builder.preload('courses')
        builder.preload('educationYears')
        builder.preload('courses')
      })
      .preload('centerClassrooms', (builder) => {
        builder.where('classrooms.active', true).orderBy('weight', 'asc')
        builder.preload('instructor', (builder) => {
          builder.preload('user')
        })
        builder.preload('category')
        builder.preload('courses')
        builder.preload('educationYears')
        builder.preload('courses')
      })
      .where('label', label)
      .first()
    if (!instructor) throw new ResourceNotFoundException('Instructor Not Found')
    return instructor
  }

  /**
   *
   * @param code
   * @param instructorId
   */
  public async getInstructorCodeOrFail(code: string, instructorId: number) {
    const instructorCode = await InstructorCode.query().where('code', code).where('instructor_id', instructorId).first()
    if (!instructorCode) {
      throw new BadRequestException('Invalid Code')
    }
    return instructorCode
  }

  /**
   *
   * @param instructorCode
   * @param data
   */
  public async updateInstructorCode(instructorCode: InstructorCode, data: Partial<InstructorCode>) {
    instructorCode.merge(data)
    await instructorCode.save()
  }
}
