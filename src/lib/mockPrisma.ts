// Mock Prisma client for when database is disabled or unavailable
import { mockStudents, mockTeachers, mockClasses, mockAttendance, mockAnnouncements, mockEvents, mockAssignments, mockExams, mockResults, mockMessages, mockFees, mockLeaveRequests, mockSubjects, mockParents, mockTimetable, mockLessons } from './mockData'

class MockPrismaClient {
  constructor() {
    // Create mock models for all Prisma models
    this.user = this.createMockModel('user')
    this.refreshToken = this.createMockModel('refreshToken')
    this.school = this.createMockModel('school')
    this.admin = this.createMockModel('admin')
    this.teacher = this.createMockModel('teacher')
    this.student = this.createMockModel('student')
    this.parent = this.createMockModel('parent')
    this.class = this.createMockModel('class')
    this.grade = this.createMockModel('grade')
    this.subject = this.createMockModel('subject')
    this.lesson = this.createMockModel('lesson')
    this.exam = this.createMockModel('exam')
    this.assignment = this.createMockModel('assignment')
    this.result = this.createMockModel('result')
    this.attendance = this.createMockModel('attendance')
    this.announcement = this.createMockModel('announcement')
    this.event = this.createMockModel('event')
    this.discipline = this.createMockModel('discipline')
    this.feeStructure = this.createMockModel('feeStructure')
    this.studentFee = this.createMockModel('studentFee')
    this.invoice = this.createMockModel('invoice')
    this.payment = this.createMockModel('payment')
    this.submission = this.createMockModel('submission')
    this.leaveRequest = this.createMockModel('leaveRequest')
    this.studentAchievement = this.createMockModel('studentAchievement')
    this.studentGoal = this.createMockModel('studentGoal')
    this.classDiary = this.createMockModel('classDiary')
    this.supportTicket = this.createMockModel('supportTicket')
    this.ticketMessage = this.createMockModel('ticketMessage')
    this.platformSetting = this.createMockModel('platformSetting')
    this.platformAnnouncement = this.createMockModel('platformAnnouncement')
    this.subscription = this.createMockModel('subscription')
    this.subscriptionInvoice = this.createMockModel('subscriptionInvoice')
  }

  createMockModel(modelName) {
    const mockData = this.getMockDataForModel(modelName)
    
    return {
      findMany: async () => mockData,
      findUnique: async () => mockData[0] || null,
      findFirst: async () => mockData[0] || null,
      count: async () => mockData.length,
      create: async () => mockData[0] || { id: 'mock-id' },
      update: async () => mockData[0] || { id: 'mock-id' },
      delete: async () => mockData[0] || { id: 'mock-id' },
      aggregate: async () => ({ _count: mockData.length }),
      groupBy: async () => [],
    }
  }

  getMockDataForModel(modelName) {
    switch(modelName) {
      case 'student': return mockStudents
      case 'teacher': return mockTeachers
      case 'class': return mockClasses
      case 'attendance': return mockAttendance
      case 'announcement': return mockAnnouncements
      case 'event': return mockEvents
      case 'assignment': return mockAssignments
      case 'exam': return mockExams
      case 'result': return mockResults
      case 'subject': return mockSubjects
      case 'parent': return mockParents
      case 'lesson': return mockLessons
      default: return []
    }
  }

  async $connect() {
    console.log('Mock Prisma: Connection simulated')
  }

  async $disconnect() {
    console.log('Mock Prisma: Disconnection simulated')
  }

  async $queryRaw() {
    return []
  }

  async $executeRaw() {
    return 0
  }
}

export const mockPrismaClient = new MockPrismaClient()