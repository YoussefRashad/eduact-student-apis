import HttpClient from './HttpClient'
import Env from '@ioc:Adonis/Core/Env'
import _ from 'lodash'

export class SMS {
  static async sendSMS(mobile: Array<string>, message: string, language: string = '1') {
    mobile = _.map(mobile, (m: string) => {
      return '2' + m
    })
    return HttpClient.post('https://smsmisr.com/api/webapi/', null, {
      username: Env.get('SMS_USERNAME'),
      password: Env.get('SMS_PASSWORD'),
      language: language,
      sender: Env.get('SMS_SENDER_ID'),
      mobile: mobile.toString(),
      message: encodeURI(message),
    })
    // https://smsmisr.com/api/webapi/?username=XXX&password=XXX&language=1&sender=XXX&mobile=2012XXXXXXX,2012XXX XXXX,&message=XXX
  }
}
