export default class FawryMessageMapper {
  static obj: {
    NEW: string
    PAID: string
    CANCELED: string
    DELIVERED: string
    REFUNDED: string
    EXPIRED: string
  }
  static map(status: any) {
    this.obj = {
      NEW: 'Request placed and awaiting payment',
      PAID: 'Payment Process Successful',
      CANCELED: 'Request Canceled',
      DELIVERED: 'Order Delivered',
      REFUNDED: 'Order Refunded',
      EXPIRED: 'Request Expired',
    }
    // @ts-ignore
    return this.obj[status]
  }
}

module.exports = FawryMessageMapper
