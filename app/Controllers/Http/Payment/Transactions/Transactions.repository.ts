import Transaction from 'App/Models/Transaction'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import Utils from 'App/Utils/Utils'

export default class TransactionsRepository {
  /**
   *
   * @param transaction
   */
  public async create(transaction: Transaction) {
    return Transaction.create(transaction)
  }

  /**
   *
   * @param attribute
   * @param value
   */
  public async findBy(attribute: string, value: any) {
    return Transaction.findBy(attribute, value)
  }

  /**
   *
   * @param id
   * @param data
   */
  public async updateById(id: number, data: any) {
    let trx = await this.findBy('id', id)
    if (!trx) throw new ResourceNotFoundException('Transaction not found')
    return Transaction.query().where('id', id).update(data)
  }

  /**
   *
   * @param referenceNumber
   * @param data
   */
  public async updateByReference(referenceNumber: string, data: any) {
    return Transaction.query().where('transaction_ref', referenceNumber).update(data)
  }

  /**
   *
   * @param refNumber
   */
  public async delete(refNumber: string) {
    return Transaction.query().where('transaction_ref', refNumber).delete()
  }

  /**
   *
   * @param amount
   * @param status
   */
  public async createWalletTransaction(amount: number, status: string = 'paid') {
    return Transaction.create({
      transaction_ref: 'w-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: 'WALLET',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }

  /**
   *
   * @param amount
   * @param status
   */
  public async createFawryRechargeTransaction(amount: number, status: string) {
    return Transaction.create({
      transaction_ref: 'r-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: 'PAYATFAWRY',
      provider: 'fawry',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }

  /**
   *
   * @param amount
   * @param status
   */
  public async createAcceptCardTransaction(amount: number, status: string) {
    return Transaction.create({
      transaction_ref: 'r-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: 'CARD',
      provider: 'accept',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }

  /**
   *
   * @param amount
   * @param status
   * @param method
   */
  public async createAcceptKioskTransaction(amount: number, status: string, method: string | undefined) {
    return Transaction.create({
      transaction_ref: 'r-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: method,
      provider: 'accept',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }

  /**
   *
   * @param amount
   * @param status
   */
  public async createAcceptEwalletTransaction(amount: number, status: string) {
    return Transaction.create({
      transaction_ref: 'r-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: 'EWALLET',
      provider: 'accept',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }

  /**
   *
   * @param amount
   * @param status
   */
  public async createOpayTransaction(amount: number, status: string) {
    return Transaction.create({
      transaction_ref: 'r-' + (await Utils.generateInvoiceReference()),
      status: status,
      method: 'CARD',
      provider: 'opay',
      amount: amount,
      expiryDate: Utils.expiryTime(0),
    })
  }
}
