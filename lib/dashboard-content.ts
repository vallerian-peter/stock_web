import type { LandingLocale } from "@/lib/landing-content"

export type DashboardSectionKey =
  | "dashboard"
  | "users"
  | "categories"
  | "products"
  | "incomeStock"
  | "outgoing"
  | "sales"
  | "payable"
  | "receivable"
  | "analytics"
  | "settings"
  | "helpCenter"
  | "account"

type SectionContent = {
  eyebrow: string
  title: string
  description: string
  stats: Array<{
    label: string
    value: string
    tone?: "default" | "accent"
  }>
  actions: string[]
}

export const dashboardContent: Record<
  LandingLocale,
  {
    shell: {
      title: string
      subtitle: string
      primaryGroup: string
      supportGroup: string
      debtsLabel: string
      navDivider: string
      accountRole: string
      roleLabels: Record<"ADMIN" | "USER", string>
      currentBranch: string
      currentBranchLabel: string
      account: string
      profile: string
      signOut: string
      notifications: string
      language: string
      openSidebar: string
      collapseSidebar: string
      expandSidebar: string
      topbarHint: string
    }
    nav: Record<DashboardSectionKey, string>
    overview: {
      eyebrow: string
      title: string
      description: string
      labels: {
        welcome: string
        welcomeDescription: string
        inventoryStatistics: string
        monthly: string
        stockIn: string
        stockOut: string
        stockValue: string
        salesOverview: string
        salesGoal: string
        numberOfSales: string
        totalSales: string
        recentActivities: string
        alerts: string
        topProducts: string
        viewDetails: string
        months: string[]
      }
      kpis: Array<{
        label: string
        value: string
        detail: string
      }>
      quickActions: Array<{
        label: string
        detail: string
        href: string
      }>
      watchlist: Array<{
        name: string
        value: string
        status: string
      }>
      activity: Array<{
        title: string
        detail: string
      }>
    }
    sections: Record<DashboardSectionKey, SectionContent>
  }
