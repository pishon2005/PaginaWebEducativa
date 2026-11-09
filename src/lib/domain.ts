import { z } from "zod";

export const UserRoleSchema = z.enum([
  "superadmin",
  "admin",
  "profesor",
  "alumno",
]);

export const AccountStatusSchema = z.enum([
  "pending_activation",
  "active",
  "suspended",
]);

export const CourseModalitySchema = z.enum(["presencial", "virtual"]);
export const ReservationStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
]);
export const PaymentStatusSchema = z.enum(["pending", "verified", "rejected"]);
export const AttendanceStatusSchema = z.enum([
  "presente",
  "ausente",
  "tardanza",
  "justificado",
]);

export const PrivateFileBucketSchema = z.enum([
  "profile-media",
  "student-documents",
  "assignment-submissions",
  "payment-proofs",
  "learning-materials",
  "course-videos",
  "administrative-documents",
  "message-attachments",
]);

export const PrivateFileCategorySchema = z.enum([
  "profile-photo",
  "student-document",
  "assignment-submission",
  "payment-proof",
  "learning-material",
  "course-video",
  "administrative-document",
  "message-attachment",
]);

export const PrivateFileRelationTypeSchema = z.enum([
  "profile",
  "student-document",
  "submission",
  "payment",
  "learning-resource",
  "administrative-record",
  "message",
]);

export const PrivateFileStatusSchema = z.enum([
  "pending-upload",
  "available",
  "quarantined",
  "deletion-pending",
  "deleted",
]);

const OriginalFileNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .superRefine((name, context) => {
    if (
      name === "." ||
      name === ".." ||
      /[\\/\u0000-\u001f\u007f]/.test(name)
    ) {
      context.addIssue({
        code: "custom",
        message: "El nombre no puede contener rutas ni caracteres de control.",
      });
    }

    const extension = name.includes(".") ? name.split(".").pop() : undefined;
    if (extension && !/^[a-zA-Z0-9]{1,16}$/.test(extension)) {
      context.addIssue({
        code: "custom",
        message: "La extensión del archivo no tiene un formato válido.",
      });
    }
  });

const DeclaredContentTypeSchema = z
  .string()
  .trim()
  .min(3)
  .max(255)
  .regex(/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/);

export const PrivateFileUploadInputSchema = z
  .object({
    category: PrivateFileCategorySchema,
    originalFileName: OriginalFileNameSchema,
    declaredContentType: DeclaredContentTypeSchema,
    sizeBytes: z.number().int().positive().safe(),
    relatedEntityType: PrivateFileRelationTypeSchema,
    relatedEntityId: z.string().trim().min(1).max(200),
  })
  .superRefine((input, context) => {
    const expectedRelation: Record<
      PrivateFileCategory,
      PrivateFileRelationType
    > = {
      "profile-photo": "profile",
      "student-document": "student-document",
      "assignment-submission": "submission",
      "payment-proof": "payment",
      "learning-material": "learning-resource",
      "course-video": "learning-resource",
      "administrative-document": "administrative-record",
      "message-attachment": "message",
    };

    if (input.relatedEntityType !== expectedRelation[input.category]) {
      context.addIssue({
        code: "custom",
        path: ["relatedEntityType"],
        message: "La categoría del archivo no corresponde a la entidad.",
      });
    }
  });

export const PrivateFileIdSchema = z.string().trim().min(1).max(200);

export const ConversationStartInputSchema = z.object({
  recipientId: z.string().trim().min(1).max(200),
  sectionId: z.string().trim().min(1).max(200).optional(),
});

export const ConversationListFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  before: z
    .object({
      updatedAt: z.iso.datetime(),
      conversationId: z.string().trim().min(1).max(200),
    })
    .optional(),
  limit: z.number().int().min(1).max(100).default(30),
});

