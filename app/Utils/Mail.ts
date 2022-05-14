import aws from 'aws-sdk'
import Env from '@ioc:Adonis/Core/Env'
import CustomException from 'App/Exceptions/CustomException'
import BlockedEmail from 'App/Models/BlockedEmail'
import Codes from 'App/Constants/Codes'
import HttpClient from './HttpClient'

export class Mail {
  /**
   * Sending Email through SES and work mail aws
   * @param email
   * @param subject
   * @param content
   */
  static async sendEmail(email: string, subject: string, content: string) {
    aws.config.update({
      accessKeyId: Env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY'),
      region: Env.get('AWS_REGION'),
    })

    // Create sendEmail params
    var params = {
      Destination: {
        /* required */
        ToAddresses: [
          email,
          // email
          /* more items */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: content,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'no-reply@eduact.me',
      /* required */
      ReplyToAddresses: [
        'no-reply@eduact.me',
        /* more items */
      ],
    }

    // Create the promise and SES service object
    var sendPromise = new aws.SES({
      apiVersion: '2010-12-01',
    })
      .sendEmail(params)
      .promise()

    // return sendPromise;

    // Handle promise's fulfilled/rejected states
    sendPromise
      .then(function (data) {
        console.log('Mailer: ', data)
        return data
      })
      .catch(function (err) {
        console.log('Mailer: ', err)
        return err
      })
  }

  /**
   * Check if this is a valid mailbox using debounce service
   * @param email
   */
  static async isValidEmail(email: string) {
    let res = null
    try {
      res = await HttpClient.get('https://api.debounce.io/v1/', {
        api: Env.get('DEBOUNCE_API_KEY'),
        email: email,
      })
    } catch (e: any) {
      await this.sendEmail('youssef.nabil.mustafa@gmail.com', 'Debounce email error', e)
      throw new CustomException('Service Unavailable', 502)
    }
    if (Number(res.data.balance) < 1000) {
      await this.sendEmail('youssef.nabil.mustafa@gmail.com', 'Debounce email validation Quota warning', 'Quota < 1000')
    }
    if (Number(res.data.debounce.code) !== 5) {
      await BlockedEmail.create({
        email: email,
      })
      throw new CustomException("This email doesn't even exist!", Codes.Error.Http.BAD_REQUEST)
    }
  }
}
