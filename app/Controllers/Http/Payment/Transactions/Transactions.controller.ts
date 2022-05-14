import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import Http from 'App/Utils/Http'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import AcceptStatusMapper from 'App/Utils/AcceptStatusMapper'
import StudentService from 'App/Controllers/Http/Student/Student.service'
import TransactionsRepository from 'App/Controllers/Http/Payment/Transactions/Transactions.repository'
import FawryStatusMapper from 'App/Utils/FawryStatusMapper'

export default class TransactionsController {
  private studentService = new StudentService()
  private transactionRepository = new TransactionsRepository()

  /**
   *
   * @param request
   */
  async fawryServerCallback({ request }: HttpContextContract) {
    let object = request.all()
    let transaction = await this.transactionRepository.findBy('provider_ref', object.FawryRefNo)
    if (!transaction) {
      transaction = await this.transactionRepository.findBy('transaction_ref', object.MerchantRefNo)
      if (!transaction) {
        throw new ResourceNotFoundException('Transaction Not Found with transaction ref:' + object.MerchantRefNo)
      }
    }
    await transaction.load('invoice')
    const invoice = transaction.invoice
    if (String(invoice.status) === String('paid')) {
      return Http.respond({ message: 'Invoice status updated' })
    }
    let user = await this.studentService.findByOrFail('id', invoice.user_id)
    if (Number(object.Amount) !== Number(transaction.amount)) {
      throw new BadRequestException("Amount doesn't match the required amount to be paid")
    }
    transaction.status = FawryStatusMapper.map(object.OrderStatus)
    transaction.provider_ref = object.FawryRefNo
    await transaction.save()
    invoice.status = FawryStatusMapper.map(object.OrderStatus)
    await invoice.save()
    if (String(object.OrderStatus) === String('PAID')) {
      await this.studentService.addToWallet(user, invoice.price, invoice, 'Recharge using Fawry')
    }
    return Http.respond({ message: 'Invoice status updated' })
  }

  /**
   * Alias: AcceptTransactionNotification
   * @param request
   */
  public async acceptServerCallback({ request }: HttpContextContract) {
    const data = request.body().obj
    let transaction = await this.transactionRepository.findBy('provider_ref', data.order.id)
    if (!transaction) {
      transaction = await this.transactionRepository.findBy('transaction_ref', data.order.merchant_order_id)
      if (!transaction) {
        throw new ResourceNotFoundException(`'Transaction Not found with transaction ref:' ${data.order.merchant_order_id}`)
      }
    }
    await transaction.load('invoice')
    const invoice = await transaction.invoice
    if (String(invoice.status) === String('paid')) {
      return Http.respond({ message: 'Invoice status updated' })
    }
    let user = await this.studentService.findByOrFail('id', invoice.user_id)
    if (Number(data.amount_cents / 100) !== Number(transaction.amount)) {
      throw new BadRequestException("Amount doesn't match the required amount to be paid")
    }
    transaction.status = AcceptStatusMapper.getStatus(data)
    transaction.provider_ref = data.order.id
    await transaction.save()
    invoice.status = AcceptStatusMapper.getStatus(data)
    await invoice.save()
    if (data.success) {
      await this.studentService.addToWallet(user, invoice.price, invoice, 'Recharge using Accept')
    }
    return Http.respond({ message: 'Invoice status updated' })
  }

  /**
   *
   * @param request
   * @constructor
   */
  public async OpayServerCallback({ request }: HttpContextContract) {
    const data = request.body().payload
    let transaction = await this.transactionRepository.findBy('transaction_ref', data.reference)
    if (!transaction) {
      throw new ResourceNotFoundException(`'Transaction Not found with transaction ref:' ${data.reference}`)
    }
    await transaction.load('invoice')
    const invoice = await transaction.invoice
    if (String(invoice.status) === String('paid')) {
      return Http.respond({ message: 'Invoice status updated' })
    }
    let user = await this.studentService.findByOrFail('id', invoice.user_id)
    if (Number(data.amount) !== Number(invoice.price + '00')) {
      throw new BadRequestException("Amount doesn't match the required amount to be paid")
    }
    let orderStatus: string = OpayStatusMapper.getStatus(data)
    transaction.status = orderStatus
    await transaction.save()
    invoice.status = orderStatus
    await invoice.save()
    if (orderStatus === 'paid') {
      await this.studentService.addToWallet(user, invoice.price, invoice, 'Recharge using Opay')
    }
    return Http.respond({ message: 'Invoice status updated' })
  }
}
