class OpayStatusMapper {
  static getStatus(callbackObject: any): any {
    if (callbackObject.status === 'SUCCESS') return 'paid'
    else if (callbackObject.status === 'FAIL') return 'failed'
  }
}
