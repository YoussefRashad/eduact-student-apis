declare module '@ioc:Payment/AcceptOnline' {
  import AcceptOnline from 'app/lib/Payment/Accept/AcceptOnline'
  const acceptOnline: AcceptOnline
  export default acceptOnline
}

declare module '@ioc:Payment/AcceptKiosk' {
  import AcceptKiosk from 'app/lib/Payment/Accept/AcceptKiosk'
  const acceptKiosk: AcceptKiosk
  export default acceptKiosk
}

declare module '@ioc:Payment/AcceptEwallet' {
  import AcceptEwallet from 'app/lib/Payment/Accept/AcceptEwallet'
  const acceptEwallet: AcceptEwallet
  export default acceptEwallet
}

declare module '@ioc:Payment/AcceptCash' {
  import AcceptCash from 'app/lib/Payment/Accept/AcceptCash'
  const acceptCash: AcceptCash
  export default acceptCash
}
