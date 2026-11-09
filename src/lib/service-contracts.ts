import "server-only";

import type {
  AttendanceChangeInput,
  AttendanceStatus,
  AccountAdministrationInput,
  AuditLogFilter,
  CourseAdministrationFilter,
  CourseAdministrationInput,
  CourseCategoryInput,
  CourseDemandFilter,
  CourseInterestInput,
  ConversationListFilter,
  ConversationStartInput,
  MessageHistoryQuery,
  NotificationListFilter,
  PaymentAdministrationFilter,
  PaymentReviewInput,
  PrivateFileId,
  PrivateFileUploadInput,
  ReservationAdministrationFilter,
  SectionAdministrationFilter,
  SectionAdministrationInput,
  LearningResourceInput,
  SendMessageInput,
  SignInInput,
  UserAdministrationFilter,
} from "@/lib/domain";
import type {
  AcademicSessionSummary,
  AdministrativeCourseSummary,
  AdministrativeStatistics,
  AuditLogSummary,
  CourseCategorySummary,
  AttendanceRecord,
  AuthSession,
  CourseDemandSummary,
  CourseSummary,
  DashboardStatistics,
  EnrollmentSummary,
  LearningResource,
  MessageHistoryPage,
  NotificationSummary,
  PaymentReview,
  PaymentSummary,
  PrivateConversation,
  PrivateDownload,
  PrivateFileMetadata,
  PrivateUploadIntent,
  PrivateMessage,
  SectionAvailability,
  ReservationSummary,
  SectionSummary,
  StudentSummary,
  TeacherStatistics,
  TeacherProfile,
  UserProfile,
  UserProfileUpdate,
} from "@/lib/models";

export interface AuthServiceContract {
  getCurrentSession(): Promise<AuthSession | null>;
  signIn(input: SignInInput): Promise<AuthSession>;
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
}

export interface UserServiceContract {
  getOwnProfile(): Promise<UserProfile>;
  updateOwnProfile(input: UserProfileUpdate): Promise<UserProfile>;
  listForAdministration(
    filters?: UserAdministrationFilter,
  ): Promise<UserProfile[]>;
}

export interface AccountAdministrationServiceContract {
  createOrEnableStudentForVerifiedReservation(
    reservationId: string,
  ): Promise<UserProfile>;
  inviteAdministrator(
    input: Omit<AccountAdministrationInput, "role"> & { role: "admin" },
  ): Promise<UserProfile>;
  suspendAccount(userId: string): Promise<void>;
}

export interface CourseServiceContract {
  listPublished(): Promise<CourseSummary[]>;
  getPublishedBySlug(slug: string): Promise<CourseSummary>;
}

export interface CourseAdministrationServiceContract extends CourseServiceContract {
  listForAdministration(
    filters?: CourseAdministrationFilter,
  ): Promise<AdministrativeCourseSummary[]>;
  create(
    input: CourseAdministrationInput,
  ): Promise<AdministrativeCourseSummary>;
  update(
    courseId: string,
    input: CourseAdministrationInput,
  ): Promise<AdministrativeCourseSummary>;
}

export interface CourseCategoryServiceContract {
  list(): Promise<CourseCategorySummary[]>;
  create(input: CourseCategoryInput): Promise<CourseCategorySummary>;
  update(
    categoryId: string,
    input: CourseCategoryInput,
  ): Promise<CourseCategorySummary>;
}

export interface TeacherServiceContract {
  listPublicProfiles(): Promise<TeacherProfile[]>;
  getPublicProfile(userId: string): Promise<TeacherProfile>;
}

export interface StudentServiceContract {
  getOwnSummary(): Promise<StudentSummary>;
  listBySection(sectionId: string): Promise<StudentSummary[]>;
}

export interface SectionServiceContract {
  listByCourse(courseId: string): Promise<SectionSummary[]>;
  listForCurrentTeacher(): Promise<SectionSummary[]>;
  listForCurrentStudent(): Promise<SectionSummary[]>;
}

export interface SectionAdministrationServiceContract extends SectionServiceContract {
  listForAdministration(
    filters?: SectionAdministrationFilter,
  ): Promise<SectionSummary[]>;
  getAvailability(sectionId: string): Promise<SectionAvailability>;
  create(input: SectionAdministrationInput): Promise<SectionSummary>;
  update(
    sectionId: string,
    input: SectionAdministrationInput,
  ): Promise<SectionSummary>;
}

export interface CourseInterestServiceContract {
  submit(input: CourseInterestInput): Promise<void>;
  listDemand(filters?: CourseDemandFilter): Promise<CourseDemandSummary[]>;
  listDemandForAssignedCourses(
    filters?: CourseDemandFilter,
  ): Promise<CourseDemandSummary[]>;
}

