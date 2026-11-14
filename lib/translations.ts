export type Language = "uz" | "en";

export interface BuildingTranslation {
  name: string;
  description: string;
}

export const translations = {
  uz: {
    // Umumiy
    appTitle: "Metropolis",
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    close: "Yopish",
    cancel: "Bekor qilish",
    confirm: "Tasdiqlash",
    save: "Saqlash",
    level: "Daraja",
    req: "talab",
    cost: "Narxi",
    perSec: "/soniya",
    you: "SIZ",

    // Asosiy sahifa (Landing)
    badge: "Ko'p o'yinchili shaharsozlik iqtisodiyoti",
    heroTitle1: "Kelajak Mega-Shahrini",
    heroTitle2: "Qurib Rivojlantiring",
    heroDesc:
      "Aholi turar joylarini quring, tijorat markazlarini ishchi kuchi bilan ta'minlang, 24 soatgacha oflayn daromad oling va 9 tagacha shahar bilan Turizm Ko'priklari orqali ittifoq tuzing.",
    foundCharter: "Shaharga Asos Solish",
    mayorLogin: "Hokim Kirishi",
    feature1Title: "24 soatlik Oflayn Iqtisodiyot",
    feature1Desc:
      "Tijorat binolari siz o'yinda bo'lmaganingizda ham uzluksiz soniyali hisob bilan daromad keltiradi.",
    feature2Title: "Aholi va Ishchi Kuchi",
    feature2Desc:
      "Tijorat zonalari ishchilarni talab qiladi. 100% samaradorlikka erishish uchun turar joylarni kengaytiring.",
    feature3Title: "9 ta Shahar Ko'priklari",
    feature3Desc:
      "Qo'shni hokimlar bilan ittifoq tuzing. Har bir faol ko'prik shahar daromadiga doimiy +5% bonus beradi.",

    // Kirish va Ro'yxatdan o'tish (Auth)
    loginTitle: "Hokim Kirish Terminali",
    loginSubtitle: "Shahringizni boshqarish uchun ma'lumotlaringizni kiriting",
    registerTitle: "Shaharga Asos Solish",
    registerSubtitle: "5x5 o'lchamli hududni band qiling va shaharsozlikni boshlang",
    mayorUsername: "Hokim Taxallusi (Username)",
    mayorPlaceholder: "Masalan: TemurHokim",
    passcode: "Maxfiy Parol",
    accessConsole: "Shahar Konsoliga Kirish",
    authenticating: "Tekshirilmoqda...",
    foundCity: "Shaharni Barpo Etish",
    founding: "Shahar barpo etilmoqda...",
    charterInclusions: "Boshlang'ich Imtiyozlar",
    capital: "Mablag'",
    citizens: "Fuqaro",
    landPlot: "Yer Maydoni",
    hasAccount: "Shahringiz bormi? Hokim sifatida kiring",
    noAccount: "Yangi shaharga asos solasizmi? Ro'yxatdan o'ting",

    // Yuqori panel (TopBar)
    metropolisConsole: "Shahar Konsoli",
    treasury: "Xazina",
    population: "Fuqarolar",
    laborShortage: "Ishchi kuchi yetishmayapti: ko'proq turar joy quring!",
    revenue: "Daromad",
    eff: "Samara",
    effReduced: "Ishchi kuchi yetishmasligi sabab daromad pasaygan.",
    effFull: "Ishchi kuchi to'liq 100% ta'minlangan.",
    bridges: "Ko'priklar",
    rankings: "Reyting",
    syncTooltip: "Mablag'ni server bilan sinxronlash",
    logoutTooltip: "Chiqish",

    // Boshqaruv paneli (GameBoard)
    laborDeficitTitle: "Ishchi kuchi yetishmovchiligi ({eff}% samaradorlik)",
    laborDeficitDesc: "Tijorat binolari maksimal daromad berishi uchun yana {needed} nafar fuqaro kerak.",
    laborFullTitle: "Ishchi kuchi to'liq (100% samaradorlik)",
    laborFullDesc: "Barcha tijorat zonalari maksimal iqtisodiy quvvatda ishlamoqda.",
    bridgeMultiplierTitle: "Turizm Ko'prigi Bonusi: +{percent}%",
    bridgeMultiplierDesc: "Har biri +5% bonus berishi uchun yana {remaining} tagacha hokim bilan bog'lanishingiz mumkin.",
    bridgeMultiplierMax: "Maksimal 9 ta ko'prik ulangan! +45% yuqori turizm bonusi faol.",
    manage: "Boshqarish",

    // Xarita (CityGrid)
    territoryMatrix: "Shahar Hududi Matritsasi (5x5)",
    plotsOccupied: "{count}/25 maydon band",
    gridHint: "Qurish yoki yangilash uchun istalgan katakni bosing",
    emptyPlot: "Bo'sh maydon",
    buildHint: "Qurish",

    // Qurilish oynasi (BuildModal)
    modalTitle: "Yangi Bino Qurish",
    modalSubtitle: "({x}, {y}) koordinatasidagi yer maydoniga infratuzilma tanlang",
    tabAll: "Barchasi",
    tabResidential: "Turar Joy",
    tabCommercial: "Tijorat",
    providesResidents: "Aholi ta'minoti: +{count} fuqaro",
    requiresWorkers: "Ishchi talabi: {count} nafar",
    generatesIncome: "Keltiradigan daromad: +{income}/sek",
    constructButton: "Qurish ({cost})",
    insufficientFunds: "Mablag' yetarli emas",
    buildingProgress: "Qurilmoqda...",

    // Yangilash oynasi (UpgradeModal)
    upgradeTitle: "Binoni Yangilash",
    currentLevel: "Hozirgi daraja: {level}",
    nextLevel: "Keyingi daraja: {level}",
    residentsBoost: "Aholi sig'imi",
    incomeBoost: "Daromad hajmi",
    workersReq: "Talab etiladigan ishchilar",
    upgradeButton: "Darajasini oshirish ({cost})",
    upgrading: "Yangilanmoqda...",

    // Oflayn daromad oynasi (OfflineModal)
    offlineTitle: "Oflayn Daromad",
    offlineDesc: "Siz o'yinda bo'lmagan paytingizda shahar korxonalari uzluksiz daromad keltirdi",
    timeAccumulated: "To'plangan vaqt: {time}",
    cappedWarning: "Daromad 24 soatlik xavfsizlik chegarasiga yetdi",
    claimButton: "Daromadni qabul qilish va boshlash",

    // Ko'priklar boshqaruvi (BridgeDashboard)
    allianceTitle: "Turizm Ko'priklari Ittifoqi",
    allianceSubtitle: "Qo'shni hokimlar bilan ittifoq tuzing: har bir ko'prik shahar daromadiga +5% qo'shadi (maksimal 9 ta)",
    activeBridgesCount: "Faol ko'priklar: {count}/9",
    currentBonus: "Hozirgi turizm bonusi: +{percent}%",
    tabActive: "Faol ko'priklar",
    tabIncoming: "Kelgan takliflar",
    tabOutgoing: "Yuborilgan takliflar",
    proposeNewBridge: "Yangi ko'prik taklif qilish",
    enterMayorUsername: "Hokim taxallusini kiriting...",
    sendRequest: "Taklif yuborish",
    sending: "Yuborilmoqda...",
    accept: "Qabul qilish",
    reject: "Rad etish",
    breakBridge: "Ko'prikni uzish",
    noActiveBridges: "Hozircha hech qanday ko'prik yo'q. Boshqa hokimlarga taklif yuboring!",
    noIncomingRequests: "Yangi takliflar yo'q",
    noOutgoingRequests: "Kutilayotgan yuborilgan takliflar yo'q",

    // Reyting (Leaderboard)
    returnToCity: "Shahar Konsoliga Qaytish",
    globalLeaderboards: "Dunyo Reytingi",
    hallOfFame: "Metropolis Faxriy Zali",
    hallSubtitle: "Dunyodagi eng boy hokimlar va eng yirik megapolislar raqobati",
    tabTopEarners: "Eng Yuqori Daromad ($/sek)",
    tabMegapolises: "Eng Katta Megapolislar (Aholi)",
    colRank: "O'rin",
    colMayor: "Hokim va Shahar",
    colIncome: "Daromad Tezligi",
    colPopulation: "Aholi",
    colTreasury: "Xazina",
    colBridges: "Ko'priklar",

    // Binolar ma'lumotlari
    buildings: {
      RESIDENTIAL_SMALL: {
        name: "Shinam Hovli",
        description: "Yangi ko'chib kelgan fuqarolar uchun qulay arzon turar joy.",
      },
      RESIDENTIAL_TOWER: {
        name: "Osmono'par Bino",
        description: "Katta ishchi kuchini o'zida jamlovchi ko'p qavatli zamonaviy kompleks.",
      },
      COMMERCIAL_SHOP: {
        name: "Neon Do'koni",
        description: "Barqaror daromad keltiruvchi mahalliy do'kon. 5 nafar ishchi talab qiladi.",
      },
      COMMERCIAL_MALL: {
        name: "Kiber Savdo Markazi",
        description: "Katta savdo markazi. 30 nafar ishchi talab qiladi.",
      },
      COMMERCIAL_OFFICE: {
        name: "Apex Texno Markazi",
        description: "Katta daromad keltiruvchi yuqori texnologiyali korporatsiya. 90 nafar ishchi talab qiladi.",
      },
    } as Record<string, BuildingTranslation>,
  },

  en: {
    // Common
    appTitle: "Metropolis",
    loading: "Loading...",
    error: "An error occurred",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    level: "Level",
    req: "req",
    cost: "Cost",
    perSec: "/s",
    you: "YOU",

    // Landing
    badge: "Multiplayer Idle Urban Economy",
    heroTitle1: "Build Your Futuristic",
    heroTitle2: "Skyline Metropolis",
    heroDesc:
      "Construct high-density residential towers, fuel commercial hubs with citizen workforces, earn offline yields up to 24 hours, and link up to 9 player cities via Tourism Bridges.",
    foundCharter: "Found Your City Charter",
    mayorLogin: "Mayor Login",
    feature1Title: "24h Idle Economy",
    feature1Desc:
      "Commercial buildings continue generating revenue even while you are offline, with sub-second state ticks.",
    feature2Title: "Population Balancing",
    feature2Desc:
      "Commercial buildings require a thriving workforce. Scale housing to maintain 100% commercial efficiency.",
    feature3Title: "9-Player Bridges",
    feature3Desc:
      "Connect your borders with neighboring mayors. Every active bridge grants a +5% global tourism revenue boost.",

    // Auth
    loginTitle: "Mayor Access Terminal",
    loginSubtitle: "Enter your credentials to oversee your metropolis",
    registerTitle: "Found City Charter",
    registerSubtitle: "Claim your 5x5 territory and initiate economic development",
    mayorUsername: "Mayor Username",
    mayorPlaceholder: "e.g. NeoTokyoMayor",
    passcode: "Passcode",
    accessConsole: "Access City Console",
    authenticating: "Authenticating Mayor...",
    foundCity: "Found Metropolis",
    founding: "Founding Metropolis...",
    charterInclusions: "Charter Inclusions",
    capital: "Capital",
    citizens: "Citizens",
    landPlot: "Land Plot",
    hasAccount: "Already chartered? Mayor Login",
    noAccount: "Found a new city charter",

    // TopBar
    metropolisConsole: "Metropolis Console",
    treasury: "Treasury",
    population: "Citizens",
    laborShortage: "Labor shortage: build more housing!",
    revenue: "Revenue",
    eff: "Eff",
    effReduced: "Commercial income reduced due to worker shortage.",
    effFull: "Workforce fully satisfied at 100%.",
    bridges: "Bridges",
    rankings: "Rankings",
    syncTooltip: "Sync Balance to Server",
    logoutTooltip: "Logout Mayor",

    // GameBoard
    laborDeficitTitle: "Labor Deficit Detected ({eff}% Efficiency)",
    laborDeficitDesc: "Your commercial centers need {needed} more citizens to generate maximum revenue.",
    laborFullTitle: "Workforce Fully Staffed (100% Efficiency)",
    laborFullDesc: "All commercial zones are operating at peak economic output.",
    bridgeMultiplierTitle: "Tourism Bridge Multiplier: +{percent}%",
    bridgeMultiplierDesc: "Connect up to {remaining} more player cities for +5% bonus each.",
    bridgeMultiplierMax: "Maximum 9 bridges connected! +45% peak tourism bonus active.",
    manage: "Manage",

    // CityGrid
    territoryMatrix: "Territory Grid Matrix (5x5)",
    plotsOccupied: "{count}/25 Plots Occupied",
    gridHint: "Click any plot to build or upgrade",
    emptyPlot: "Empty Plot",
    buildHint: "Build",

    // BuildModal
    modalTitle: "Construct New Building",
    modalSubtitle: "Select infrastructure for coordinate ({x}, {y})",
    tabAll: "ALL",
    tabResidential: "RESIDENTIAL",
    tabCommercial: "COMMERCIAL",
    providesResidents: "Provides Housing: +{count} citizens",
    requiresWorkers: "Requires Workforce: {count} workers",
    generatesIncome: "Generates: +{income}/sec",
    constructButton: "Construct for {cost}",
    insufficientFunds: "Insufficient Funds",
    buildingProgress: "Constructing...",

    // UpgradeModal
    upgradeTitle: "Upgrade Infrastructure",
    currentLevel: "Current Level: {level}",
    nextLevel: "Next Level: {level}",
    residentsBoost: "Housing Capacity",
    incomeBoost: "Revenue Output",
    workersReq: "Required Workforce",
    upgradeButton: "Upgrade for {cost}",
    upgrading: "Upgrading...",

    // OfflineModal
    offlineTitle: "Metropolis Offline Yield",
    offlineDesc: "While you were away, commercial enterprises continued generating revenue",
    timeAccumulated: "Time Accumulated: {time}",
    cappedWarning: "Earnings reached the 24-hour security cap",
    claimButton: "Collect Revenue & Resume Operations",

    // BridgeDashboard
    allianceTitle: "Tourism Bridges Alliance",
    allianceSubtitle: "Link borders with peer mayors: each bridge grants a permanent +5% global boost (Max 9)",
    activeBridgesCount: "Active Bridges: {count}/9",
    currentBonus: "Current Global Bonus: +{percent}%",
    tabActive: "Active Bridges",
    tabIncoming: "Incoming Requests",
    tabOutgoing: "Sent Requests",
    proposeNewBridge: "Propose New Tourism Bridge",
    enterMayorUsername: "Enter mayor username...",
    sendRequest: "Send Proposal",
    sending: "Sending...",
    accept: "Accept",
    reject: "Reject",
    breakBridge: "Break Bridge",
    noActiveBridges: "No active bridges. Propose a bridge to a fellow mayor!",
    noIncomingRequests: "No incoming bridge requests",
    noOutgoingRequests: "No pending outgoing requests",

    // Leaderboard
    returnToCity: "Return to City Console",
    globalLeaderboards: "Global Leaderboards",
    hallOfFame: "Metropolis Hall of Fame",
    hallSubtitle: "Compete with the wealthiest city governors and largest population centers worldwide.",
    tabTopEarners: "Top Earners ($/sec)",
    tabMegapolises: "Megapolises (Population)",
    colRank: "Rank",
    colMayor: "Mayor & Metropolis",
    colIncome: "Revenue Rate",
    colPopulation: "Population",
    colTreasury: "Treasury",
    colBridges: "Bridges",

    // Buildings
    buildings: {
      RESIDENTIAL_SMALL: {
        name: "Cozy Suburb",
        description: "Affordable housing for new citizens moving into your city.",
      },
      RESIDENTIAL_TOWER: {
        name: "Skyline Condo",
        description: "High-density residential complex housing a massive workforce.",
      },
      COMMERCIAL_SHOP: {
        name: "Neon Convenience",
        description: "Local shop generating steady income. Requires 5 workers.",
      },
      COMMERCIAL_MALL: {
        name: "Cyber Metropolis Mall",
        description: "Thriving commercial center. Requires 30 workers.",
      },
      COMMERCIAL_OFFICE: {
        name: "Apex Tech Tower",
        description: "State-of-the-art corporate hub with huge returns. Requires 90 workers.",
      },
    } as Record<string, BuildingTranslation>,
  },
};

export type TranslationKey = keyof (typeof translations)["en"];
