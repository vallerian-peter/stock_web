export type SupportRequestType = "help" | "chat" | "bug" | "feedback"
export type SupportPriority = "low" | "normal" | "high" | "urgent"
export type SupportContactPreference = "email" | "phone"
export type SupportRequestStatus = "submitted" | "in_review" | "resolved"

export type CreateSupportRequestDTO = {
  type: SupportRequestType
  category: string
  subject: string
  message: string
  priority: SupportPriority
  contactPreference: SupportContactPreference
  rating?: number
  sourcePath?: string
}

export type SupportRequestDTO = CreateSupportRequestDTO & {
  id: number
  referenceNumber: string
  status: SupportRequestStatus
  createdAt: string
}