export const MessageHistoryQuerySchema = z.object({
  before: z
    .object({
      sentAt: z.iso.datetime(),
      messageId: z.string().trim().min(1).max(200),
    })
    .optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const SendMessageInputSchema = z.object({
  conversationId: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(4000),
});

export const NotificationTypeSchema = z.enum([
  "new_message",
  "reservation",
  "confirmation",
  "schedule_change",
  "payment",
  "enrollment",
  "course",
  "attendance",
  "administrative_announcement",
]);

export const NotificationRelatedEntitySchema = z.enum([
  "conversation",
  "reservation",
  "section",
  "payment",
  "enrollment",
  "course",
  "academic_session",
  "attendance",
  "announcement",
]);

export const NotificationListFilterSchema = z.object({
  type: NotificationTypeSchema.optional(),
  unreadOnly: z.boolean().optional(),
  before: z
    .object({
      createdAt: z.iso.datetime(),
      notificationId: z.string().trim().min(1).max(200),
    })
    .optional(),
  limit: z.number().int().min(1).max(100).default(30),
});

export const SignInInputSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const PasswordResetInputSchema = z
  .object({
    password: z.string().min(8),
    confirmation: z.string().min(8),
  })
  .refine((input) => input.password === input.confirmation, {
    path: ["confirmation"],
    message: "Las contraseñas no coinciden.",
  });

const SlugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const CourseCategoryInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: SlugSchema,
});

export const CourseAdministrationInputSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: SlugSchema,
  categoryId: z.string().trim().min(1),
  description: z.string().trim().max(10000).nullable(),
  published: z.boolean(),
});

const WeekdaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const LocalTimeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const hasOrderedDateRange = (range: { from?: string; to?: string }) =>
  !range.from || !range.to || Date.parse(range.from) <= Date.parse(range.to);

export const SectionScheduleInputSchema = z
  .object({
    weekday: WeekdaySchema,
    startsAt: LocalTimeSchema,
    endsAt: LocalTimeSchema,
    timeZone: z.literal("America/Lima"),
  })
  .refine((schedule) => schedule.startsAt < schedule.endsAt, {
    path: ["endsAt"],
    message: "La hora de fin debe ser posterior a la hora de inicio.",
  });

export const ReservationWindowInputSchema = z
  .object({
    opensAt: z.iso.datetime(),
    closesAt: z.iso.datetime(),
  })
  .refine(
    (window) => Date.parse(window.opensAt) < Date.parse(window.closesAt),
    {
      path: ["closesAt"],
      message: "El cierre debe ser posterior a la apertura.",
    },
  );

export const SectionAdministrationInputSchema = z
  .object({
    courseId: z.string().trim().min(1),
    teacherId: z.string().trim().min(1),
    modality: CourseModalitySchema,
    startsAt: z.iso.datetime().nullable(),
    endsAt: z.iso.datetime().nullable(),
    capacity: z.number().int().positive().nullable(),
    schedules: z.array(SectionScheduleInputSchema),
    reservationWindow: ReservationWindowInputSchema.nullable(),
    // The institution's section-state catalogue remains undecided.
    status: z.string().trim().min(1),
  })
  .superRefine((section, context) => {
    if (
      section.startsAt &&
      section.endsAt &&
      Date.parse(section.startsAt) >= Date.parse(section.endsAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "La fecha de fin debe ser posterior al inicio.",
      });
    }
  });

export const CourseAdministrationFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  categoryId: z.string().trim().min(1).optional(),
  published: z.boolean().optional(),
});

export const SectionAdministrationFilterSchema = z.object({
  courseId: z.string().trim().min(1).optional(),
  teacherId: z.string().trim().min(1).optional(),
  modality: CourseModalitySchema.optional(),
  status: z.string().trim().min(1).optional(),
});

