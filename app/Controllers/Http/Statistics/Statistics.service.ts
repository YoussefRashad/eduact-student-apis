import ClassroomRepository from '../Classroom/Classroom.repository'
import InstructorRepository from '../Instructor/Instructor.repository'
import SettingsRepository from '../Settings/Settings.repository'

export default class StatisticsService {
  classroomRepository = new ClassroomRepository()
  instructorRepository = new InstructorRepository()
  settingsRepository = new SettingsRepository()

  /**
   * get site statistics from instructor, classroom and enrolled classroom
   * @returns classrooms, enrolled courses and instructors count
   */
  public async siteStatistics() {
    const classroomsCount = await this.classroomRepository.classroomCount()
    const instructorCount = await this.instructorRepository.instructorCount()
    const enrolledCount = await this.settingsRepository.enrollCourseCount()
    return {
      classrooms: classroomsCount[0].$extras.count,
      instructors: instructorCount[0].$extras.count,
      enrollments: enrolledCount[0].$extras.count,
    }
  }
}
