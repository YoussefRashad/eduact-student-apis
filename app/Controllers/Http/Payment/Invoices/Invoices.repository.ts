import Invoice from 'App/Models/Invoice'
import Transaction from 'App/Models/Transaction'

export default class InvoicesRepository {
  /**
   *
   * @param invoice
   */
  async create(invoice: Invoice): Promise<Invoice> {
    return Invoice.create(invoice)
  }

  /**
   *
   * @param attribute
   * @param value
   */
  async findBy(attribute: string, value: any) {
    return Invoice.findBy(attribute, value)
  }

  /**
   *
   * @param id
   * @param data
   */
  async updateById(id: number, data: any) {
    return Invoice.query().where('id', id).update(data)
  }

  /**
   *
   * @param referenceNumber
   * @param data
   */
  async updateByReference(referenceNumber: string, data: any) {
    return Invoice.query().where('invoice_ref', referenceNumber).update(data)
  }

  /**
   *
   * @param refNumber
   */
  async delete(refNumber: string) {
    return Invoice.query().where('invoice_ref', refNumber).delete()
  }

  /**
   *
   * @param transaction
   * @param userId
   * @param type
   * @param status
   */
  async createWalletInvoice(transaction: Transaction, userId: number, type: string, status: string = 'paid'): Promise<Invoice> {
    return Invoice.create({
      transaction_id: transaction.id,
      user_id: userId,
      invoice_ref: transaction.transaction_ref,
      total_price: transaction.amount,
      price: transaction.amount,
      tax: 0,
      type: type,
      status: status,
    })
  }

  /**
   *
   * @param transaction
   * @param userId
   * @param status
   * @param price
   * @param tax
   */
  async createRechargeInvoice(transaction: Transaction, userId: number, status: string, price: number, tax: number) {
    return Invoice.create({
      transaction_id: transaction.id,
      user_id: userId,
      invoice_ref: transaction.transaction_ref,
      total_price: transaction.amount,
      price: price,
      tax: tax,
      type: 'recharge',
      status: status,
    })
  }
}
