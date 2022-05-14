import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Http from 'App/Utils/Http'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import CheckoutService from 'App/Controllers/Http/Payment/Checkout/Checkout.service'

export default class CheckoutController {
  private checkoutService = new CheckoutService()

  /**
   *
   * @param request
   */
  async checkoutSingleCourse({ request }: HttpContextContract) {
    const paymentMethod = request.input('payment_method')
    const course = await this.checkoutService.getCourseByIdOrFail(request.input('course_id'))
    await this.checkoutService.isCourseExpired(course)
    const classroom = await course.classroom
    await this.checkoutService.isCourseBuyableOrFail(request.user, course, classroom)
    await this.checkoutService.hasPassedAdmission(classroom, request.user.id)
    await this.checkoutService.checkCoursePrerequisites(request.user, course)
    if (course.price === 0) {
      await this.checkoutService.enrollFreeCourse(request.user, course, classroom)
      return Http.respond({ message: 'Enrolled Successfully' })
    }
    let message = ''
    switch (paymentMethod) {
      case 'wallet':
        if (course.payment_methods_allowed !== '*' && course.payment_methods_allowed !== 'wallet') {
          throw new ForbiddenException('Invalid method')
        }
        await this.checkoutService.buyCourse(request.user, course, classroom)
        message = 'Purchased Successfully'
        break
      case 'scratchCard':
        if (course.payment_methods_allowed !== '*' && course.payment_methods_allowed !== 'scratchcard') {
          throw new ForbiddenException('Invalid method')
        }
        await this.checkoutService.enrollWithScratchcard(request.user, request.input('code'), course, classroom)
        message = 'Enrolled Successfully'
        break
      default:
        throw new ForbiddenException('Invalid method')
    }
    await this.checkoutService.incrementClassroomEnrolledCount(classroom)
    return Http.respond({ message: message })
  }
}
