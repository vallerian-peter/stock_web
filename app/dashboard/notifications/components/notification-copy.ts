import type { LandingLocale } from "@/lib/landing-content"

export const notificationCopy = {
  en: {
    title: "Notifications",
    description:
      "Business alerts for debts, inventory availability, and completed daily activity.",
    all: "All",
    unread: "Unread",
    unreadCount: "{count} unread",
    markAllRead: "Mark all as read",
    deleteAll: "Delete all",
    delete: "Delete",
    markRead: "Mark as read",
    preview: "Preview",
    viewRecord: "View record",
    viewReport: "View report",
    close: "Close",
    loading: "Loading notifications",
    retry: "Try again",
    emptyTitle: "No notifications",
    emptyDescription: "There are no active business alerts right now.",
    noUnreadTitle: "No unread notifications",
    noUnreadDescription: "You have reviewed every active notification.",
    loadError: "Notifications could not be loaded.",
    deleteTitle: "Delete notification?",
    deleteDescription:
      "This alert will remain hidden while its current condition is unchanged.",
    deleteAllTitle: "Delete all notifications?",
    deleteAllDescription:
      "All current notifications will be hidden. New business conditions will still create new alerts.",
    confirmDelete: "Delete",
    cancel: "Cancel",
    markedAllRead: "All notifications marked as read.",
    deleted: "Notification deleted.",
    deletedAll: "All notifications deleted.",
    actionError: "The notification action could not be completed.",
    dailyCountingNote:
      "Sales revenue is counted from sales records only. Dispatch quantities are split into sale-linked and other outgoing movements to prevent double-counting.",
    types: {
      DEBT_DUE_RECEIVABLE: {
        title: "Receivable due soon",
        description: "{party} should pay TZS {balance} within {days} day(s).",
      },
      DEBT_DUE_PAYABLE: {
        title: "Payable due soon",
        description:
          "TZS {balance} owed to {party} is due within {days} day(s).",
      },
      LOW_STOCK: {
        title: "Low-stock part",
        description: "{part} has only {quantity} unit(s) remaining.",
      },
      OUT_OF_STOCK: {
        title: "Part is out of stock",
        description: "{part} has no units available.",
      },
      DAILY_TREND: {
        title: "Daily business report",
        description:
          "{sales} sale(s), TZS {revenue} revenue, {incoming} received, and {outgoing} dispatched.",
      },
    },
    details: {
      balance: "Outstanding balance",
      totalDebt: "Total debt",
      dueDate: "Due date",
      reference: "Reference",
      party: "Customer / creditor",
      partName: "Part name",
      partNumber: "Part number",
      quantity: "Quantity remaining",
      reportDate: "Report date",
      salesCount: "Sales records",
      salesRevenue: "Sales revenue",
      salesPaid: "Amount received",
      soldQuantity: "Units sold",
      incomingRecords: "Incoming records",
      incomingQuantity: "Units received",
      incomingCost: "Incoming cost",
      outgoingRecords: "Outgoing records",
      outgoingQuantity: "Units dispatched",
      saleDispatchQuantity: "Sales dispatch units",
      otherDispatchQuantity: "Other dispatch units",
    },
  },
  sw: {
    title: "Taarifa",
    description:
      "Tahadhari za biashara kuhusu madeni, upatikanaji wa stoo, na shughuli za kila siku zilizokamilika.",
    all: "Zote",
    unread: "Hazijasomwa",
    unreadCount: "{count} hazijasomwa",
    markAllRead: "Weka zote zimesomwa",
    deleteAll: "Futa zote",
    delete: "Futa",
    markRead: "Weka imesomwa",
    preview: "Hakiki",
    viewRecord: "Angalia rekodi",
    viewReport: "Angalia ripoti",
    close: "Funga",
    loading: "Inapakia taarifa",
    retry: "Jaribu tena",
    emptyTitle: "Hakuna taarifa",
    emptyDescription: "Hakuna tahadhari hai za biashara kwa sasa.",
    noUnreadTitle: "Hakuna taarifa ambazo hazijasomwa",
    noUnreadDescription: "Umeshakagua taarifa zote hai.",
    loadError: "Taarifa hazikuweza kupakiwa.",
    deleteTitle: "Futa taarifa?",
    deleteDescription:
      "Tahadhari hii itafichwa wakati hali yake ya sasa haijabadilika.",
    deleteAllTitle: "Futa taarifa zote?",
    deleteAllDescription:
      "Taarifa zote za sasa zitafichwa. Hali mpya za biashara bado zitatengeneza tahadhari mpya.",
    confirmDelete: "Futa",
    cancel: "Ghairi",
    markedAllRead: "Taarifa zote zimewekwa kuwa zimesomwa.",
    deleted: "Taarifa imefutwa.",
    deletedAll: "Taarifa zote zimefutwa.",
    actionError: "Hatua ya taarifa haikuweza kukamilika.",
    dailyCountingNote:
      "Mapato yanahesabiwa kutoka rekodi za mauzo pekee. Idadi iliyotoka imetenganishwa kati ya mauzo na mizunguko mingine ili kuzuia kuhesabu mara mbili.",
    types: {
      DEBT_DUE_RECEIVABLE: {
        title: "Deni tunalodai linakaribia",
        description:
          "{party} anapaswa kulipa TZS {balance} ndani ya siku {days}.",
      },
      DEBT_DUE_PAYABLE: {
        title: "Deni tunalopaswa kulipa linakaribia",
        description:
          "TZS {balance} tunazopaswa kumlipa {party} zinadaiwa ndani ya siku {days}.",
      },
      LOW_STOCK: {
        title: "Spea ina stoo ndogo",
        description: "{part} imebaki na idadi {quantity} pekee.",
      },
      OUT_OF_STOCK: {
        title: "Spea imeisha stoo",
        description: "{part} haina idadi iliyobaki.",
      },
      DAILY_TREND: {
        title: "Ripoti ya biashara ya kila siku",
        description:
          "Mauzo {sales}, mapato TZS {revenue}, zilizoingia {incoming}, na zilizotoka {outgoing}.",
      },
    },
    details: {
      balance: "Salio la deni",
      totalDebt: "Jumla ya deni",
      dueDate: "Tarehe ya mwisho",
      reference: "Kumbukumbu",
      party: "Mteja / mkopeshaji",
      partName: "Jina la spea",
      partNumber: "Namba ya spea",
      quantity: "Idadi iliyobaki",
      reportDate: "Tarehe ya ripoti",
      salesCount: "Rekodi za mauzo",
      salesRevenue: "Mapato ya mauzo",
      salesPaid: "Kiasi kilichopokelewa",
      soldQuantity: "Idadi iliyouzwa",
      incomingRecords: "Rekodi zinazoingia",
      incomingQuantity: "Idadi iliyopokelewa",
      incomingCost: "Gharama ya zilizoingia",
      outgoingRecords: "Rekodi zinazotoka",
      outgoingQuantity: "Idadi iliyotoka",
      saleDispatchQuantity: "Idadi iliyotoka kwa mauzo",
      otherDispatchQuantity: "Idadi nyingine iliyotoka",
    },
  },
} as const satisfies Record<LandingLocale, object>

export type NotificationCopy = (typeof notificationCopy)[LandingLocale]
