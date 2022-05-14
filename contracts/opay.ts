declare module '@ioc:Payment/Opay' {
  import OpayPayment from 'app/lib/Payment/Opay/OpayPayment'
  const opayPayment: OpayPayment
  export default opayPayment
}