> = {
  en: {
    shell: {
      title: "Inventory Control",
      subtitle: "Private workspace for Valler Parts staff",
      primaryGroup: "Operations",
      supportGroup: "Support",
      debtsLabel: "Debts",
      navDivider: "Management tools",
      accountRole: "Store administrator",
      roleLabels: {
        ADMIN: "Administrator",
        USER: "User",
      },
      currentBranch: "Valler Parts Main Yard",
      currentBranchLabel: "Current branch",
      account: "Account",
      profile: "My profile",
      signOut: "Sign out",
      notifications: "Alerts",
      language: "Language",
      openSidebar: "Open sidebar",
      collapseSidebar: "Collapse sidebar",
      expandSidebar: "Expand sidebar",
      topbarHint: "Monitor stock movement and team actions in one place.",
    },
    nav: {
      dashboard: "Dashboard",
      users: "Users",
      categories: "Categories",
      products: "Products / Parts",
      incomeStock: "Income Stock",
      outgoing: "Out-going",
      sales: "Sales",
      payable: "Payable",
      receivable: "Receivable",
      analytics: "Reports and Analytics",
      settings: "Settings",
      helpCenter: "Help Center",
      account: "Account",
    },
    overview: {
      eyebrow: "Private dashboard",
      title: "A compact workspace for stock, money, and staff visibility.",
      description:
        "Track what came in, what went out, and who touched the numbers. The layout is optimized for fast daily work on desktop and mobile.",
      labels: {
        welcome: "Welcome back",
        welcomeDescription: "Here is today’s inventory summary.",
        inventoryStatistics: "Inventory statistics",
        monthly: "Monthly",
        stockIn: "Stock in",
        stockOut: "Stock out",
        stockValue: "Stock value",
        salesOverview: "Sales overview",
        salesGoal: "Sales goal",
        numberOfSales: "Number of sales",
        totalSales: "Total sales",
        recentActivities: "Recent activities",
        alerts: "Alerts and notifications",
        topProducts: "Top products",
        viewDetails: "View details",
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      },
      kpis: [
        {
          label: "Total products",
          value: "2,184",
          detail: "+48 recorded this week",
        },
        {
          label: "Total stock value",
          value: "TZS 48.6M",
          detail: "Up 8.4% from last month",
        },
        {
          label: "Low stock items",
          value: "26",
          detail: "8 require action today",
        },
      ],
      quickActions: [
        {
          label: "Register new stock arrival",
          detail: "Move fresh supplier items into available inventory.",
          href: "/dashboard/income-stock",
        },
        {
          label: "Review outgoing items",
          detail: "Confirm parts released to technicians or customers.",
          href: "/dashboard/outgoing",
        },
        {
          label: "Audit customer debt",
          detail: "Check overdue balances before more stock leaves the store.",
          href: "/dashboard/debts/receivable",
        },
      ],
      watchlist: [
        {
          name: "Brake pads",
          value: "7 packs left",
          status: "Reorder today",
        },
        {
          name: "Oil filters",
          value: "12 units left",
          status: "Monitor closely",
        },
        {
          name: "Shock absorbers",
          value: "4 units left",
          status: "Critical level",
        },
      ],
      activity: [
        {
          title: "Morning stock intake completed",
          detail:
            "Receiving desk logged 18 new line items from Kibaha supplier.",
        },
        {
          title: "Debt reminder batch prepared",
          detail:
            "6 customer balances flagged for owner follow-up this evening.",
        },
        {
          title: "Sales report synced",
          detail: "Today’s counter sales summary is ready for review.",
        },
      ],
    },
    sections: {
      dashboard: {
        eyebrow: "Overview",
        title: "Daily control center",
        description:
          "Use this view to check movement, debt exposure, and action points before the day becomes noisy.",
        stats: [
          { label: "Open tasks", value: "14" },
          { label: "Team online", value: "7 / 9" },
          { label: "Stock accuracy", value: "98.4%", tone: "accent" },
        ],
        actions: [
          "Review items that dropped below reorder level.",
          "Confirm yesterday’s supplier deliveries.",
          "Approve any debt exceptions before dispatch.",
        ],
      },
      users: {
        eyebrow: "People and access",
        title: "Manage workers who can access the inventory workspace.",
        description:
          "Add staff, review permissions, and keep access limited to trusted users only.",
        stats: [
          { label: "Active users", value: "9" },
          { label: "Pending invites", value: "2" },
          { label: "Role conflicts", value: "0", tone: "accent" },
        ],
        actions: [
          "Confirm new staff roles before giving stock-edit access.",
          "Disable accounts that no longer work on the store floor.",
          "Separate sales permissions from inventory adjustment permissions.",
        ],
      },
      categories: {
        eyebrow: "Category management",
        title: "Organize parts under clean category labels.",
        description:
          "Keep the category list short, consistent, and reusable so product records and reports stay easy to scan.",
        stats: [
          { label: "Tracked categories", value: "24" },
          { label: "Unused labels", value: "3" },
          { label: "Naming conflicts", value: "0", tone: "accent" },
        ],
        actions: [
          "Keep category naming predictable across similar parts.",
          "Remove duplicate labels before product imports grow.",
          "Use stable categories so reporting stays comparable over time.",
        ],
      },
      products: {
        eyebrow: "Catalog structure",
        title: "Organize parts and product records for faster tracking.",
        description:
          "Keep names, categories, and store references clean so movement reports stay trustworthy.",
        stats: [
          { label: "Tracked parts", value: "2,184" },
          { label: "Uncategorized", value: "17" },
          { label: "Barcode coverage", value: "83%", tone: "accent" },
        ],
        actions: [
          "Standardize part naming before bulk imports.",
          "Group similar items under consistent category labels.",
          "Tag fast-moving parts for quicker dashboard filtering.",
        ],
      },
      incomeStock: {
        eyebrow: "Incoming inventory",
        title:
          "Record stock entering the store with supplier and quantity clarity.",
        description:
          "Every received item should trace back to a supplier, date, and responsible worker.",
        stats: [
          { label: "Today’s receipts", value: "18" },
          { label: "Waiting verification", value: "5" },
          { label: "Supplier variance", value: "1.8%", tone: "accent" },
        ],
        actions: [
          "Match supplier paperwork before confirming receipt.",
          "Separate damaged items from sellable stock immediately.",
          "Attach cost changes to the same intake record.",
        ],
      },
      outgoing: {
        eyebrow: "Outgoing inventory",
        title:
          "Track parts leaving the shelf for sales, service, or internal use.",
        description:
          "Outgoing records should always explain where stock moved and who approved it.",
        stats: [
          { label: "Today’s releases", value: "31" },
          { label: "Unconfirmed dispatches", value: "3" },
          { label: "Return rate", value: "2.1%", tone: "accent" },
        ],
        actions: [
          "Confirm the destination before closing each dispatch record.",
          "Flag unusual quantity jumps for manual review.",
          "Require reason codes for internal stock consumption.",
        ],
      },
      sales: {
        eyebrow: "Sales register",
        title: "See how counter activity affects stock and cash flow.",
        description:
          "Sales visibility matters because inventory quality is only useful if it maps to revenue cleanly.",
        stats: [
          { label: "Sales today", value: "TZS 1.8M" },
          { label: "Invoices pending", value: "4" },
          { label: "Average ticket", value: "TZS 186K", tone: "accent" },
        ],
        actions: [
          "Match sold quantities against stock deductions.",
          "Review large sales before end-of-day close.",
          "Separate paid sales from debt-based releases.",
        ],
      },
      payable: {
        eyebrow: "Debts we owe",
        title: "Monitor supplier balances and outgoing obligations.",
        description:
          "This area helps the owner see who must be paid and what payment pressure is building.",
        stats: [
          { label: "Open supplier balances", value: "8" },
          { label: "Due this week", value: "TZS 4.2M" },
          { label: "Overdue accounts", value: "2", tone: "accent" },
        ],
        actions: [
          "Prioritize suppliers that affect core stock replenishment.",
          "Attach payment promises to each balance record.",
          "Review overdue supplier accounts before new orders are placed.",
        ],
      },
      receivable: {
        eyebrow: "Debts owed to us",
        title: "Track customers or partners who still owe the business.",
        description:
          "Keep outgoing stock aligned with payment discipline so debt does not silently erode cash flow.",
        stats: [
          { label: "Outstanding accounts", value: "12" },
          { label: "Overdue amount", value: "TZS 6.8M" },
          { label: "Collection rate", value: "71%", tone: "accent" },
        ],
        actions: [
          "Flag repeat late payers before approving more releases.",
          "Separate strategic customers from risky debtors.",
          "Schedule weekly collection follow-up by owner or accountant.",
        ],
      },
      analytics: {
        eyebrow: "Reporting",
        title: "Turn stock movement into decisions, not just records.",
        description:
          "Use analytics to see trend changes, dead stock, and the categories driving revenue.",
        stats: [
          { label: "Tracked dashboards", value: "6" },
          { label: "Fast movers", value: "24" },
          { label: "Dead stock value", value: "TZS 2.1M", tone: "accent" },
        ],
        actions: [
          "Compare incoming stock with sales demand by category.",
          "Review dead stock before reordering similar parts.",
          "Watch debt-heavy customers against revenue contribution.",
        ],
      },
      settings: {
        eyebrow: "System controls",
        title: "Adjust workspace rules, permissions, and dashboard behavior.",
        description:
          "Settings should stay tight because this app holds both inventory truth and financial risk.",
        stats: [
          { label: "Permission groups", value: "4" },
          { label: "Audit policies", value: "9" },
          { label: "Critical warnings", value: "1", tone: "accent" },
        ],
        actions: [
          "Keep high-risk actions limited to owner-level roles.",
          "Review stock-adjustment permissions monthly.",
          "Document every rule that changes sales or debt behavior.",
        ],
      },
      helpCenter: {
        eyebrow: "Support",
        title: "Keep the team aligned on how the system should be used.",
        description:
          "A small, clear help center prevents bad data entry and repeated process mistakes.",
        stats: [
          { label: "Guides available", value: "11" },
          { label: "Unread updates", value: "3" },
          { label: "Critical notices", value: "1", tone: "accent" },
        ],
        actions: [
          "Document how to record stock corrections correctly.",
          "Explain when to create debt entries versus normal sales.",
          "Keep mobile usage guidance visible for staff on the floor.",
        ],
      },
      account: {
        eyebrow: "Personal workspace",
        title: "Review your profile, activity, and working preferences.",
        description:
          "Your account area should make it easy to confirm identity, role, and the language you work in.",
        stats: [
          { label: "Signed in as", value: "Admin" },
          { label: "Locale choices", value: "2" },
          { label: "Session health", value: "Secure", tone: "accent" },
        ],
        actions: [
          "Confirm your role still matches your daily responsibility.",
          "Set the language that keeps your work fastest.",
          "Report any unfamiliar recent account activity immediately.",
        ],
      },
    },
  },
  sw: {
    shell: {
      title: "Usimamizi wa Stoo",
      subtitle: "Eneo binafsi la kazi kwa timu ya Valler Parts",
      primaryGroup: "Shughuli kuu",
      supportGroup: "Msaada",
      debtsLabel: "Madeni",
      navDivider: "Zana za usimamizi",
      accountRole: "Msimamizi wa stoo",
      roleLabels: {
        ADMIN: "Msimamizi",
        USER: "Mtumiaji",
      },
      currentBranch: "Valler Parts Tawi Kuu",
      currentBranchLabel: "Tawi la sasa",
      account: "Akaunti",
      profile: "Wasifu wangu",
      signOut: "Toka",
      notifications: "Tahadhari",
      language: "Lugha",
      openSidebar: "Fungua menyu ya pembeni",
      collapseSidebar: "Fupisha menyu ya pembeni",
      expandSidebar: "Panua menyu ya pembeni",
      topbarHint:
        "Fuatilia mzunguko wa stoo na hatua za timu katika sehemu moja.",
    },
    nav: {
      dashboard: "Dashibodi",
      users: "Watumiaji",
      categories: "Makundi",
      products: "Bidhaa / Spea",
      incomeStock: "Stoo Inayoingia",
      outgoing: "Stoo Inayotoka",
      sales: "Mauzo",
      payable: "Tunayodaiwa",
      receivable: "Tunayodai",
      analytics: "Ripoti na Uchambuzi",
      settings: "Mipangilio",
      helpCenter: "Kituo cha Msaada",
      account: "Akaunti",
    },
    overview: {
      eyebrow: "Dashibodi binafsi",
      title: "Eneo fupi la kazi kwa stoo, fedha, na ufuatiliaji wa timu.",
      description:
        "Angalia kilichoingia, kilichotoka, na aliyehusika na takwimu. Muundo umeboreshwa kwa kazi ya kila siku kwenye desktop na simu.",
      labels: {
        welcome: "Karibu tena",
        welcomeDescription: "Huu ni muhtasari wa stoo wa leo.",
        inventoryStatistics: "Takwimu za stoo",
        monthly: "Kila mwezi",
        stockIn: "Stoo iliyoingia",
        stockOut: "Stoo iliyotoka",
        stockValue: "Thamani ya stoo",
        salesOverview: "Muhtasari wa mauzo",
        salesGoal: "Lengo la mauzo",
        numberOfSales: "Idadi ya mauzo",
        totalSales: "Jumla ya mauzo",
        recentActivities: "Shughuli za hivi karibuni",
        alerts: "Tahadhari na taarifa",
        topProducts: "Bidhaa zinazoongoza",
        viewDetails: "Angalia maelezo",
        months: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep"],
      },
      kpis: [
        {
          label: "Jumla ya bidhaa",
          value: "2,184",
          detail: "+48 zimeongezwa wiki hii",
        },
        {
          label: "Jumla ya thamani ya stoo",
          value: "TZS 48.6M",
          detail: "Imeongezeka kwa 8.4% kutoka mwezi uliopita",
        },
        {
          label: "Bidhaa zenye stoo ndogo",
          value: "26",
          detail: "8 zinahitaji hatua leo",
        },
      ],
      quickActions: [
        {
          label: "Sajili mzigo mpya wa stoo",
          detail:
            "Ingiza bidhaa mpya za wasambazaji kwenye stoo inayopatikana.",
          href: "/dashboard/income-stock",
        },
        {
          label: "Kagua bidhaa zilizotoka",
          detail: "Thibitisha spea zilizotolewa kwa mafundi au wateja.",
          href: "/dashboard/outgoing",
        },
        {
          label: "Kagua madeni ya wateja",
          detail:
            "Angalia salio lililochelewa kabla ya stoo zaidi kutoka dukani.",
          href: "/dashboard/debts/receivable",
        },
      ],
      watchlist: [
        {
          name: "Brake pads",
          value: "Pakiti 7 zimebaki",
          status: "Agiza leo",
        },
        {
          name: "Oil filters",
          value: "Vipande 12 vimebaki",
          status: "Fuatilia kwa karibu",
        },
        {
          name: "Shock absorbers",
          value: "Vipande 4 vimebaki",
          status: "Kiwango cha hatari",
        },
      ],
      activity: [
        {
          title: "Uingizaji wa stoo wa asubuhi umekamilika",
          detail:
            "Sehemu ya mapokezi imerekodi vitu 18 vipya kutoka kwa msambazaji wa Kibaha.",
        },
        {
          title: "Ujumbe wa ukumbusho wa madeni umeandaliwa",
          detail:
            "Madeni 6 ya wateja yamewekwa kwa ufuatiliaji wa mmiliki jioni hii.",
        },
        {
          title: "Ripoti ya mauzo imesawazishwa",
          detail: "Muhtasari wa mauzo ya kaunta wa leo uko tayari kwa mapitio.",
        },
      ],
    },
    sections: {
      dashboard: {
        eyebrow: "Muhtasari",
        title: "Kituo cha udhibiti wa kila siku",
        description:
          "Tumia eneo hili kuangalia mzunguko, hatari ya madeni, na maeneo ya hatua kabla ya siku kuwa na shughuli nyingi.",
        stats: [
          { label: "Kazi wazi", value: "14" },
          { label: "Timu mtandaoni", value: "7 / 9" },
          { label: "Usahihi wa stoo", value: "98.4%", tone: "accent" },
        ],
        actions: [
          "Kagua bidhaa zilizoshuka chini ya kiwango cha kuagiza tena.",
          "Thibitisha mizigo ya jana kutoka kwa wasambazaji.",
          "Ruhusu tofauti za madeni kabla ya kutoa stoo.",
        ],
      },
      users: {
        eyebrow: "Watu na ruhusa",
        title: "Simamia wafanyakazi wanaoweza kufikia mfumo wa stoo.",
        description:
          "Ongeza wafanyakazi, kagua ruhusa, na hakikisha mfumo unatumika na watu wanaoaminika tu.",
        stats: [
          { label: "Watumiaji hai", value: "9" },
          { label: "Mialiko inayosubiri", value: "2" },
          { label: "Migongano ya majukumu", value: "0", tone: "accent" },
        ],
        actions: [
          "Thibitisha majukumu ya wafanyakazi kabla ya kuwapa ruhusa ya kuhariri stoo.",
          "Zima akaunti za watu ambao hawafanyi kazi dukani tena.",
          "Tenganisha ruhusa za mauzo na ruhusa za marekebisho ya stoo.",
        ],
      },
      categories: {
        eyebrow: "Usimamizi wa makundi",
        title: "Panga spea chini ya majina ya makundi yaliyo safi.",
        description:
          "Hakikisha orodha ya makundi ni fupi, yenye mwendelezo, na inayoweza kutumika tena ili bidhaa na ripoti zibaki rahisi kusoma.",
        stats: [
          { label: "Makundi yanayofuatiliwa", value: "24" },
          { label: "Majina yasiyotumika", value: "3" },
          { label: "Migongano ya majina", value: "0", tone: "accent" },
        ],
        actions: [
          "Weka majina ya makundi yawe na mwendelezo kwa spea zinazofanana.",
          "Ondoa makundi yanayojirudia kabla ya uingizaji wa bidhaa kuongezeka.",
          "Tumia makundi thabiti ili ripoti zibaki kulinganishwa vizuri.",
        ],
      },
      products: {
        eyebrow: "Muundo wa katalogi",
        title: "Panga spea na rekodi za bidhaa kwa ufuatiliaji rahisi.",
        description:
          "Hakikisha majina, makundi, na rejea za bidhaa ziko safi ili ripoti za mzunguko ziaminike.",
        stats: [
          { label: "Spea zinazofuatiliwa", value: "2,184" },
          { label: "Bila kundi", value: "17" },
          { label: "Uwiano wa barcode", value: "83%", tone: "accent" },
        ],
        actions: [
          "Sanifisha majina ya spea kabla ya kuingiza kwa wingi.",
          "Panga bidhaa zinazofanana chini ya makundi yenye mwendelezo.",
          "Weka alama spea zinazotoka sana kwa uchujaji wa haraka.",
        ],
      },
      incomeStock: {
        eyebrow: "Stoo inayoingia",
        title:
          "Rekodi stoo inayoingia dukani kwa uwazi wa msambazaji na idadi.",
        description:
          "Kila bidhaa iliyopokelewa inapaswa kuhusishwa na msambazaji, tarehe, na mfanyakazi aliyepokea.",
        stats: [
          { label: "Mapokezi ya leo", value: "18" },
          { label: "Yanayosubiri uhakiki", value: "5" },
          { label: "Tofauti ya msambazaji", value: "1.8%", tone: "accent" },
        ],
        actions: [
          "Linganishwa makaratasi ya msambazaji kabla ya kuthibitisha mapokezi.",
          "Tenganisha bidhaa zilizoharibika na stoo ya kuuzwa mara moja.",
          "Unganisha mabadiliko ya gharama na rekodi hiyo hiyo ya mapokezi.",
        ],
      },
      outgoing: {
        eyebrow: "Stoo inayotoka",
        title:
          "Fuatilia spea zinazoondoka rafuni kwa mauzo, huduma, au matumizi ya ndani.",
        description:
          "Rekodi za stoo inayotoka zinapaswa kueleza kila wakati ilipopelekwa na nani aliruhusu.",
        stats: [
          { label: "Matoleo ya leo", value: "31" },
          { label: "Dispatch zisizothibitishwa", value: "3" },
          { label: "Kiwango cha kurejesha", value: "2.1%", tone: "accent" },
        ],
        actions: [
          "Thibitisha mahali pa mwisho kabla ya kufunga rekodi ya utoaji.",
          "Weka alama mabadiliko makubwa ya idadi kwa mapitio ya mikono.",
          "Hitaji sababu kwa matumizi ya stoo ya ndani.",
        ],
      },
      sales: {
        eyebrow: "Rejesta ya mauzo",
        title:
          "Ona jinsi mauzo ya kaunta yanavyoathiri stoo na mzunguko wa fedha.",
        description:
          "Uwonekano wa mauzo ni muhimu kwa sababu ubora wa stoo una maana tu ukihusishwa vizuri na mapato.",
        stats: [
          { label: "Mauzo ya leo", value: "TZS 1.8M" },
          { label: "Ankara zinazosubiri", value: "4" },
          { label: "Tiketi ya wastani", value: "TZS 186K", tone: "accent" },
        ],
        actions: [
          "Linganishwa kiasi kilichouzwa na punguzo la stoo.",
          "Kagua mauzo makubwa kabla ya kufunga siku.",
          "Tenganisha mauzo yaliyolipwa na yale ya deni.",
        ],
      },
      payable: {
        eyebrow: "Madeni tunayodaiwa kulipa",
        title: "Fuatilia salio la wasambazaji na wajibu wa malipo.",
        description:
          "Sehemu hii humsaidia mmiliki kuona nani anatakiwa kulipwa na wapi presha ya malipo inaongezeka.",
        stats: [
          { label: "Madeni ya wasambazaji", value: "8" },
          { label: "Yanayodaiwa wiki hii", value: "TZS 4.2M" },
          { label: "Akaunti zilizochelewa", value: "2", tone: "accent" },
        ],
        actions: [
          "Tilia kipaumbele wasambazaji wanaoathiri ujazaji wa stoo kuu.",
          "Ambatanisha ahadi za malipo kwa kila rekodi ya deni.",
          "Kagua madeni yaliyochelewa kabla ya oda mpya.",
        ],
      },
      receivable: {
        eyebrow: "Madeni wanayotudai",
        title: "Fuatilia wateja au washirika wanaodaiwa kulipa biashara.",
        description:
          "Hakikisha stoo inayotoka inaendana na nidhamu ya malipo ili deni lisiharibu fedha za biashara kimyakimya.",
        stats: [
          { label: "Akaunti zenye salio", value: "12" },
          { label: "Kiasi kilichochelewa", value: "TZS 6.8M" },
          { label: "Kiwango cha ukusanyaji", value: "71%", tone: "accent" },
        ],
        actions: [
          "Weka alama kwa wateja wanaochelewa mara kwa mara kabla ya kuachia bidhaa zaidi.",
          "Tenganisha wateja wa kimkakati na wadaiwa hatarishi.",
          "Panga ufuatiliaji wa ukusanyaji kila wiki na mmiliki au mhasibu.",
        ],
      },
      analytics: {
        eyebrow: "Ripoti",
        title: "Badilisha mzunguko wa stoo kuwa maamuzi, si kumbukumbu tu.",
        description:
          "Tumia uchambuzi kuona mwelekeo, bidhaa zilizokaa, na makundi yanayoleta mapato.",
        stats: [
          { label: "Dashibodi za ripoti", value: "6" },
          { label: "Bidhaa zinazotoka haraka", value: "24" },
          { label: "Thamani ya dead stock", value: "TZS 2.1M", tone: "accent" },
        ],
        actions: [
          "Linganisha stoo inayoingia na mahitaji ya mauzo kwa kila kundi.",
          "Kagua bidhaa zilizokaa kabla ya kuagiza zinazofanana.",
          "Fuatilia wateja wenye madeni makubwa dhidi ya mchango wa mapato.",
        ],
      },
      settings: {
        eyebrow: "Udhibiti wa mfumo",
        title:
          "Badilisha sheria za eneo la kazi, ruhusa, na tabia ya dashibodi.",
        description:
          "Mipangilio inapaswa kubaki makini kwa sababu mfumo huu unashikilia ukweli wa stoo na hatari ya kifedha.",
        stats: [
          { label: "Makundi ya ruhusa", value: "4" },
          { label: "Sera za ukaguzi", value: "9" },
          { label: "Onyo muhimu", value: "1", tone: "accent" },
        ],
        actions: [
          "Weka matendo ya hatari juu kwa majukumu ya mmiliki tu.",
          "Kagua ruhusa za marekebisho ya stoo kila mwezi.",
          "Andika kila sheria inayobadilisha mauzo au madeni.",
        ],
      },
      helpCenter: {
        eyebrow: "Msaada",
        title: "Weka timu kwenye mstari mmoja kuhusu matumizi sahihi ya mfumo.",
        description:
          "Kituo kidogo lakini wazi cha msaada huzuia makosa ya kuingiza data na urudiaji wa makosa ya mchakato.",
        stats: [
          { label: "Mwongozo uliopo", value: "11" },
          { label: "Taarifa ambazo hazijasomwa", value: "3" },
          { label: "Taarifa muhimu", value: "1", tone: "accent" },
        ],
        actions: [
          "Eleza jinsi ya kurekodi marekebisho ya stoo kwa usahihi.",
          "Fafanua lini uunde deni badala ya mauzo ya kawaida.",
          "Weka mwongozo wa matumizi ya simu wazi kwa wafanyakazi wa dukani.",
        ],
      },
      account: {
        eyebrow: "Eneo binafsi la kazi",
        title: "Kagua wasifu wako, shughuli zako, na mapendeleo ya kazi.",
        description:
          "Sehemu ya akaunti yako inapaswa kurahisisha kuthibitisha utambulisho, jukumu, na lugha unayotumia.",
        stats: [
          { label: "Umeingia kama", value: "Admin" },
          { label: "Chaguzi za lugha", value: "2" },
          { label: "Hali ya kikao", value: "Salama", tone: "accent" },
        ],
        actions: [
          "Thibitisha jukumu lako linaendana na kazi zako za kila siku.",
          "Chagua lugha inayofanya kazi iwe ya haraka zaidi.",
          "Ripoti shughuli yoyote ya akaunti usiyoitambua mara moja.",
        ],
      },
    },
  },
}
