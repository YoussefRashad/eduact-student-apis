//@ts-ignore
import { BaseTask } from 'adonis5-scheduler/build'
import EnrollCourse from 'App/Models/EnrollCourse'
import { DateTime } from 'luxon'

export default class ExpireEnrollCourse extends BaseTask {
  public static get schedule() {
    return '0 */30 * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    await EnrollCourse.query().where('expire_at', '<', DateTime.now().toISO()).update('expired', true)
  }
}
