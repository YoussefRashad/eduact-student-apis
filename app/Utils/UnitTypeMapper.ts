class UnitTypeMapper {
  static obj: {
    'Test': string
    'Presentation | Document': string
    'Content': string
    'Survey': string
    'Section': string
    'Web content': string
    'Instructor-led training': string
  }
  static map(status: string) {
    this.obj = {
      'Test': 'Test',
      'Presentation | Document': 'Document',
      'Content': 'Content/Video',
      'Survey': 'Survey',
      'Section': 'Section',
      'Web content': 'Video',
      'Instructor-led training': 'Live Session',
    }
    // @ts-ignore
    return this.obj[status] ? this.obj[status] : status
  }
}

module.exports = UnitTypeMapper