export const CourseDemandFilterSchema = z
  .object({
    courseId: z.string().trim().min(1).optional(),
    modality: CourseModalitySchema.optional(),
    preferredSchedule: z.string().trim().min(1).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .refine(hasOrderedDateRange, {
    path: ["to"],
    message: "La fecha final debe ser igual o posterior a la inicial.",
  });

export const ReservationAdministrationFilterSchema = z
  .object({
    sectionId: z.string().trim().min(1).optional(),
    status: ReservationStatusSchema.optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .refine(hasOrderedDateRange, {
    path: ["to"],
    message: "La fecha final debe ser igual o posterior a la inicial.",
  });

export const PaymentAdministrationFilterSchema = z
  .object({
    status: PaymentStatusSchema.optional(),
    sectionId: z.string().trim().min(1).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .refine(hasOrderedDateRange, {
    path: ["to"],
    message: "La fecha final debe ser igual o posterior a la inicial.",
  });

export const PaymentReviewInputSchema = z.object({
  decision: z.enum(["verified", "rejected"]),
  note: z.string().trim().max(2000).optional(),
});

export const UserAdministrationFilterSchema = z.object({
  search: z.string().trim().max(120).optional(),
  role: UserRoleSchema.optional(),
  accountStatus: AccountStatusSchema.optional(),
});

export const SafeAccountRoleSchema = z.enum(["admin", "profesor", "alumno"]);

export const AccountAdministrationInputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  role: SafeAccountRoleSchema,
});

export const AuditLogFilterSchema = z
  .object({
    actorId: z.string().trim().min(1).optional(),
    action: z.string().trim().min(1).max(120).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .refine(hasOrderedDateRange, {
    path: ["to"],
    message: "La fecha final debe ser igual o posterior a la inicial.",
  });

export const CourseInterestInputSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  courseId: z.string().trim().min(1),
  desiredModality: CourseModalitySchema,
  preferredSchedule: z.string().trim().optional(),
});

export const AttendanceChangeInputSchema = z.object({
  status: AttendanceStatusSchema,
  justification: z.string().trim().min(1),
});

export const LearningResourceInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  kind: z.enum(["video", "material"]),
  primaryFileId: PrivateFileIdSchema.nullable().optional(),
  attachmentFileIds: z.array(PrivateFileIdSchema).optional(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type AccountStatus = z.infer<typeof AccountStatusSchema>;
export type CourseModality = z.infer<typeof CourseModalitySchema>;
export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;
export type PrivateFileBucket = z.infer<typeof PrivateFileBucketSchema>;
export type PrivateFileCategory = z.infer<typeof PrivateFileCategorySchema>;
export type PrivateFileRelationType = z.infer<
  typeof PrivateFileRelationTypeSchema
>;
export type PrivateFileStatus = z.infer<typeof PrivateFileStatusSchema>;
export type PrivateFileUploadInput = z.infer<
  typeof PrivateFileUploadInputSchema
>;
export type PrivateFileId = z.infer<typeof PrivateFileIdSchema>;
export type ConversationStartInput = z.infer<
  typeof ConversationStartInputSchema
>;
export type ConversationListFilter = z.infer<
  typeof ConversationListFilterSchema
>;
export type MessageHistoryQuery = z.infer<typeof MessageHistoryQuerySchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationRelatedEntity = z.infer<
  typeof NotificationRelatedEntitySchema
>;
export type NotificationListFilter = z.infer<
  typeof NotificationListFilterSchema
>;
export type SignInInput = z.infer<typeof SignInInputSchema>;
export type CourseInterestInput = z.infer<typeof CourseInterestInputSchema>;
export type AttendanceChangeInput = z.infer<typeof AttendanceChangeInputSchema>;
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type CourseCategoryInput = z.infer<typeof CourseCategoryInputSchema>;
export type CourseAdministrationInput = z.infer<
  typeof CourseAdministrationInputSchema
>;
export type SectionAdministrationInput = z.infer<
  typeof SectionAdministrationInputSchema
>;
export type CourseAdministrationFilter = z.infer<
  typeof CourseAdministrationFilterSchema
>;
export type SectionAdministrationFilter = z.infer<
  typeof SectionAdministrationFilterSchema
>;
export type CourseDemandFilter = z.infer<typeof CourseDemandFilterSchema>;
export type LearningResourceInput = z.infer<typeof LearningResourceInputSchema>;
export type ReservationAdministrationFilter = z.infer<
  typeof ReservationAdministrationFilterSchema
>;
export type PaymentAdministrationFilter = z.infer<
  typeof PaymentAdministrationFilterSchema
>;
export type PaymentReviewInput = z.infer<typeof PaymentReviewInputSchema>;
export type UserAdministrationFilter = z.infer<
  typeof UserAdministrationFilterSchema
>;
export type AccountAdministrationInput = z.infer<
  typeof AccountAdministrationInputSchema
>;
export type AuditLogFilter = z.infer<typeof AuditLogFilterSchema>;

export type ServiceErrorCode =
  | "auth_session_missing"
  | "auth_session_invalid"
  | "password_update_failed"
  | "signout_failed"
  | "unauthenticated"
  | "session_expired"
  | "forbidden"
  | "validation"
  | "not_found"
  | "conflict"
  | "operation_not_allowed"
  | "rate_limited"
  | "offline"
  | "unavailable"
  | "internal"
  | "file_too_large"
  | "unsupported_file_type"
  | "upload_failed"
  | "storage_unavailable"
  | "file_quarantined"
  | "not_configured"
  | "unknown";

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export class ApplicationError extends Error {
  readonly code: ServiceErrorCode;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(error: ServiceError) {
    super(error.message);
    this.name = "ApplicationError";
    this.code = error.code;
    this.fieldErrors = error.fieldErrors;
  }
}

export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: ServiceError };
