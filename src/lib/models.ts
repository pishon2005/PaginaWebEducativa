import type {
  AccountStatus,
  AttendanceStatus,
  CourseModality,
  PaymentStatus,
  PrivateFileBucket,
  PrivateFileCategory,
  PrivateFileId,
  PrivateFileRelationType,
  PrivateFileStatus,
  NotificationRelatedEntity,
  NotificationType,
  ReservationStatus,
  UserRole,
} from "@/lib/domain";

export interface AuthSession {
  userId: string;
  role: UserRole;
  accountStatus: AccountStatus;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  categoryName: string | null;
}

export interface CourseCategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface AdministrativeCourseSummary extends CourseSummary {
  categoryId: string;
  description: string | null;
  published: boolean;
}

export interface TeacherProfile {
  userId: string;
  displayName: string;
  biography: string | null;
  specialties: readonly string[];
}

export interface StudentSummary {
  userId: string;
  displayName: string;
  studentCode: string | null;
}

export interface SectionSchedule {
  weekday:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  startsAt: string;
  endsAt: string;
  timeZone: "America/Lima";
}

export interface ReservationWindow {
  opensAt: string;
  closesAt: string;
}

export interface SectionSummary {
  id: string;
  courseId: string;
  teacherId: string;
  modality: CourseModality;
  capacity: number | null;
  startsAt: string | null;
  endsAt: string | null;
  schedules: readonly SectionSchedule[];
  reservationWindow: ReservationWindow | null;
  status: string;
}

export interface SectionAvailability {
  sectionId: string;
  capacity: number | null;
  reservedPlaces: number;
  enrolledPlaces: number;
  availablePlaces: number | null;
  reservationWindow: ReservationWindow | null;
}

export interface CourseDemandSummary {
  courseId: string;
  modality: CourseModality;
  preferredSchedule: string | null;
  interestCount: number;
  demandDate: string | null;
}

export interface ReservationSummary {
  id: string;
  sectionId: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface PaymentSummary {
  id: string;
  reservationId: string;
  amount: number;
  status: PaymentStatus;
  reference: string | null;
  createdAt: string;
}

export interface PaymentReview {
  paymentId: string;
  reviewerId: string;
  decision: Exclude<PaymentStatus, "pending">;
  reviewedAt: string;
  note: string | null;
}

export interface EnrollmentSummary {
  id: string;
  sectionId: string;
  studentId: string;
  enrolledAt: string;
}

export interface AcademicSessionSummary {
  id: string;
  sectionId: string;
  teacherId: string;
  startsAt: string;
  status: "scheduled" | "rescheduled" | "cancelled";
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  updatedAt: string;
}

export interface LearningResource {
  id: string;
  sectionId: string;
  title: string;
  kind: "video" | "material";
  primaryFileId: PrivateFileId | null;
  attachmentFileIds: readonly PrivateFileId[];
}

export interface PrivateFileMetadata {
  id: string;
  category: PrivateFileCategory;
  originalFileName: string;
  bucket: PrivateFileBucket;
  objectPath: string;
  contentType: string;
  sizeBytes: number;
  ownerId: string;
  uploadedBy: string;
  relatedEntityType: PrivateFileRelationType;
  relatedEntityId: string;
  status: PrivateFileStatus;
  createdAt: string;
  uploadedAt: string | null;
}

export interface PrivateUploadIntent {
  fileId: string;
  bucket: PrivateFileBucket;
  objectPath: string;
  uploadMethod: "standard" | "tus-resumable";
  expiresAt: string;
}

export interface PrivateUploadProgress {
  status: "validating" | "uploading" | "finalizing" | "completed" | "failed";
  bytesUploaded: number;
  totalBytes: number;
  percentage: number;
}

export interface PrivateDownload {
  signedUrl: string;
  expiresAt: string;
  fileName: string;
  contentType: string;
  disposition: "inline" | "attachment";
}

export type ConversationKind =
  "student_teacher" | "student_admin" | "teacher_admin";

export interface PrivateConversation {
  id: string;
  kind: ConversationKind;
  participants: readonly [ConversationParticipantSummary, ConversationParticipantSummary];
  lastMessage: PrivateMessagePreview | null;
  unreadCount: number;
  updatedAt: string;
}

export interface ConversationParticipantSummary {
  userId: string;
  displayName: string;
  role: UserRole;
}

export interface PrivateMessagePreview {
  id: string;
  senderId: string;
  bodyPreview: string;
  sentAt: string;
}

export interface MessageHistoryPage {
  items: PrivateMessage[];
  nextCursor: {
    sentAt: string;
    messageId: string;
  } | null;
}

export interface PrivateMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt: string | null;
  sendStatus: "sending" | "sent" | "failed";
}

export type ChatRealtimeStatus =
  | "connecting"
  | "subscribed"
  | "reconnecting"
  | "closed"
  | "error";

export type ChatRealtimeEvent =
  | {
      type: "message_available";
      conversationId: string;
      messageId: string;
      occurredAt: string;
    }
  | {
      type: "conversation_updated";
      conversationId: string;
      occurredAt: string;
    };

export type NotificationRealtimeEvent = {
  type: "notification_available";
  notificationId: string;
  occurredAt: string;
};

export interface ChatRealtimeSubscriptionContract {
  subscribeToConversation(
    conversationId: string,
    onEvent: (event: ChatRealtimeEvent) => void,
    onStatus: (status: ChatRealtimeStatus) => void,
  ): () => void;
}

export interface NotificationRealtimeSubscriptionContract {
  subscribeToOwnNotifications(
    onEvent: (event: NotificationRealtimeEvent) => void,
    onStatus: (status: ChatRealtimeStatus) => void,
  ): () => void;
}

export interface NotificationSummary {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedEntityType: NotificationRelatedEntity | null;
  relatedEntityId: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface DashboardStatistics {
  interests: number;
  enrollments: number;
  reservationsByStatus: Record<ReservationStatus, number>;
  paymentsByStatus: Record<PaymentStatus, number>;
  attendanceByStatus: Record<AttendanceStatus, number>;
  demand: readonly CourseDemandSummary[];
}

export interface AdministrativeStatisticsOverview {
  studentCount: number;
  teacherCount: number;
  publishedCourseCount: number;
  openSectionCount: number;
  interestCount: number;
  reservationCount: number;
  enrollmentCount: number;
  pendingPaymentCount: number;
  verifiedPaymentCount: number;
}

export interface AttendanceStatistics {
  sessionCount: number;
  enrolledStudentCount: number;
  recordedAttendanceCount: number;
  byStatus: Record<AttendanceStatus, number>;
  attendancePercentage: number | null;
}

export interface StatisticsTrendPoint {
  periodStart: string;
  count: number;
}

export interface AdministrativeStatistics {
  overview: AdministrativeStatisticsOverview;
  demandByModality: readonly CourseDemandSummary[];
  demandBySchedule: readonly CourseDemandSummary[];
  demandOverTime: readonly StatisticsTrendPoint[];
  enrollmentsOverTime: readonly StatisticsTrendPoint[];
  attendance: AttendanceStatistics;
}

export interface TeacherStatistics {
  attendance: AttendanceStatistics;
  demand: readonly CourseDemandSummary[];
  enrollmentsOverTime: readonly StatisticsTrendPoint[];
}

export interface AuditLogSummary {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  occurredAt: string;
  result: "success" | "failure";
}
