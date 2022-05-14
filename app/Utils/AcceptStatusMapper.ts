export default class AcceptStatusMapper {
  static getStatus(callbackObject: any) {
    if (callbackObject.success) return 'paid'
    else if (callbackObject.pending) return 'pending'
    else {
      return 'unpaid'
    }
  }
}
