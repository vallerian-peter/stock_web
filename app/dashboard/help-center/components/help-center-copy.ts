import type { LandingLocale } from "@/lib/landing-content"
import { defineLocalizedCopy, type LocalizedCopy } from "@/lib/localized-copy"

export const helpCenterCopy = defineLocalizedCopy({
  en: {
    prompt: "How can we help?",
    channels: {
      label: "Contact support",
      help: {
        title: "Ask for help",
        description: "Get guidance on a task.",
      },
      chat: {
        title: "Message support",
        description: "Start a support conversation.",
      },
      bug: {
        title: "Report an issue",
        description: "Tell us what is not working.",
      },
      feedback: {
        title: "Share feedback",
        description: "Help us improve the system.",
      },
    },
    form: {
      titles: {
        help: "Ask for help",
        chat: "Message support",
        bug: "Report an issue",
        feedback: "Share feedback",
      },
      description:
        "Your profile and contact details are attached automatically.",
      category: "Topic",
      categoryPlaceholder: "Choose a topic",
      categories: {
        inventory: "Inventory",
        sales: "Sales",
        debts: "Debts",
        account: "Account",
        reports: "Reports",
        dashboard: "Dashboard",
        other: "Other",
      },
      subject: "Subject",
      subjectPlaceholder: "Briefly describe what you need",
      message: "Details",
      messagePlaceholder:
        "Include what you were doing, what happened, and what you expected.",
      priority: "Priority",
      priorities: {
        low: "Low",
        normal: "Normal",
        high: "High",
        urgent: "Urgent",
      },
      contact: "Reply by",
      contacts: {
        email: "Email",
        phone: "Phone",
      },
      rating: "Your rating",
      ratingLabel: "out of 5",
      send: "Send request",
      sending: "Sending...",
      sent: "Request sent",
      sentDescription: "Reference",
      sendFailed: "Could not send your request. Please try again.",
      validation: {
        category: "Choose a topic.",
        subject: "Enter 5–120 characters.",
        message: "Enter at least 20 characters.",
        rating: "Choose a rating.",
      },
    },
    history: {
      title: "Recent requests",
      description: "Your latest support conversations.",
      loading: "Loading requests",
      loadFailed: "Could not load your requests.",
      retry: "Try again",
      emptyTitle: "No requests yet",
      emptyDescription: "Sent requests will appear here.",
      statuses: {
        submitted: "Submitted",
        in_review: "In review",
        resolved: "Resolved",
      },
      types: {
        help: "Help",
        chat: "Chat",
        bug: "Issue",
        feedback: "Feedback",
      },
    },
    faq: {
      title: "Common questions",
      items: [
        {
          question: "How do I correct a stock quantity?",
          answer:
            "Record the correcting stock movement and include a clear purpose. Avoid editing historical transactions.",
        },
        {
          question: "When should I record a debt?",
          answer:
            "Use receivable debt when a customer owes the business, and payable debt when the business owes a supplier.",
        },
        {
          question: "Why can I not access a page?",
          answer:
            "Page access follows your assigned role. Ask an administrator to review your role if you need additional access.",
        },
        {
          question: "What should I include in an issue report?",
          answer:
            "Describe the page, the action you took, what happened, and what you expected. Include the exact error text when possible.",
        },
      ],
    },
  },
  sw: {
    prompt: "Tunawezaje kusaidia?",
    channels: {
      label: "Wasiliana na msaada",
      help: {
        title: "Omba msaada",
        description: "Pata mwongozo kuhusu kazi.",
      },
      chat: {
        title: "Tuma ujumbe",
        description: "Anza mazungumzo ya msaada.",
      },
      bug: {
        title: "Ripoti tatizo",
        description: "Tuambie kisichofanya kazi.",
      },
      feedback: {
        title: "Toa maoni",
        description: "Tusaidie kuboresha mfumo.",
      },
    },
    form: {
      titles: {
        help: "Omba msaada",
        chat: "Tuma ujumbe",
        bug: "Ripoti tatizo",
        feedback: "Toa maoni",
      },
      description: "Wasifu na mawasiliano yako yataambatishwa moja kwa moja.",
      category: "Mada",
      categoryPlaceholder: "Chagua mada",
      categories: {
        inventory: "Stoo",
        sales: "Mauzo",
        debts: "Madeni",
        account: "Akaunti",
        reports: "Ripoti",
        dashboard: "Dashibodi",
        other: "Nyingine",
      },
      subject: "Kichwa",
      subjectPlaceholder: "Eleza kwa kifupi unachohitaji",
      message: "Maelezo",
      messagePlaceholder:
        "Eleza ulichokuwa unafanya, kilichotokea, na ulichotarajia.",
      priority: "Kipaumbele",
      priorities: {
        low: "Chini",
        normal: "Kawaida",
        high: "Juu",
        urgent: "Haraka",
      },
      contact: "Jibu kupitia",
      contacts: {
        email: "Barua pepe",
        phone: "Simu",
      },
      rating: "Kiwango chako",
      ratingLabel: "kati ya 5",
      send: "Tuma ombi",
      sending: "Inatuma...",
      sent: "Ombi limetumwa",
      sentDescription: "Rejea",
      sendFailed: "Imeshindikana kutuma ombi. Jaribu tena.",
      validation: {
        category: "Chagua mada.",
        subject: "Weka herufi 5–120.",
        message: "Weka angalau herufi 20.",
        rating: "Chagua kiwango.",
      },
    },
    history: {
      title: "Maombi ya hivi karibuni",
      description: "Mazungumzo yako ya mwisho ya msaada.",
      loading: "Inapakia maombi",
      loadFailed: "Imeshindikana kupakia maombi yako.",
      retry: "Jaribu tena",
      emptyTitle: "Hakuna maombi bado",
      emptyDescription: "Maombi yaliyotumwa yataonekana hapa.",
      statuses: {
        submitted: "Limetumwa",
        in_review: "Linakaguliwa",
        resolved: "Limetatuliwa",
      },
      types: {
        help: "Msaada",
        chat: "Ujumbe",
        bug: "Tatizo",
        feedback: "Maoni",
      },
    },
    faq: {
      title: "Maswali ya kawaida",
      items: [
        {
          question: "Ninasahihishaje idadi ya bidhaa?",
          answer:
            "Rekodi mwendo wa bidhaa wa kusahihisha na uweke sababu wazi. Usibadilishe miamala ya zamani.",
        },
        {
          question: "Ni lini nirekodi deni?",
          answer:
            "Tumia deni linalopokelewa mteja anapodaiwa, na deni linalolipwa biashara inapomdaiwa msambazaji.",
        },
        {
          question: "Kwa nini siwezi kufungua ukurasa?",
          answer:
            "Ruhusa za ukurasa hufuata jukumu lako. Muombe msimamizi akague jukumu lako ikiwa unahitaji ruhusa zaidi.",
        },
        {
          question: "Nijumuishe nini kwenye ripoti ya tatizo?",
          answer:
            "Eleza ukurasa, hatua uliyofanya, kilichotokea, na ulichotarajia. Weka ujumbe halisi wa kosa inapowezekana.",
        },
      ],
    },
  },
})

export type HelpCenterCopy = LocalizedCopy<
  (typeof helpCenterCopy)[Extract<LandingLocale, "en">]
>
