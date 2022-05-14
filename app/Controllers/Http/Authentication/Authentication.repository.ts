import Verification from 'App/Models/Verification'
import Utils from 'App/Utils/Utils'

export default class AuthenticationRepository {
  /**
   *
   * @param token
   * @param type
   */
  public async getNonExpiredVerificationByToken(token: string, type: string) {
    return Verification.query()
      .where('token', token)
      .where('type', type)
      .where('expires_on', '>', await Utils.now())
      .first()
  }

  /**
   *
   * @param token
   */
  public async deleteVerificationToken(token: string): Promise<void> {
    await Verification.query().where('token', token).delete()
  }
}
