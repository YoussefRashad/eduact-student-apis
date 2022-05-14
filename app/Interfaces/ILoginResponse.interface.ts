import User from 'App/Models/User'
export default interface ILoginResponse {
  user: User
  type: Array<string>
  token: string
}
