export default class FawryStatusMapper {
  static obj: {
    NEW: string
    UNPAID: string
    PAID: string
    CANCELED: string
    DELIVERED: string
    REFUNDED: string
    EXPIRED: string
    FAILED: string
  }
  static map(status: string) {
    this.obj = {
      NEW: 'pending',
      UNPAID: 'unpaid',
      PAID: 'paid',
      CANCELED: 'canceled',
      DELIVERED: 'delivered',
      REFUNDED: 'refunded',
      EXPIRED: 'expired',
      FAILED: 'failed',
    }
    // @ts-ignore
    return this.obj[status]
  }
}

module.exports = FawryStatusMapper
