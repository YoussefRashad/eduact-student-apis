export default {
  Users: [
    {
      email_verified: [
        { name: 'true', value: true },
        { name: 'false', value: false },
      ],
    },
    {
      profile_complete: [
        { name: 'true', value: true },
        { name: 'false', value: false },
      ],
    },
    {
      gender: [
        { name: 'male', value: 'male' },
        { name: 'female', value: 'female' },
      ],
    },
    {
      education_type: [
        { name: 'National', value: 'National' },
        { name: 'IGCSE', value: 'IGCSE' },
        { name: 'American', value: 'American' },
      ],
    },
    {
      education_language: [
        { name: 'National English', value: 'National English' },
        { name: 'National Arabic', value: 'National Arabic' },
      ],
    },
    {
      education_section: [
        { name: 'Science', value: 'Science' },
        { name: 'Mathematics', value: 'Mathematics' },
        { name: 'Literature', value: 'Literature' },
      ],
    },
    {
      education_year: [
        { name: 'First Secondary', value: 'First Secondary' },
        { name: 'Second Secondary', value: 'Second Secondary' },
        { name: 'Third Secondary', value: 'Third Secondary' },
      ],
    },
  ],
  Admins: [
    {
      type: [
        { name: 'admin', value: 'admin' },
        { name: 'super admin', value: 'super' },
      ],
    },
  ],
  Instructors: [
    {
      email_verified: [
        { name: 'true', value: true },
        { name: 'false', value: false },
      ],
    },
    {
      gender: [
        { name: 'male', value: 'male' },
        { name: 'female', value: 'female' },
      ],
    },
  ],
  Newsfeed: [
    {
      is_active: [
        { name: 'active', value: true },
        { name: 'inactive', value: false },
      ],
    },
  ],
  Classrooms: [
    {
      status: [
        { name: 'active', value: true },
        { name: 'inactive', value: false },
      ],
    },
    {
      sub_type: [
        { name: 'class', value: 'class' },
        { name: 'exam', value: 'exam' },
      ],
    },
  ],
  Courses: [
    {
      status: [
        { name: 'active', value: true },
        { name: 'inactive', value: false },
      ],
    },
    {
      scores_view: [
        { name: 'active', value: true },
        { name: 'inactive', value: false },
      ],
    },
    {
      buyable: [
        { name: 'active', value: true },
        { name: 'inactive', value: false },
      ],
    },
  ],
  Invoices: [
    {
      status: [
        { name: 'unpaid', value: 'unpaid' },
        { name: 'failed', value: 'failed' },
        { name: 'pending', value: 'pending' },
        { name: 'canceled', value: 'canceled' },
        { name: 'delivered', value: 'delivered' },
        { name: 'expired', value: 'expired' },
        { name: 'refunded', value: 'refunded' },
        { name: 'paid', value: 'paid' },
        { name: 'new', value: 'new' },
      ],
    },
    {
      type: [
        { name: 'recharge', value: 'recharge' },
        { name: 'purchase', value: 'purchase' },
        { name: 'subscribe', value: 'subscribe' },
      ],
    },
    {
      method: [
        { name: 'PAYATFAWRY', value: 'PAYATFAWRY' },
        { name: 'CARD', value: 'CARD' },
        { name: 'EWALLET', value: 'EWALLET' },
        { name: 'WALLET', value: 'WALLET' },
        { name: 'PAYATAMAN', value: 'PAYATAMAN' },
        { name: 'PAYATMASARY', value: 'PAYATMASARY' },
        { name: 'CASHCOLLECT', value: 'CASHCOLLECT' },
      ],
    },
    {
      provider: [
        { name: 'fawry', value: 'fawry' },
        { name: 'accept', value: 'accept' },
      ],
    },
  ],
}
