/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  //App keys
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_URL: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  //Database connection keys
  DB_CONNECTION: Env.schema.string(),
  DB_CONNECTION_STRING: Env.schema.string(),
  DB_DEBUG: Env.schema.string(),
  //Sms Misr provider Keys
  SMS_USERNAME: Env.schema.string(),
  SMS_PASSWORD: Env.schema.string(),
  SMS_SENDER_ID: Env.schema.string(),
  //Aws mailer access keys
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  //Whatsapp provider Keys
  WHATSAPP_TOKEN: Env.schema.string(),
  WHATSAPP_INSTANCE_ID: Env.schema.string(),
  //Accept payment provider Keys
  ACCEPT_API_KEY: Env.schema.string(),
  ACCEPT_PAYMENT_INTEGRATION_CARD_ID: Env.schema.string(),
  ACCEPT_PAYMENT_INTEGRATION_KIOSK_ID: Env.schema.string(),
  ACCEPT_PAYMENT_INTEGRATION_CASH_ID: Env.schema.string(),
  ACCEPT_PAYMENT_INTEGRATION_WALLET_ID: Env.schema.string(),
  ACCEPT_HMAC_SECRET: Env.schema.string(),
  //Fawry Keys
  MERCHANT_CODE: Env.schema.string(),
  FPAY_SECURITY_CODE: Env.schema.string(),
  //Files bucket Keys
  S3_KEY: Env.schema.string(),
  S3_SECRET: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),
  S3_REGION: Env.schema.string(),
  S3_ENDPOINT: Env.schema.string.optional(),
  //Opay Payment Keys
  OPAY_BASE_URL: Env.schema.string(),
  OPAY_PUBLIC_KEY: Env.schema.string(),
  OPAY_MERCHANT_ID: Env.schema.string(),
  //Enviroment Url keys
  FRONTEND_URL: Env.schema.string(),
  BACKEND_URL: Env.schema.string(),
})
