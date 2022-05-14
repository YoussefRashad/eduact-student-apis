import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Classroom from 'App/Models/Classroom'
import Course from 'App/Models/Course'
import Student from 'App/Models/Student'
import Utils from 'App/Utils/Utils'

export default class ClassroomRepository {
  public async classroomCount() {
    return Classroom.query().count('*')
  }

  /**
   *
   * @returns
   */
  public fetch() {
    let query = Classroom.query()
      .preload('instructor', (query) => {
        query.preload('user')
      })
      .preload('category')
      .preload('educationYears')
      .where('type', 'online')
    return query
  }

  /**
   * filter user by eduaction info
   * @param query
   * @param student
   */
  public filterUserClassrooms(query: ModelQueryBuilderContract<typeof Classroom>, student: Student) {
    if (student.education_type_id) {
      query.whereHas('educationTypes', (q) => {
        q.where('education_type_id', student.education_type_id)
      })
    }
    if (student.education_language_id) {
      query.whereHas('educationLanguages', (q) => {
        q.where('education_language_id', student.education_language_id)
      })
    }
    if (student.education_section_id) {
      query.whereHas('educationSections', (q) => {
        q.where('education_section_id', student.education_section_id)
      })
    }
    if (student.education_year_id) {
      query.whereHas('educationYears', (q) => {
        q.where('education_year_id', student.education_year_id)
      })
    }
  }

  /**
   *
   * @param query
   * @param student
   */
  public isStudentEnrolled(query: ModelQueryBuilderContract<typeof Classroom>, student: Student) {
    query.preload('enrolled', (usersQuery) => {
      usersQuery.where('students.user_id', student.user_id).select(['*', 'enroll_classrooms.active as active'])
    })
    query.preload('admissionResponse', (responseQuery) => {
      responseQuery.where('student_id', student.user_id)
    })
  }

  /**
   *
   * @param query
   */
  public filterActiveAndOrderClassrooms(query: ModelQueryBuilderContract<typeof Classroom>) {
    query.where('active', true).orderBy('weight', 'asc')
  }

  /**
   *
   * @param query
   * @param category_name
   */
  public filterCategoryByName(query: ModelQueryBuilderContract<typeof Classroom>, category_name: string) {
    query.whereHas('category', (builder) => {
      builder.where('name', Utils.capitalizeWord(category_name))
    })
  }

  /**
   *
   * @param query
   * @param label
   * @param student
   */
  public getClassroomByLabel(query: ModelQueryBuilderContract<typeof Classroom>, label: string, student: Student) {
    query
      .preload('instructor', (query) => query.preload('user'))
      .preload('category')
      .preload('tabs', (tabsQuery) => {
        tabsQuery.orderBy('order')
        tabsQuery.preload('sections', (sectionsQuery) => {
          sectionsQuery.orderBy('order')
          sectionsQuery.preload('courses', (coursesQuery) => {
            coursesQuery.orderBy('order')
            coursesQuery.preload('units', (unitsQuery) => {
              unitsQuery.orderBy('order')
            })
            coursesQuery.preload('prerequisites')
            coursesQuery.where('active', true)
            if (student) {
              coursesQuery.preload('students', (enrolledQuery) => {
                enrolledQuery.where('enroll_courses.user_id', student.user_id)
              })
            }
          })
        })
      })
      .preload('educationYears')
      .where('label', label)
  }

  /**
   * get current course, number of courses and number of active courses
   * @param classroom
   * @returns
   */
  public async classroomCoursesCount(classroom: Classroom) {
    const course = await Course.query().where('id', classroom.current_course).first()
    const courses_count = (await Course.query().where('classroom_id', classroom.id).count('*'))[0].$extras.count
    const active_courses_count = (await Course.query().where('classroom_id', classroom.id).where('active', true).count('*'))[0].$extras.count
    return {
      current_course: course,
      courses_count,
      active_courses_count,
    }
  }

  /**
   * get user's enrolled courses
   * @param user_id
   * @returns
   */
  public async getEnrolledCourses(user_id: number) {
    return Course.query().whereHas('students', (studentQuery) => {
      studentQuery.where('students.user_id', user_id)
    })
  }

  /**
   *
   * @param searchKey
   * @returns
   */
  public async search(searchKey: string) {
    return Classroom.query()
      .preload('instructor', (query) => query.preload('user'))
      .preload('category')
      .select('*')
      .select('classrooms.id')
      .select('users.id as user_id')
      .select('instructors.user_id as instructor_id')
      .innerJoin('users', 'classrooms.instructor_id', 'users.id')
      .innerJoin('instructors', 'classrooms.instructor_id', 'instructors.user_id')
      .where('classrooms.title', 'ILIKE', '%' + searchKey + '%')
      .orWhere('classrooms.description', 'ILIKE', '%' + searchKey + '%')
      .orWhere('users.first_name', 'ILIKE', '%' + searchKey + '%')
      .orWhere('users.last_name', 'ILIKE', '%' + searchKey + '%')
      .where('active', true)
      .where('type', 'online')
      .orderBy('classrooms.weight', 'asc')
  }

  /**
   * get user's enrolled courses in classroom
   * @param classroom_id
   * @param user_id
   * @returns
   */
  public async getEnrolledCoursesByClassroomId(classroom_id: number, user_id: number) {
    return Course.query()
      .where('classroom_id', classroom_id)
      .whereHas('students', (query) => {
        query.where('students.user_id', user_id)
      })
  }
}