export interface ReservationServiceContract {
  listBySection(sectionId: string): Promise<ReservationSummary[]>;
  listForAdministration(
    filters?: ReservationAdministrationFilter,
  ): Promise<ReservationSummary[]>;
  getAvailability(sectionId: string): Promise<SectionAvailability>;
  confirm(reservationId: string): Promise<ReservationSummary>;
  cancel(reservationId: string): Promise<ReservationSummary>;
}

export interface PaymentServiceContract {
  listForAdministration(
    filters?: PaymentAdministrationFilter,
  ): Promise<PaymentSummary[]>;
  getForReservation(reservationId: string): Promise<PaymentSummary | null>;
  listReviewHistory(paymentId: string): Promise<PaymentReview[]>;
  reviewManually(
    paymentId: string,
    input: PaymentReviewInput,
  ): Promise<PaymentReview>;
}

export interface EnrollmentServiceContract {
  getOwnForSection(sectionId: string): Promise<EnrollmentSummary | null>;
  listBySection(sectionId: string): Promise<EnrollmentSummary[]>;
  confirmForReservation(reservationId: string): Promise<EnrollmentSummary>;
}

export interface AttendanceServiceContract {
  listForSession(sessionId: string): Promise<AttendanceRecord[]>;
  recordForStudent(
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
  ): Promise<AttendanceRecord>;
  changeRecord(
    attendanceId: string,
    input: AttendanceChangeInput,
  ): Promise<AttendanceRecord>;
}

export interface AcademicSessionServiceContract {
  listBySection(sectionId: string): Promise<AcademicSessionSummary[]>;
  reschedule(
    sessionId: string,
    startsAt: string,
  ): Promise<AcademicSessionSummary>;
  cancel(sessionId: string): Promise<AcademicSessionSummary>;
}

export interface LearningContentServiceContract {
  listForSection(sectionId: string): Promise<LearningResource[]>;
  getForSection(
    sectionId: string,
    resourceId: string,
  ): Promise<LearningResource>;
}

export interface LearningContentAdministrationServiceContract extends LearningContentServiceContract {
  createForAssignedSection(
    sectionId: string,
    input: LearningResourceInput,
  ): Promise<LearningResource>;
  updateForAssignedSection(
    sectionId: string,
    resourceId: string,
    input: LearningResourceInput,
  ): Promise<LearningResource>;
}

export interface PrivateFileServiceContract {
  listForResource(resourceId: string): Promise<PrivateFileMetadata[]>;
  createUploadIntent(
    input: PrivateFileUploadInput,
  ): Promise<PrivateUploadIntent>;
  completeUpload(fileId: PrivateFileId): Promise<PrivateFileMetadata>;
  retryUpload(fileId: PrivateFileId): Promise<PrivateUploadIntent>;
  cancelUpload(fileId: PrivateFileId): Promise<void>;
  getAuthorizedPreview(fileId: PrivateFileId): Promise<PrivateDownload>;
  getAuthorizedDownload(fileId: PrivateFileId): Promise<PrivateDownload>;
  replace(
    fileId: PrivateFileId,
    input: PrivateFileUploadInput,
  ): Promise<PrivateUploadIntent>;
  delete(fileId: PrivateFileId): Promise<void>;
}

export interface ChatServiceContract {
  listAuthorizedConversations(
    filters?: ConversationListFilter,
  ): Promise<PrivateConversation[]>;
  startOrGetConversation(
    input: ConversationStartInput,
  ): Promise<PrivateConversation>;
  listMessages(
    conversationId: string,
    query?: MessageHistoryQuery,
  ): Promise<MessageHistoryPage>;
  sendMessage(input: SendMessageInput): Promise<PrivateMessage>;
  markMessageRead(messageId: string): Promise<void>;
  markConversationRead(
    conversationId: string,
    throughMessageId?: string,
  ): Promise<void>;
  getUnreadCount(): Promise<number>;
}

export interface NotificationServiceContract {
  listOwn(filters?: NotificationListFilter): Promise<NotificationSummary[]>;
  getUnreadCount(): Promise<number>;
  markRead(notificationId: string): Promise<void>;
  markAllRead(): Promise<void>;
}

export interface StatisticsServiceContract {
  getForCurrentRole(): Promise<DashboardStatistics>;
  getForInstitutionAdministrator(): Promise<AdministrativeStatistics>;
  getForPlatformSuperadministrator(): Promise<AdministrativeStatistics>;
  getForCurrentTeacher(): Promise<TeacherStatistics>;
}

export interface AuditLogServiceContract {
  listForPlatformAdministration(
    filters?: AuditLogFilter,
  ): Promise<AuditLogSummary[]>;
}
