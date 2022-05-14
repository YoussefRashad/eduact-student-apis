import EnrollCourse from 'App/Models/EnrollCourse'

export default class SettingsRepository {
  public async enrollCourseCount() {
    return EnrollCourse.query().count('*')
  }
}
