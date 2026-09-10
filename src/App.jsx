import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft, ArrowRight, Check, Users, Timer, Eye, Trophy, RotateCcw, Undo2,
  Eraser, Pencil, Moon, Sun, Plus, Minus, X, Languages, Home, Shuffle, Sparkles,
} from "lucide-react";
import { supabase, supabaseConfigured } from "./lib/supabase";

// ---------------------------------------------------------------------------
// Data: the 105 secret locations, in Kurdish (Sorani) and English
// ---------------------------------------------------------------------------
const LOCATIONS = {
  ckb: [
    ["فڕۆکەخانە", "✈️"], ["بانک", "🏦"], ["نەخۆشخانە", "🏥"], ["قوتابخانە", "🏫"],
    ["چێشتخانە", "🍽️"], ["مزگەوت", "🕌"], ["بازاڕ", "🛒"], ["هوتێل", "🏨"],
    ["کەشتی", "🚢"], ["یاریگای وەرزشی", "⚽"], ["شانۆ", "🎭"], ["مۆزەخانە", "🏛️"],
    ["پارکی گشتی", "🌳"], ["پۆلیسخانە", "🚓"], ["ڕێگای گەورە", "🛣️"], ["کتێبخانە", "📚"],
    ["سینەما", "🎬"], ["دوکانی ئەلیکترۆنی", "🛠️"], ["کارگە", "🏭"], ["شەمەندەفەر", "🚆"],
    ["زانکۆ", "🎓"], ["شوێنی پشوودانی هاوین", "🏔️"], ["ستۆدیۆی تەلەفزیۆن", "📺"], ["مۆڵ", "🛍️"],
    ["کافێ", "☕"], ["شارێکی جوان", "🏙️"], ["بەندیخانە", "🚔"], ["گەڕەکی کۆن", "🏚️"],
    ["کڵێسا", "⛪"], ["ڕووبار", "🌊"], ["چیای بەرز", "⛰️"], ["پۆمپەبەنزین", "⛽"],
    ["ئاگرکوژێنەوە", "🚒"], ["کۆنسێرت", "🎼"], ["باخچەی ئاژەڵان", "🦁"], ["مانگی دەستکرد", "🛰️"],
    ["ئەشکەوت", "🗿"], ["کەناری دەریا", "🏖️"], ["ژێر پردی بازاڕ", "🐪"], ["ستۆدیۆی مۆسیقا", "🎧"],
    ["دەرمانخانە", "💊"], ["ددانساز", "💒"], ["ئاهەنگی لەدایکبوون", "🎂"], ["شوێنی کاراتێ", "🥋"],
    ["ماڵی پەری", "👻"], ["نانەواخانە", "🥖"], ["دوکانی بەستەنی", "🍦"], ["شاری یاری", "🎡"],
    ["دوکانی کامێرا", "📸"], ["چێشتلێنەر", "👨‍🍳"], ["ستۆدیۆی یۆگا", "🧘"], ["سەلمانی", "💇"],
    ["وێستگەی پاس", "🚇"], ["سەنتەری یاری", "🎮"], ["جادووگەر", "🎩"], ["فاست فوود", "🍕"],
    ["دوکانی ئاژەڵی ماڵی", "🐶"], ["مەیدانی سکەیت", "⛸️"], ["بینینی بۆشایی نامۆ", "🛸"], ["ستۆدیۆی تاتۆ", "🖋️"],
    ["فەرمانگەی گومرگ", "🛃"], ["حەمام", "🧖"], ["شەوی یەڵدا", "🕯️"], ["سیرک", "🎪"],
    ["ڕۆبۆت", "🤖"], ["جەژن", "🎊"], ["ڕەمەزان", "🌙"], ["ئیفتاری ڕەمەزان", "🍽️"],
    ["نەورۆز", "🔥"], ["بەیانی جەژن", "🤝"], ["جەژنی قوربان", "🐐"], ["شەوی ساڵی نوێ", "🎆"],
    ["بەهار", "🌷"], ["هاوین", "☀️"], ["پاییز", "🍂"], ["زستان", "❄️"],
    ["شەوی یەڵدا (چا)", "🫖"], ["شوێنی بیناسازی", "🏗️"], ["کارگەی دەرزیکردن", "🧵"], ["تاقیگەی کیمیا", "🧪"],
    ["ئۆفیسی هەواڵ", "📰"], ["کێڵگە", "🚜"], ["دوکانی چاککردنەوەی کاتژمێر", "⏰"], ["گەیاندنی ئۆنلاین", "🛵"],
    ["دوکانی چاککردنەوەی مۆبایل", "📱"], ["تیک تۆک", "📲"], ["کارگەی شۆکولاتە", "🍫"], ["دوکانی جلوبەرگی شانۆیی", "🎭"],
    ["جەژنی بزن", "🐐"], ["یوتیوبەر", "🎥"], ["دوکانی شیرینی", "🥐"], ["شوێنی یاری مومکین", "🧩"],
    ["کارگەی بەستەنی", "🍨"], ["ڕیکلامی تەلەفزیۆن", "📺"], ["دوکانی ئامێری مۆسیقای کۆن", "📻"], ["یانەی وەرزشی", "🦾"],
    ["دوکانی پێداویستی ماڵ", "🥄"], ["گۆرانیبێژی کۆن", "🎤"], ["قوتابیی خەوالوو", "😴"], ["یانەی هەڵگرتنی کێش", "🏋️"],
    ["دوکانی جلوبەرگی ژنان", "👗"], ["وانەی چێشتلێنان", "🍳"], ["کارگەی شیرینی", "🧁"], ["فیلمی ترسناک", "🍿"],
    ["بۆمبی ئەتۆمی", "🌍"],
  ],
  en: [
    ["Airport", "✈️"], ["Bank", "🏦"], ["Hospital", "🏥"], ["School", "🏫"],
    ["Restaurant", "🍽️"], ["Mosque", "🕌"], ["Market", "🛒"], ["Hotel", "🏨"],
    ["Ship", "🚢"], ["Sports Club", "⚽"], ["Theater", "🎭"], ["Museum", "🏛️"],
    ["Public Park", "🌳"], ["Police Station", "🚓"], ["Highway", "🛣️"], ["Library", "📚"],
    ["Cinema", "🎬"], ["Electronics Shop", "🛠️"], ["Factory", "🏭"], ["Train", "🚆"],
    ["University", "🎓"], ["Summer Resort", "🏔️"], ["TV Studio", "📺"], ["Mall", "🛍️"],
    ["Café", "☕"], ["Beautiful City", "🏙️"], ["Prison", "🚔"], ["Old Neighborhood", "🏚️"],
    ["Church", "⛪"], ["River", "🌊"], ["High Mountain", "⛰️"], ["Gas Station", "⛽"],
    ["Fire Station", "🚒"], ["Concert", "🎼"], ["Zoo", "🦁"], ["Artificial Moon", "🛰️"],
    ["Cave", "🗿"], ["Beach", "🏖️"], ["Under the Bazaar Bridge", "🐪"], ["Music Studio", "🎧"],
    ["Pharmacy", "💊"], ["Dentist", "💒"], ["Birthday Party", "🎂"], ["Karate Place", "🥋"],
    ["Haunted House", "👻"], ["Bakery", "🥖"], ["Ice Cream Shop", "🍦"], ["Amusement Park", "🎡"],
    ["Camera Shop", "📸"], ["Chef / Kitchen", "👨‍🍳"], ["Yoga Studio", "🧘"], ["Barber Shop", "💇"],
    ["Bus Stop", "🚇"], ["Game Center", "🎮"], ["Magician", "🎩"], ["Fast Food", "🍕"],
    ["Pet Shop", "🐶"], ["Skating Rink", "⛸️"], ["UFO Sighting", "🛸"], ["Tattoo Studio", "🖋️"],
    ["Customs Office", "🛃"], ["Spa / Bathhouse", "🧖"], ["Yalda Night", "🕯️"], ["Circus", "🎪"],
    ["Robot", "🤖"], ["Holiday / Festival", "🎊"], ["Ramadan", "🌙"], ["Ramadan Iftar", "🍽️"],
    ["Newroz", "🔥"], ["Eid Morning", "🤝"], ["Eid Sacrifice", "🐐"], ["New Year's Eve", "🎆"],
    ["Spring", "🌷"], ["Summer", "☀️"], ["Autumn", "🍂"], ["Winter", "❄️"],
    ["Yalda Night (Tea)", "🫖"], ["Construction Site", "🏗️"], ["Sewing Workshop", "🧵"], ["Chemistry Lab", "🧪"],
    ["News Office", "📰"], ["Farm", "🚜"], ["Watch Repair Shop", "⏰"], ["Online Delivery", "🛵"],
    ["Mobile Repair Shop", "📱"], ["TikTok", "📲"], ["Chocolate Factory", "🍫"], ["Costume Shop", "🎭"],
    ["Goat Festival", "🐐"], ["YouTuber", "🎥"], ["Simit / Pastry Shop", "🥐"], ["Puzzle Place", "🧩"],
    ["Ice Cream Factory", "🍨"], ["TV Commercial", "📺"], ["Old Music Instruments Shop", "📻"], ["Gym", "🦾"],
    ["Home Supplies Shop", "🥄"], ["Old Singer", "🎤"], ["Sleepy Student", "😴"], ["Weightlifting Gym", "🏋️"],
    ["Women's Clothing Shop", "👗"], ["Cooking Class", "🍳"], ["Pastry Factory", "🧁"], ["Horror Movie", "🍿"],
    ["Atomic Bomb", "🌍"],
  ],
};

// A broad category per location (same order/index as LOCATIONS.en / LOCATIONS.ckb),
// used to give the Spy a vague clue in Pass & Play mode — not the topic itself,
// just enough that a sharp spy has a fighting chance.
const CATEGORY_OF = [
  "transport", "shopping", "health", "education", "food", "religion", "shopping", "transport", "transport", "fitness",
  "entertainment", "entertainment", "nature", "safety", "transport", "education", "entertainment", "shopping", "industry", "transport",
  "education", "nature", "media", "shopping", "food", "nature", "safety", "home", "religion", "nature",
  "nature", "transport", "safety", "entertainment", "entertainment", "media", "nature", "nature", "shopping", "arts",
  "health", "health", "home", "fitness", "entertainment", "food", "food", "entertainment", "shopping", "food",
  "fitness", "personalcare", "transport", "entertainment", "entertainment", "food", "shopping", "entertainment", "media", "personalcare",
  "transport", "personalcare", "festival", "entertainment", "media", "festival", "festival", "festival", "festival", "festival",
  "festival", "festival", "festival", "festival", "festival", "festival", "festival", "industry", "industry", "industry",
  "media", "nature", "shopping", "transport", "shopping", "media", "food", "shopping", "festival", "media",
  "food", "entertainment", "food", "media", "arts", "fitness", "shopping", "arts", "education", "fitness",
  "shopping", "food", "food", "entertainment", "media",
];

const CATEGORY_HINTS = {
  ckb: {
    transport: "شوێنێکە پەیوەندی بە گواستنەوە و گەشتەوە هەیە.",
    health: "شوێنێکە پەیوەندی بە تەندروستی و چاودێرییەوە هەیە.",
    education: "شوێنێکە پەیوەندی بە فێربوون و خوێندنەوە هەیە.",
    food: "شوێنێکە پەیوەندی بە خواردن و خواردنەوەوە هەیە.",
    religion: "شوێنێکی ئایینییە.",
    shopping: "شوێنێکە بۆ کڕین و فرۆشتن.",
    industry: "شوێنێکە پەیوەندی بە کار و بەرهەمهێنانەوە هەیە.",
    safety: "شوێنێکە پەیوەندی بە یاسا و ئاسایشەوە هەیە.",
    entertainment: "شوێنێکە بۆ کاتبەسەربردن و خۆشی.",
    nature: "شوێنێکی سروشتییە، لە دەرەوە.",
    media: "شوێنێکە پەیوەندی بە میدیا یان تەکنەلۆژیاوە هەیە.",
    arts: "شوێنێکە پەیوەندی بە هونەر و مۆسیقاوە هەیە.",
    fitness: "شوێنێکە بۆ وەرزش و بەهێزکردنی لەش.",
    personalcare: "شوێنێکە بۆ خۆڕازاندنەوە و چاودێری تاکەکەسی.",
    festival: "کاتێکی تایبەت یان جەژنە لە ساڵدا.",
    home: "پەیوەندی بە ژیانی ماڵەوە و خێزانەوە هەیە.",
  },
  en: {
    transport: "Somewhere connected to travel or transport.",
    health: "Somewhere connected to health and care.",
    education: "Somewhere connected to learning.",
    food: "Somewhere connected to food or drink.",
    religion: "A place of worship.",
    shopping: "Somewhere for buying or selling things.",
    industry: "Somewhere connected to work or production.",
    safety: "Somewhere connected to safety or law.",
    entertainment: "Somewhere for fun or entertainment.",
    nature: "A natural, outdoor place.",
    media: "Somewhere connected to media or technology.",
    arts: "Somewhere connected to art or music.",
    fitness: "Somewhere for sport or exercise.",
    personalcare: "Somewhere for personal care or grooming.",
    festival: "A special time or celebration of the year.",
    home: "Connected to home or family life.",
  },
};

// ---------------------------------------------------------------------------
// UI text, in Kurdish (Sorani) and English
// ---------------------------------------------------------------------------
const T = {
  ckb: {
    dir: "rtl",
    appTitle: "بیدۆزەرەوە",
    tagline: "یاریەکی کۆمەڵایەتیی وێنەکێشانە. هەموو یاریزانان شوێنێکی نهێنی دەبینن جگە لە یەک کەس کە دزیارەکەیە — کاتژمێرێک بۆ وێنەکێشان، نۆرە بە خۆکاری دەگوازرێتەوە. دزیارەکەیش دەبێت خۆی بشارێتەوە.",
    modeLabel: "دۆخی یاری",
    modeClassicTitle: "دەست بەدەست",
    modeClassicDesc: "هەر یاریزان بە تەنها وێنەی خۆی دەکێشێت.",
    modeRelayTitle: "تەختەی هاوبەش",
    modeRelayDesc: "یەک تەختە، هەموویان بەیەکەوە وێنە دەکێشن.",
    playerCount: (n) => `ژمارەی یاریزانان: ${n}`,
    turnsPerPlayer: (n) => `ژمارەی نۆرە بۆ هەر یاریزان: ${n}`,
    totalLines: (n) => `کۆی هێڵەکان: ${n}`,
    namesLabel: "ناوی یاریزانەکان",
    randomizeAllBtn: "هەموو بگۆڕە",
    namePlaceholder: (i) => `ناوی یاریزانی ${i}`,
    boardLabel: "تەختەی وێنەکێشان",
    boardWhite: "تەختەی سپی",
    boardBlack: "تەختەی ڕەش",
    timerLabel: "کاتژمێری وێنەکێشان",
    timerOff: "کوژاوە",
    timerUnit: "چ",
    startBtn: "دەستپێکردن",
    startWarning: "کەمترین ٣ یاریزان پێویستە بۆ دەستپێکردن.",
    namesHint: "ئەگەر ناوێک بەتاڵ بێت یان دیسی 🎲 دابگرێت، ناوێکی گاڵتەجاری بۆ دەبڕدرێت.",
    passDeviceLabel: "مۆبایل بدە بە",
    playerOfTotal: (i, n) => `یاریزانی ${i} لە ${n} — کەسی تر نابێت ئەم شاشەیە ببینێت.`,
    tapReveal: "دەست لێبدە بۆ بینینی نهێنیەکەت",
    youAreSpy: "تۆ دزیارەکەیت",
    spyHint: "بە وردی سەیری وێنەکان بکە و خۆت بشارەوە.",
    spyClueLabel: "کلیلی گشتی بۆ تۆ",
    locationHint: "کلیلێک وێنا بکە — بۆ هاوڕێکانت ڕوون بێت، بۆ دزیارەکە تێکەڵ بێت.",
    gotItReady: "تێگەیشتم، ئامادەم",
    classicDrawIntro: "وێنە تایبەتیەکەت بکێشە.",
    relayDrawIntro: "تۆ تەنها یەک هێڵ زیاد دەکەیت بۆ تەختەی هاوبەش.",
    startDrawingBtn: (name) => `من ${name}م، دەست بە وێنەکێشان دەکەم`,
    reminderSpy: "🕵️ تۆ دزیارەکەیت",
    submitDrawing: "ناردنی وێنە",
    relayStrokeHint: "یەک هێڵ بکێشە — کاتێک پەنجەت هەڵدەگریت، نۆرە بەخۆکاری بۆ یاریزانی داهاتوو دەگوازرێتەوە.",
    lineLabel: "هێڵ",
    turnLabel: "نۆرەی",
    homeBtn: "سەرەکی",
    galleryLabel: "پێشانگا",
    galleryTitle: "سەیری وێنەکان بکە",
    gallerySubtitle: "مۆبایلەکە بگوازەوە و باسی بکەن — دواتر دەنگ بدەن بۆ دزیارەکە.",
    sharedBoardLabel: "تەختەی هاوبەش",
    turnOrderLabel: "ڕیزبەندی نۆرەکان:",
    startVotingBtn: "دەستپێکردنی دەنگدان",
    whoIsSpy: "پێت وایە کێ دزیارەکەیە؟",
    roundResult: (n) => `ئەنجامی خولی ${n}`,
    playersWin: "یاریزانەکان بردیانەوە!",
    spyWins: "دزیارەکە بردیەوە!",
    locationWasLabel: "شوێنەکە ئەمە بوو",
    spyWasLabel: "دزیارەکە ئەمە بوو",
    votesLabel: "دەنگەکان",
    playAgainBtn: "دووبارە یاریکردن، هەمان یاریزان",
    newGameBtn: "یاریەکی نوێ",
    playerDefault: (i) => `یاریزانی ${i}`,
    langToggle: "English",
    // -- online --
    menuTitle: "بیدۆزەرەوە",
    playOfflineTitle: "یاری لەسەر یەک مۆبایل",
    playOfflineDesc: "مۆبایلەکە بگۆڕنەوە نێوان یاریزانان.",
    playOnlineTitle: "یاری ئۆنلاین",
    playOnlineDesc: "هەر یاریزان مۆبایلی خۆی بەکاردەهێنێت.",
    createRoomBtn: "دروستکردنی ژوور",
    joinRoomBtn: "چوونە ژوورێک",
    yourNameLabel: "ناوت",
    yourNamePlaceholder: "ناوت بنووسە",
    enterCodeLabel: "کۆدی ژوور",
    codePlaceholder: "بۆ نموونە X7K9",
    createBtn: "دروستکردن",
    joinBtn: "چوونەژوورەوە",
    netBack: "گەڕانەوە",
    roomCodeLabel: "کۆدی ژوورەکەت",
    shareCodeHint: "ئەم کۆدە بدە بە هاوڕێکانت بۆ چوونە ژوورەوە.",
    lobbyPlayersLabel: (n) => `یاریزانان (${n})`,
    lobbyWaitingHost: "چاوەڕوانی دەستپێکردنی خاوەنی ژوور بە.",
    startOnlineBtn: "دەستپێکردنی یاری",
    notEnoughOnline: "کەمترین ٣ یاریزان پێویستە.",
    roomNotFound: "ژوورێک بەم کۆدە نەدۆزرایەوە.",
    roomAlreadyStarted: "ئەم یاریە پێشتر دەستی پێکردووە.",
    roomFull: "ژوورەکە پڕە.",
    missingStorage: "پەیوەندی بە داتابەیسەوە ڕێکنەخراوە. تکایە کلیلەکانی Supabase زیاد بکە.",
    readyBtn: "ئامادەم",
    waitingReady: (x, n) => `چاوەڕوانی ئامادەبوون... (${x}/${n})`,
    waitingSubmit: (x, n) => `چاوەڕوانی وێنەکان... (${x}/${n})`,
    waitingVotes: (x, n) => `چاوەڕوانی دەنگەکان... (${x}/${n})`,
    yourTurnLabel: "نۆرەی تۆیە",
    waitingTurnOf: (name) => `چاوەڕوانی ${name}`,
    leaveRoomBtn: "بەجێهێشتنی ژوور",
    hostOnlyNote: "تەنها خاوەنی ژوور دەتوانێت ڕێکخستنەکان بگۆڕێت.",
  },
  en: {
    dir: "ltr",
    appTitle: "Bidozerawa",
    tagline: "A social drawing party game. Everyone sees a secret location except one person — the Spy. Draw a clue, keep the timer in mind, and figure out who's hiding among you.",
    modeLabel: "Game Mode",
    modeClassicTitle: "Pass & Play",
    modeClassicDesc: "Each player draws their own private sketch.",
    modeRelayTitle: "Shared Board",
    modeRelayDesc: "One canvas — everyone draws on it together.",
    playerCount: (n) => `Players: ${n}`,
    turnsPerPlayer: (n) => `Turns per player: ${n}`,
    totalLines: (n) => `Total lines: ${n}`,
    namesLabel: "Player names",
    randomizeAllBtn: "Shuffle all",
    namePlaceholder: (i) => `Player ${i} name`,
    boardLabel: "Drawing board",
    boardWhite: "Light board",
    boardBlack: "Dark board",
    timerLabel: "Drawing timer",
    timerOff: "Off",
    timerUnit: "s",
    startBtn: "Start Game",
    startWarning: "Need at least 3 players to start.",
    namesHint: "Leave a name blank, or tap 🎲, and we'll assign a funny one.",
    passDeviceLabel: "Pass the device to",
    playerOfTotal: (i, n) => `Player ${i} of ${n} — no one else should see this screen.`,
    tapReveal: "Tap to reveal your secret",
    youAreSpy: "You are the Spy",
    spyHint: "Watch the drawings closely and blend in.",
    spyClueLabel: "A general clue, for you",
    locationHint: "Draw a clue — clear to allies, vague to the spy.",
    gotItReady: "Got it, I'm ready",
    classicDrawIntro: "Draw your private sketch.",
    relayDrawIntro: "You'll add exactly one stroke to the shared board.",
    startDrawingBtn: (name) => `I'm ${name}, start drawing`,
    reminderSpy: "🕵️ You are the Spy",
    submitDrawing: "Submit drawing",
    relayStrokeHint: "Draw one line — lifting your finger passes the turn to the next player automatically.",
    lineLabel: "Line",
    turnLabel: "Turn",
    homeBtn: "Home",
    galleryLabel: "Gallery",
    galleryTitle: "Study the drawings",
    gallerySubtitle: "Pass the device around and talk it over — then vote for the spy.",
    sharedBoardLabel: "Shared board",
    turnOrderLabel: "Turn order:",
    startVotingBtn: "Start voting",
    whoIsSpy: "Who do you think is the spy?",
    roundResult: (n) => `Round ${n} result`,
    playersWin: "Players win!",
    spyWins: "The Spy wins!",
    locationWasLabel: "The location was",
    spyWasLabel: "The spy was",
    votesLabel: "Votes",
    playAgainBtn: "Play again, same players",
    newGameBtn: "New game",
    playerDefault: (i) => `Player ${i}`,
    langToggle: "کوردی",
    // -- online --
    menuTitle: "Bidozerawa",
    playOfflineTitle: "Play on one device",
    playOfflineDesc: "Pass the phone between players.",
    playOnlineTitle: "Play online",
    playOnlineDesc: "Everyone uses their own phone.",
    createRoomBtn: "Create a room",
    joinRoomBtn: "Join a room",
    yourNameLabel: "Your name",
    yourNamePlaceholder: "Type your name",
    enterCodeLabel: "Room code",
    codePlaceholder: "e.g. X7K9",
    createBtn: "Create",
    joinBtn: "Join",
    netBack: "Back",
    roomCodeLabel: "Your room code",
    shareCodeHint: "Share this code with friends so they can join.",
    lobbyPlayersLabel: (n) => `Players (${n})`,
    lobbyWaitingHost: "Waiting for the host to start.",
    startOnlineBtn: "Start Game",
    notEnoughOnline: "Need at least 3 players.",
    roomNotFound: "No room found with that code.",
    roomAlreadyStarted: "That game has already started.",
    roomFull: "That room is full.",
    missingStorage: "Database isn't configured. Add your Supabase keys to get online play working.",
    readyBtn: "I'm ready",
    waitingReady: (x, n) => `Waiting for everyone... (${x}/${n})`,
    waitingSubmit: (x, n) => `Waiting for drawings... (${x}/${n})`,
    waitingVotes: (x, n) => `Waiting for votes... (${x}/${n})`,
    yourTurnLabel: "Your turn",
    waitingTurnOf: (name) => `Waiting for ${name}`,
    leaveRoomBtn: "Leave room",
    hostOnlyNote: "Only the host can change these settings.",
  },
};

const TIMER_OPTIONS = [0, 30, 60, 90, 120, 180];
const PEN_COLORS = ["#F3EFE6", "#F5B426", "#52C9BD", "#E1594F", "#8C8CF0", "#2EC4B6", "#F2C14E", "#14111F"];
const BRUSH_SIZES = [4, 9, 16];
// fixed colors for the first four players; anyone beyond that gets a
// randomly assigned color (picked once per game, stays consistent)
const FIXED_PLAYER_COLORS = ["#2F80ED", "#EB5757", "#27AE60", "#F2C14E"]; // blue, red, green, yellow
const RANDOM_COLOR_POOL = ["#9B51E0", "#F2994A", "#56CCF2", "#F471B5", "#6EE7B7", "#F5B426"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildPlayerColors(count) {
  const colors = FIXED_PLAYER_COLORS.slice(0, count);
  const extra = count - FIXED_PLAYER_COLORS.length;
  if (extra > 0) {
    const pool = shuffle(RANDOM_COLOR_POOL);
    for (let i = 0; i < extra; i++) colors.push(pool[i % pool.length]);
  }
  return colors;
}

// Funny placeholder names for players who don't want to type their own
const FUNNY_NAMES = {
  ckb: [
    "گورگی خەوالوو", "پشیلەی فێڵباز", "ڕێوی بەپەلە", "کەروێشکی نهێنی", "شێری بەستەنی",
    "فیلی بچووک", "مۆرچەی پاڵەوان", "باڵندەی شاد", "پشیلەی پیتزا", "گورگی نینجا",
    "ڕۆویی خەوالوو", "کەروێشکی خێرا", "شێری نهێنی", "فیلی گەورە", "پشیلەی پاشا",
    "باڵندەی سەیارە", "مۆرچەی بچووک", "گورگی پاڵەوان", "کەروێشکی شاد", "ڕێوی پاشا",
  ],
  en: [
    "Sleepy Wolf", "Ninja Cat", "Pizza King", "Agent Fox", "Donut Prince",
    "Sneaky Rabbit", "Ice-Cream Lion", "Tiny Elephant", "Hero Ant", "Happy Bird",
    "Captain Noodle", "Disco Llama", "Turbo Turtle", "Grumpy Panda", "Mystery Otter",
    "Waffle Wizard", "Sir Snacksalot", "Doctor Doodle", "Agent Pancake", "Count Chuckle",
  ],
};

function pickFunnyName(lang, usedNames) {
  const pool = FUNNY_NAMES[lang];
  const available = pool.filter((n) => !usedNames.includes(n));
  if (available.length > 0) return available[rand(available.length)];
  // pool exhausted — add a number so it's still unique-ish
  return `${pool[rand(pool.length)]} ${rand(90) + 10}`;
}

function rand(n) { return Math.floor(Math.random() * n); }

// ---------------------------------------------------------------------------
// Online rooms: stored as shared key/value data so every player's device can
// read and write the same room state (polled every ~1.5s, last-write-wins).
// ---------------------------------------------------------------------------
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
function genRoomCode() {
  let c = "";
  for (let i = 0; i < 4; i++) c += ROOM_CODE_CHARS[rand(ROOM_CODE_CHARS.length)];
  return c;
}

async function loadRoom(code) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("rooms").select("data").eq("code", code).maybeSingle();
    if (error || !data) return null;
    return data.data;
  } catch (e) {
    return null;
  }
}
async function saveRoom(obj) {
  obj.updatedAt = Date.now();
  if (!supabase) return obj;
  try {
    await supabase.from("rooms").upsert({ code: obj.code, data: obj, updated_at: new Date().toISOString() });
  } catch (e) {
    // best-effort — the optimistic local state still reflects the action
  }
  return obj;
}
function makeRoom(code, hostId, hostName) {
  return {
    code, hostId,
    mode: "classic", boardColor: "dark", timerSec: 60, turnsPerPlayer: 3,
    players: [{ id: hostId, name: hostName }],
    phase: "lobby", round: 1,
    spyIndex: null, locIndex: null, playerColors: [],
    readyIds: [], drawerIdx: 0, turnsTaken: 0,
    drawings: {}, relayCanvas: null, relayLog: [],
    votes: {},
  };
}
function netTally(playersArr, votesObj, spyId) {
  const counts = {};
  playersArr.forEach((p) => { counts[p.id] = 0; });
  Object.values(votesObj || {}).forEach((targetId) => {
    if (counts[targetId] !== undefined) counts[targetId]++;
  });
  const max = Math.max(0, ...Object.values(counts));
  const top = Object.keys(counts).filter((id) => counts[id] === max);
  const spyCaught = max > 0 && top.length === 1 && top[0] === spyId;
  return { counts, spyCaught };
}

// ---------------------------------------------------------------------------
export default function App() {
  // ---- language ----
  const [lang, setLang] = useState("ckb"); // ckb | en
  const s = T[lang];
  const dir = s.dir;
  const ForwardIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const locs = LOCATIONS[lang];

  // ---- top-level: offline (this device) vs online (room code) ----
  const [appMode, setAppMode] = useState("menu"); // menu | offline | online

  // ---- online ----
  const [myId] = useState(() => "p" + Math.random().toString(36).slice(2, 9));
  const [myName, setMyName] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [netScreen, setNetScreen] = useState("landing"); // landing | create | join | (then mirrors room.phase)
  const [room, setRoom] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [netError, setNetError] = useState("");
  const [netBusy, setNetBusy] = useState(false);
  const [netRevealFlipped, setNetRevealFlipped] = useState(false);
  const [storageMissing, setStorageMissing] = useState(false);
  const [netTimeLeft, setNetTimeLeft] = useState(0);
  const lastLocalWriteRef = useRef(0); // guards against stale polls right after our own write
  const roomRef = useRef(null); // always the latest room, for use inside timers/closures
  roomRef.current = room;

  const netCanvasRef = useRef(null);
  const netCtxRef = useRef(null);
  const netDrawingRef = useRef(false);
  const netLastPointRef = useRef({ x: 0, y: 0 });
  const netHistoryRef = useRef([]);

  // ---- setup ----
  const [mode, setMode] = useState("classic"); // classic | relay
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [turnsPerPlayer, setTurnsPerPlayer] = useState(3);
  const [boardColor, setBoardColor] = useState("dark"); // dark | light
  const [timerSec, setTimerSec] = useState(60);

  // ---- game flow ----
  const [phase, setPhase] = useState("setup"); // setup | reveal | draw | gallery | vote | end
  const [round, setRound] = useState(1);
  const [spyIndex, setSpyIndex] = useState(0);
  const [locIndex, setLocIndex] = useState(0);
  const [playerColors, setPlayerColors] = useState([]); // assigned at game start
  const spyClue = CATEGORY_HINTS[lang][CATEGORY_OF[locIndex]];

  // ---- reveal ----
  const [revealIdx, setRevealIdx] = useState(0);
  const [revealFlipped, setRevealFlipped] = useState(false);

  // ---- draw ----
  const [drawerIdx, setDrawerIdx] = useState(0);
  const [turnsTaken, setTurnsTaken] = useState(0); // relay only
  const [turnStarted, setTurnStarted] = useState(false);
  const [drawings, setDrawings] = useState({}); // classic: {idx: dataURL}
  const [relaySnapshots, setRelaySnapshots] = useState([]); // [{idx, dataURL}]
  const [timeLeft, setTimeLeft] = useState(0);
  const [penColor, setPenColor] = useState(PEN_COLORS[1]);
  const [penSize, setPenSize] = useState(BRUSH_SIZES[1]);
  const [eraser, setEraser] = useState(false);

  // ---- vote ----
  const [voterIdx, setVoterIdx] = useState(0);
  const [votes, setVotes] = useState({});

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const historyRef = useRef([]);
  const strokedThisTurnRef = useRef(false);

  const boardBg = boardColor === "dark" ? "#0C0A14" : "#FBF8F1";
  const totalRelayTurns = players.length * turnsPerPlayer;

  // ---- online: derived values from the synced room ----
  const netBoardBg = room ? (room.boardColor === "dark" ? "#0C0A14" : "#FBF8F1") : "#0C0A14";
  const netTotalRelayTurns = room ? room.players.length * room.turnsPerPlayer : 0;
  const myIdx = room ? room.players.findIndex((p) => p.id === myId) : -1;
  const isNetHost = room && room.hostId === myId;
  const netIsSpy = room && myIdx === room.spyIndex;
  const netDrawerId = room && room.players[room.drawerIdx] ? room.players[room.drawerIdx].id : null;
  const netIsMyTurn = room && room.mode === "relay" && netDrawerId === myId;

  // ------------------------------------------------------------------------
  // Online: subscribe to real-time changes on this room (Supabase Realtime)
  // instead of polling — near-instant sync between players.
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (appMode !== "online" || !roomCode) return;
    if (!supabaseConfigured || !supabase) {
      setStorageMissing(true);
      return;
    }
    let cancelled = false;

    const applyIncoming = (incomingObj) => {
      if (cancelled || !incomingObj) return;
      setRoom((cur) => {
        if (!cur) return incomingObj;
        const incoming = incomingObj.updatedAt || 0;
        const local = cur.updatedAt || 0;
        // Right after we write, an update that was already in flight can carry the
        // OLD room and snap our change back. Ignore anything older than what we have
        // during that short window.
        const justWrote = Date.now() - lastLocalWriteRef.current < 4000;
        if (justWrote && incoming < local) return cur;
        if (incoming === local) return cur; // unchanged — don't churn re-renders
        return incomingObj;
      });
    };

    const init = async () => {
      const r = await loadRoom(roomCode);
      applyIncoming(r);
    };
    init();

    const channel = supabase
      .channel(`room-${roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `code=eq.${roomCode}` },
        (payload) => applyIncoming(payload.new && payload.new.data)
      )
      .subscribe();

    // fallback safety-net poll in case a realtime event is ever missed
    const id = setInterval(init, 4000);

    return () => {
      cancelled = true;
      clearInterval(id);
      supabase.removeChannel(channel);
    };
  }, [appMode, roomCode]);

  // every local write goes through here so the realtime guard above knows about it
  function netSave(obj) {
    lastLocalWriteRef.current = Date.now();
    return saveRoom(obj);
  }

  // the room's phase is the single source of truth once everyone has joined
  useEffect(() => {
    if (room && room.phase) setNetScreen(room.phase);
  }, [room]);

  // host-only: auto-advance the phase once every player has reached the
  // milestone for the current phase (ready / submitted / voted). We check
  // against the room we already have from polling — no extra fetch — and
  // only hit the network (fresh read + write) when a transition is actually due.
  useEffect(() => {
    if (appMode !== "online" || !room || !isNetHost) return;
    const due =
      (room.phase === "reveal" && (room.readyIds || []).length >= room.players.length) ||
      (room.phase === "draw" && room.mode === "classic" && Object.keys(room.drawings || {}).length >= room.players.length) ||
      (room.phase === "draw" && room.mode === "relay" && room.turnsTaken >= room.players.length * room.turnsPerPlayer) ||
      (room.phase === "vote" && Object.keys(room.votes || {}).length >= room.players.length);
    if (!due) return;
    (async () => {
      const fresh = await loadRoom(roomCode);
      if (!fresh) return;
      if (fresh.phase === "reveal" && (fresh.readyIds || []).length >= fresh.players.length) {
        fresh.phase = "draw";
        await netSave(fresh);
      } else if (fresh.phase === "draw" && fresh.mode === "classic" && Object.keys(fresh.drawings || {}).length >= fresh.players.length) {
        fresh.phase = "gallery";
        await netSave(fresh);
      } else if (fresh.phase === "draw" && fresh.mode === "relay" && fresh.turnsTaken >= fresh.players.length * fresh.turnsPerPlayer) {
        fresh.phase = "gallery";
        await netSave(fresh);
      } else if (fresh.phase === "vote" && Object.keys(fresh.votes || {}).length >= fresh.players.length) {
        fresh.phase = "end";
        await netSave(fresh);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, isNetHost]);

  // net canvas: (re)initialize whenever it's relevant to draw — a fresh
  // private canvas each classic turn, or the live shared board on your relay turn
  useEffect(() => {
    if (appMode !== "online" || netScreen !== "draw" || !room) return;
    if (room.mode === "relay" && !netIsMyTurn) return;
    const raf = requestAnimationFrame(() => netSetupCanvas());
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode, netScreen, room && room.mode, room && room.drawerIdx, room && room.turnsTaken]);

  function netSetupCanvas() {
    const canvas = netCanvasRef.current;
    if (!canvas || !room) return;
    const rect = canvas.getBoundingClientRect();
    // capped DPR — online drawings travel over the network on every poll,
    // so we keep the backing store modest instead of full retina resolution
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = netBoardBg;
    ctx.fillRect(0, 0, rect.width, rect.height);
    netCtxRef.current = ctx;
    netHistoryRef.current = [];
    if (room.mode === "relay" && room.relayCanvas) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = room.relayCanvas;
    }
  }

  function netGetPos(e) {
    const canvas = netCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }
  function netPushHistory() {
    const canvas = netCanvasRef.current;
    const ctx = netCtxRef.current;
    if (!canvas || !ctx) return;
    netHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (netHistoryRef.current.length > 25) netHistoryRef.current.shift();
  }
  function netActiveColor() {
    if (room.mode === "relay") return (room.playerColors && room.playerColors[room.drawerIdx]) || FIXED_PLAYER_COLORS[0];
    return penColor;
  }
  function netHandlePointerDown(e) {
    e.preventDefault();
    const ctx = netCtxRef.current;
    if (!ctx) return;
    netPushHistory();
    netDrawingRef.current = true;
    const pos = netGetPos(e);
    netLastPointRef.current = pos;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.fillStyle = netActiveColor();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (eraser ? penSize * 1.6 : penSize) / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  function netHandlePointerMove(e) {
    if (!netDrawingRef.current) return;
    e.preventDefault();
    const ctx = netCtxRef.current;
    const pos = netGetPos(e);
    ctx.strokeStyle = netActiveColor();
    ctx.lineWidth = eraser ? penSize * 1.6 : penSize;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(netLastPointRef.current.x, netLastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    netLastPointRef.current = pos;
  }
  async function netHandlePointerUp(e) {
    if (!netDrawingRef.current) return;
    e.preventDefault();
    netDrawingRef.current = false;
    if (room.mode === "relay") await netFinishRelayTurn();
  }
  function netHandleUndo() {
    const ctx = netCtxRef.current;
    if (!ctx || netHistoryRef.current.length === 0) return;
    const prev = netHistoryRef.current.pop();
    ctx.putImageData(prev, 0, 0);
  }

  // ---- online drawing timer ----
  // Depends only on primitive values (not the room object), so a poll that
  // returns an identical room does NOT restart the countdown every second.
  const netMySubmitted = !!(room && room.drawings && room.drawings[myId] !== undefined);
  const netTimerActive =
    appMode === "online" && netScreen === "draw" && !!room && room.timerSec > 0 &&
    (room.mode === "relay" ? netIsMyTurn : !netMySubmitted);
  const netTimerKey = room ? `${room.mode}|${room.timerSec}|${room.drawerIdx}|${room.turnsTaken}|${room.round}` : "";

  useEffect(() => {
    if (!netTimerActive) { setNetTimeLeft(0); return; }
    setNetTimeLeft(room.timerSec);
    const id = setInterval(() => {
      setNetTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          netForceEndTurn();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netTimerActive, netTimerKey]);

  function netForceEndTurn() {
    const cur = roomRef.current;
    if (!cur) return;
    const myTurn = cur.mode === "relay" && cur.players[cur.drawerIdx] && cur.players[cur.drawerIdx].id === myId;
    const submitted = !!(cur.drawings && cur.drawings[myId] !== undefined);
    if (cur.mode === "relay") { if (myTurn) netFinishRelayTurn(); }
    else if (!submitted) netSubmitClassicDrawing();
  }

  async function netSubmitClassicDrawing() {
    const cur = roomRef.current;
    const canvas = netCanvasRef.current;
    if (!cur || !canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const merged = { ...cur, drawings: { ...(cur.drawings || {}), [myId]: dataURL } };
    setRoom(merged); // optimistic — show "waiting" instantly
    netSave(merged); // fire-and-forget; next poll reconciles for everyone else
  }

  async function netFinishRelayTurn() {
    const cur = roomRef.current;
    const canvas = netCanvasRef.current;
    if (!cur || !canvas) return;
    const dataURL = canvas.toDataURL("image/png");
    const turnsTaken = (cur.turnsTaken || 0) + 1;
    const merged = {
      ...cur,
      relayCanvas: dataURL,
      relayLog: [...(cur.relayLog || []), cur.players[cur.drawerIdx].id],
      turnsTaken,
      drawerIdx: turnsTaken % cur.players.length,
      phase: turnsTaken >= cur.players.length * cur.turnsPerPlayer ? "gallery" : cur.phase,
    };
    setRoom(merged); // optimistic — hand off the turn instantly
    setEraser(false);
    netSave(merged);
  }

  // ------------------------------------------------------------------------
  // Online: room actions (create / join / settings / ready / vote / restart)
  // ------------------------------------------------------------------------
  async function netCreateRoom() {
    if (!myName.trim()) return;
    if (!supabaseConfigured) { setStorageMissing(true); return; }
    setNetBusy(true);
    setNetError("");
    const code = genRoomCode();
    const obj = makeRoom(code, myId, myName.trim());
    setRoom(obj);
    setRoomCode(code);
    setNetScreen("lobby");
    setNetBusy(false);
    await netSave(obj);
  }

  async function netJoinRoom() {
    const code = joinCodeInput.trim().toUpperCase();
    if (!code || !myName.trim()) return;
    if (!supabaseConfigured) { setStorageMissing(true); return; }
    setNetBusy(true);
    setNetError("");
    const r = await loadRoom(code); // joining needs a fresh read — must see the real player list
    if (!r) { setNetError(s.roomNotFound); setNetBusy(false); return; }
    if (r.phase !== "lobby") { setNetError(s.roomAlreadyStarted); setNetBusy(false); return; }
    if (r.players.length >= 10 && !r.players.some((p) => p.id === myId)) { setNetError(s.roomFull); setNetBusy(false); return; }
    if (!r.players.some((p) => p.id === myId)) r.players.push({ id: myId, name: myName.trim() });
    setRoom(r);
    setRoomCode(code);
    setNetScreen("lobby");
    setNetBusy(false);
    netSave(r);
  }

  async function netUpdateSetting(patch) {
    if (!isNetHost || !room) return;
    const merged = { ...room, ...patch };
    setRoom(merged); // optimistic — the host is the only writer of these fields
    netSave(merged);
  }

  async function netStartGameOnline() {
    if (!isNetHost || !room || room.players.length < 3) return;
    const merged = {
      ...room,
      spyIndex: rand(room.players.length),
      locIndex: rand(locs.length),
      playerColors: buildPlayerColors(room.players.length),
      readyIds: [],
      drawerIdx: 0,
      turnsTaken: 0,
      drawings: {},
      relayCanvas: null,
      relayLog: [],
      votes: {},
      phase: "reveal",
    };
    setRoom(merged);
    setNetRevealFlipped(false);
    netSave(merged);
  }

  async function netToggleReady() {
    if (!room || (room.readyIds || []).includes(myId)) return;
    const merged = { ...room, readyIds: [...(room.readyIds || []), myId] };
    setRoom(merged); // optimistic
    netSave(merged);
  }

  async function netCastVote(targetId) {
    if (!room) return;
    const merged = { ...room, votes: { ...(room.votes || {}), [myId]: targetId } };
    setRoom(merged); // optimistic
    netSave(merged);
  }

  async function netPlayAgainOnline() {
    if (!isNetHost || !room) return;
    const merged = {
      ...room,
      round: (room.round || 1) + 1,
      spyIndex: rand(room.players.length),
      locIndex: rand(locs.length),
      playerColors: buildPlayerColors(room.players.length),
      readyIds: [],
      drawerIdx: 0,
      turnsTaken: 0,
      drawings: {},
      relayCanvas: null,
      relayLog: [],
      votes: {},
      phase: "reveal",
    };
    setRoom(merged);
    setNetRevealFlipped(false);
    netSave(merged);
  }

  function netLeaveRoom() {
    setRoom(null);
    setRoomCode("");
    setNetScreen("landing");
    setNetError("");
    setAppMode("menu");
  }

  // ------------------------------------------------------------------------
  // Canvas: every turn mounts a fresh <canvas>, so we (re)initialize it
  // completely each time, restoring the shared board in relay mode.
  // ------------------------------------------------------------------------
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctxRef.current = ctx;
    historyRef.current = [];
    if (mode === "relay" && relaySnapshots.length > 0) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = relaySnapshots[relaySnapshots.length - 1].dataURL;
    }
  }, [boardBg, mode, relaySnapshots]);

  useEffect(() => {
    if (appMode !== "offline" || phase !== "draw" || !turnStarted) return;
    const raf = requestAnimationFrame(() => {
      setupCanvas();
      strokedThisTurnRef.current = false;
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turnStarted, drawerIdx, turnsTaken]);

  // ------------------------------------------------------------------------
  // Timer
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (appMode !== "offline" || phase !== "draw" || !turnStarted || timerSec === 0) return;
    setTimeLeft(timerSec);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          forceEndTurn();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, turnStarted, drawerIdx, turnsTaken]);

  // ------------------------------------------------------------------------
  // Drawing handlers
  // ------------------------------------------------------------------------
  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function pushHistory() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 25) historyRef.current.shift();
  }

  function handlePointerDown(e) {
    e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;
    pushHistory();
    drawingRef.current = true;
    strokedThisTurnRef.current = true;
    const pos = getPos(e);
    lastPointRef.current = pos;
    const activeColor = mode === "relay" ? (playerColors[drawerIdx] || FIXED_PLAYER_COLORS[0]) : penColor;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (eraser ? penSize * 1.6 : penSize) / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function handlePointerMove(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const pos = getPos(e);
    const activeColor = mode === "relay" ? (playerColors[drawerIdx] || FIXED_PLAYER_COLORS[0]) : penColor;
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = eraser ? penSize * 1.6 : penSize;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPointRef.current = pos;
  }

  function handlePointerUp(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    drawingRef.current = false;
    if (mode === "relay") finishRelayTurn();
  }

  function handleUndo() {
    const ctx = ctxRef.current;
    if (!ctx || historyRef.current.length === 0) return;
    const prev = historyRef.current.pop();
    ctx.putImageData(prev, 0, 0);
  }

  // ------------------------------------------------------------------------
  // Turn progression
  // ------------------------------------------------------------------------
  function forceEndTurn() {
    if (mode === "classic") submitClassicDrawing();
    else finishRelayTurn();
  }

  function submitClassicDrawing() {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setDrawings((d) => ({ ...d, [drawerIdx]: dataURL }));
    const next = drawerIdx + 1;
    setTurnStarted(false);
    setEraser(false);
    setTimeLeft(0);
    if (next >= players.length) setPhase("gallery");
    else setDrawerIdx(next);
  }

  function finishRelayTurn() {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setRelaySnapshots((sn) => [...sn, { idx: drawerIdx, dataURL }]);
    const nextCount = turnsTaken + 1;
    setTimeLeft(0);
    setTurnsTaken(nextCount);
    if (nextCount >= totalRelayTurns) setPhase("gallery");
    else setDrawerIdx(nextCount % players.length);
    // relay mode stays continuous — turnStarted remains true, no pass-device interstitial
  }

  function beginTurn() {
    setTurnStarted(true);
  }

  // ------------------------------------------------------------------------
  // Setup helpers
  // ------------------------------------------------------------------------
  function updatePlayerName(i, name) {
    setPlayers((p) => p.map((n, idx) => (idx === i ? name : n)));
  }
  function randomizeAllNames() {
    setPlayers((p) => {
      const used = [];
      return p.map(() => {
        const name = pickFunnyName(lang, used);
        used.push(name);
        return name;
      });
    });
  }
  function setPlayerCount(n) {
    n = Math.max(3, Math.min(10, n));
    setPlayers((p) => {
      const arr = p.slice(0, n);
      while (arr.length < n) arr.push("");
      return arr;
    });
  }

  const canStart = players.length >= 3;

  function startGame() {
    // fill in any blank name fields with a random funny name before we begin
    const filledNames = [];
    const finalPlayers = players.map((name) => {
      const trimmed = name.trim();
      if (trimmed) {
        filledNames.push(trimmed);
        return trimmed;
      }
      const funny = pickFunnyName(lang, filledNames);
      filledNames.push(funny);
      return funny;
    });
    setPlayers(finalPlayers);

    const spy = rand(finalPlayers.length);
    const loc = rand(locs.length);
    setSpyIndex(spy);
    setLocIndex(loc);
    setPlayerColors(buildPlayerColors(finalPlayers.length));
    setRevealIdx(0);
    setRevealFlipped(false);
    setDrawerIdx(0);
    setTurnsTaken(0);
    setTurnStarted(false);
    setDrawings({});
    setRelaySnapshots([]);
    setVoterIdx(0);
    setVotes({});
    setPhase("reveal");
  }

  function playAgain() {
    setRound((r) => r + 1);
    startGame();
  }

  function newGame() {
    setPhase("setup");
    setPlayers(["", "", "", ""]);
    setRound(1);
  }

  // ------------------------------------------------------------------------
  // Voting
  // ------------------------------------------------------------------------
  function castVote(targetIdx) {
    setVotes((v) => ({ ...v, [voterIdx]: targetIdx }));
    const next = voterIdx + 1;
    if (next >= players.length) setPhase("end");
    else setVoterIdx(next);
  }

  function tally() {
    const counts = players.map(() => 0);
    Object.values(votes).forEach((t) => counts[t]++);
    const max = Math.max(...counts);
    const top = counts.map((c, i) => (c === max ? i : -1)).filter((i) => i >= 0);
    const spyCaught = top.length === 1 && top[0] === spyIndex && max > 0;
    return { counts, spyCaught };
  }

  // ------------------------------------------------------------------------
  const Styles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=${dir === "rtl" ? "Vazirmatn" : "Inter"}:wght@400;600;700;800&display=swap');
      * { box-sizing: border-box; }
      .bz-root {
        font-family: ${dir === "rtl" ? "'Vazirmatn', 'Segoe UI', sans-serif" : "'Inter', 'Segoe UI', sans-serif"};
        background: #090B14;
        background-image: radial-gradient(circle at 1px 1px, rgba(243,239,230,0.05) 1px, transparent 0);
        background-size: 22px 22px;
        color: #F3EFE6;
        min-height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px 14px 40px;
      }
      .bz-shell { width: 100%; max-width: 460px; }
      .bz-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 10px; }
      .bz-topbar-actions { display: flex; gap: 8px; }
      .bz-topbtn {
        display: flex; align-items: center; gap: 6px; background: #14172A; border: 1px solid #262B45;
        border-radius: 10px; padding: 8px 12px; font-size: 13px; color: #F3EFE6; cursor: pointer;
      }
      .bz-h1 { font-weight: 800; font-size: 30px; line-height: 1.25; margin: 0; color: #F3EFE6; }
      .bz-tagline { color: #9298B3; font-size: 14px; margin-top: 10px; line-height: 1.7; }
      .bz-card {
        background: #12152A; border: 1px solid #232840; border-radius: 16px;
        padding: 20px; margin-top: 16px;
      }
      .bz-label { font-size: 13px; font-weight: 700; color: #F3EFE6; margin-bottom: 12px; }
      .bz-sublabel { font-size: 12px; color: #6E7490; margin-top: 6px; }
      .bz-btn {
        font-family: inherit; font-weight: 700; font-size: 15px;
        border: none; background: #F5B426; color: #14111F; border-radius: 12px;
        padding: 15px 18px; cursor: pointer; display: inline-flex; align-items: center;
        justify-content: center; gap: 8px; width: 100%; transition: opacity .15s ease, transform .08s ease;
      }
      .bz-btn:active { transform: scale(0.98); }
      .bz-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .bz-btn-ghost { background: transparent; color: #F3EFE6; border: 1px solid #2C3050; }
      .bz-btn-teal { background: #52C9BD; }
      .bz-row { display: flex; gap: 10px; }
      .bz-input {
        background: #0C0E1C; border: 1px solid #262B45; border-radius: 10px; color: #F3EFE6;
        padding: 12px 14px; font-size: 14px; font-family: inherit; width: 100%; outline: none;
        text-align: ${dir === "rtl" ? "right" : "left"};
      }
      .bz-input:focus { border-color: #F5B426; }
      .bz-namegrid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .bz-nameitem { display: flex; align-items: center; gap: 6px; }
      .bz-dice-btn {
        flex-shrink: 0; width: 30px; height: 30px; border-radius: 8px; border: 1px solid #262B45;
        background: #0C0E1C; color: #9298B3; display: flex; align-items: center; justify-content: center; cursor: pointer;
      }
      .bz-dice-btn:active { background: #F5B426; color: #14111F; border-color: #F5B426; }
      .bz-namebadge {
        flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: #1D2038;
        color: #9298B3; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;
      }
      .bz-sliderrow { display: flex; align-items: center; gap: 10px; }
      .bz-sqbtn {
        flex-shrink: 0; width: 34px; height: 34px; border-radius: 8px; border: 1px solid #262B45;
        background: #0C0E1C; color: #F3EFE6; display: flex; align-items: center; justify-content: center; cursor: pointer;
      }
      .bz-slider {
        -webkit-appearance: none; appearance: none; flex: 1; height: 6px; border-radius: 999px;
        background: #262B45; accent-color: #F5B426;
      }
      .bz-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
        background: #F5B426; border: 3px solid #12152A; cursor: pointer;
      }
      .bz-chip {
        border: 1px solid #262B45; border-radius: 999px; padding: 9px 15px; font-size: 13px;
        font-weight: 600; cursor: pointer; background: #0C0E1C; color: #9298B3;
      }
      .bz-chip.active { background: #F5B426; color: #14111F; border-color: #F5B426; }
      .bz-modebox { border: 1px solid #262B45; border-radius: 14px; padding: 16px; cursor: pointer; flex: 1; background: #0C0E1C; }
      .bz-modebox.active { border-color: #52C9BD; background: rgba(82,201,189,0.08); }
      .bz-center { text-align: center; }
      .bz-icon-circle {
        width: 56px; height: 56px; border-radius: 50%; background: #1B1E36;
        display: flex; align-items: center; justify-content: center; margin: 16px auto 6px; border: 1px solid #2C3050;
      }
      .bz-boardgrid { display: flex; gap: 12px; }
      .bz-boardcard {
        flex: 1; border-radius: 14px; padding: 14px; cursor: pointer; text-align: center;
        border: 2px solid #262B45; background: #0C0E1C;
      }
      .bz-boardcard.active { border-color: #F5B426; }
      .bz-boardpreview { border-radius: 8px; height: 44px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
      .bz-boardpreview .stroke { width: 60%; height: 6px; border-radius: 999px; }
      .bz-flipcard {
        border: 2px dashed #2C3050; border-radius: 16px; padding: 44px 20px; text-align: center; cursor: pointer;
        min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: repeating-linear-gradient(135deg, #12152A, #12152A 10px, #161a30 10px, #161a30 20px); margin-top: 18px;
      }
      .bz-reveal-face {
        border-radius: 16px; padding: 30px 20px; text-align: center; min-height: 180px; margin-top: 18px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        border: 2px solid #F5B426; background: #161a30;
      }
      .bz-reveal-face.spy { border-color: #E1594F; }
      .bz-spy-clue {
        margin-top: 14px; padding: 10px 16px; border-radius: 10px;
        background: rgba(225,89,79,0.1); border: 1px dashed #E1594F; text-align: center;
      }
      .bz-emoji-huge { font-size: 54px; line-height: 1; margin-bottom: 10px; }
      .bz-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
      .bz-swatch { width: 26px; height: 26px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; }
      .bz-swatch.active { border-color: #F3EFE6; box-shadow: 0 0 0 2px #F5B426; }
      .bz-tool-btn {
        width: 38px; height: 38px; border-radius: 10px; border: 1px solid #262B45;
        background: #0C0E1C; color: #F3EFE6; display: flex; align-items: center; justify-content: center; cursor: pointer;
      }
      .bz-tool-btn.active { background: #F5B426; color: #14111F; border-color: #F5B426; }
      .bz-canvas-wrap { border-radius: 14px; overflow: hidden; border: 1px solid #262B45; touch-action: none; margin-top: 4px; }
      .bz-timer-pill {
        position: absolute; top: 8px; ${dir === "rtl" ? "left" : "right"}: 8px; background: #0C0E1C; border: 1px solid #F5B426;
        border-radius: 999px; padding: 4px 10px; font-size: 13px; font-weight: 700; display: flex; gap: 5px; align-items: center; z-index: 2;
      }
      .bz-reminder { font-size: 13px; color: #9298B3; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
      .bz-role-banner {
        display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px;
        border: 2px solid #F5B426; background: rgba(245,180,38,0.08); margin-bottom: 10px;
      }
      .bz-role-banner.spy { border-color: #E1594F; background: rgba(225,89,79,0.08); }
      .bz-emoji-med { font-size: 30px; line-height: 1; flex-shrink: 0; }
      .bz-role-title { font-weight: 800; font-size: 17px; }
      .bz-role-sub { font-size: 12px; color: #9298B3; margin-top: 2px; }
      .bz-gallery-item { background: #12152A; border: 1px solid #232840; border-radius: 14px; padding: 10px; margin-bottom: 14px; }
      .bz-gallery-item img { width: 100%; border-radius: 8px; display: block; }
      .bz-name-pill { font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #F5B426; }
      .bz-vote-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
      .bz-vote-btn {
        border: 1px solid #262B45; border-radius: 12px; padding: 16px 10px; background: #0C0E1C;
        color: #F3EFE6; font-weight: 700; cursor: pointer; font-size: 15px;
      }
      .bz-vote-btn:active { background: #F5B426; color: #14111F; }
      .bz-tally-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      .bz-tally-bar-bg { flex: 1; height: 12px; background: #0C0E1C; border-radius: 999px; overflow: hidden; }
      .bz-tally-bar { height: 100%; background: #52C9BD; }
      .bz-result-banner { text-align: center; padding: 22px; border-radius: 16px; margin-top: 16px; font-weight: 800; font-size: 22px; }
      .bz-peek-overlay {
        position: fixed; inset: 0; background: rgba(9,11,20,0.94); z-index: 50;
        display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px;
      }
      .bz-peek-overlay img { max-width: 100%; border-radius: 12px; border: 3px solid #52C9BD; }
      .bz-warn { font-size: 12px; color: #9298B3; margin-top: 10px; text-align: center; }
      .bz-relay-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .bz-relay-infocard {
        display: flex; justify-content: space-between; align-items: center; background: #12152A;
        border: 1px solid #232840; border-radius: 16px; padding: 16px 20px; margin-bottom: 14px;
      }
      .bz-relay-infocard .col { text-align: center; }
      .bz-relay-infocard .big { font-size: 20px; font-weight: 800; margin-top: 2px; }
      .bz-relay-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; justify-content: center; }
      .bz-relay-chip {
        display: flex; align-items: center; gap: 7px; border: 1px solid #262B45; border-radius: 999px;
        padding: 7px 13px; font-size: 13px; font-weight: 600; background: #0C0E1C; color: #F3EFE6;
      }
      .bz-relay-chip.active { border-color: #F5B426; }
      .bz-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
      .bz-menu-choice { display: flex; align-items: center; gap: 14px; cursor: pointer; }
      .bz-code-big { font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #F5B426; margin: 8px 0; }
      .bz-player-row {
        display: flex; justify-content: space-between; align-items: center; padding: 10px 0;
        border-bottom: 1px solid #232840; font-weight: 600;
      }
      .bz-player-row:last-child { border-bottom: none; }
      .bz-host-tag {
        font-size: 10px; font-weight: 800; background: #F5B426; color: #14111F;
        border-radius: 6px; padding: 3px 7px; letter-spacing: 0.05em;
      }
    `}</style>
  );

  const currentPlayerName = (i) => players[i] || s.playerDefault(i + 1);

  // ==========================================================================
  // SETUP
  // ==========================================================================
  function renderSetup() {
    return (
      <div className="bz-shell">
        <div className="bz-topbar">
          <div className="bz-topbar-actions">
            <div className="bz-topbtn" onClick={() => setAppMode("menu")}>
              <ArrowLeft size={15} style={{ transform: dir === "ltr" ? "scaleX(-1)" : "none" }} />
            </div>
            <div className="bz-topbtn" onClick={() => setBoardColor((c) => (c === "dark" ? "light" : "dark"))}>
              {boardColor === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </div>
            <div className="bz-topbtn" onClick={() => setLang((l) => (l === "ckb" ? "en" : "ckb"))}>
              <Languages size={15} /> {s.langToggle}
            </div>
          </div>
          <h1 className="bz-h1" style={{ fontSize: 20 }}>{s.appTitle}</h1>
        </div>

        <p className="bz-tagline">{s.tagline}</p>

        <div className="bz-card">
          <div className="bz-label">{s.modeLabel}</div>
          <div className="bz-row">
            <div className={`bz-modebox ${mode === "classic" ? "active" : ""}`} onClick={() => setMode("classic")}>
              <Pencil size={18} color={mode === "classic" ? "#52C9BD" : "#9298B3"} />
              <div style={{ fontWeight: 700, marginTop: 8 }}>{s.modeClassicTitle}</div>
              <div className="bz-sublabel">{s.modeClassicDesc}</div>
            </div>
            <div className={`bz-modebox ${mode === "relay" ? "active" : ""}`} onClick={() => setMode("relay")}>
              <Users size={18} color={mode === "relay" ? "#52C9BD" : "#9298B3"} />
              <div style={{ fontWeight: 700, marginTop: 8 }}>{s.modeRelayTitle}</div>
              <div className="bz-sublabel">{s.modeRelayDesc}</div>
            </div>
          </div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.playerCount(players.length)}</div>
          <div className="bz-sliderrow">
            <div className="bz-sqbtn" onClick={() => setPlayerCount(players.length + 1)}><Plus size={15} /></div>
            <input
              className="bz-slider" type="range" min={3} max={10} value={players.length}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            />
            <div className="bz-sqbtn" onClick={() => setPlayerCount(players.length - 1)}><Minus size={15} /></div>
          </div>

          {mode === "relay" && (
            <>
              <div className="bz-label" style={{ marginTop: 20 }}>{s.turnsPerPlayer(turnsPerPlayer)}</div>
              <div className="bz-sliderrow">
                <div className="bz-sqbtn" onClick={() => setTurnsPerPlayer((t) => Math.min(6, t + 1))}><Plus size={15} /></div>
                <input
                  className="bz-slider" type="range" min={1} max={6} value={turnsPerPlayer}
                  onChange={(e) => setTurnsPerPlayer(Number(e.target.value))}
                />
                <div className="bz-sqbtn" onClick={() => setTurnsPerPlayer((t) => Math.max(1, t - 1))}><Minus size={15} /></div>
              </div>
              <div className="bz-sublabel">{s.totalLines(totalRelayTurns)}</div>
            </>
          )}

          <div className="bz-row" style={{ marginTop: 20, alignItems: "center", justifyContent: "space-between" }}>
            <div className="bz-label" style={{ marginBottom: 0 }}>{s.namesLabel}</div>
            <div className="bz-topbtn" onClick={randomizeAllNames}>
              <Shuffle size={14} /> {s.randomizeAllBtn}
            </div>
          </div>
          <div className="bz-sublabel" style={{ marginTop: 6, marginBottom: 10 }}>{s.namesHint}</div>
          <div className="bz-namegrid">
            {players.map((name, i) => (
              <div className="bz-nameitem" key={i}>
                <input
                  className="bz-input"
                  placeholder={s.namePlaceholder(i + 1)}
                  value={name}
                  maxLength={16}
                  onChange={(e) => updatePlayerName(i, e.target.value)}
                />
                <div className="bz-namebadge">{i + 1}</div>
                <div
                  className="bz-dice-btn"
                  onClick={() => updatePlayerName(i, pickFunnyName(lang, players.filter((_, idx) => idx !== i)))}
                >
                  <Shuffle size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.boardLabel}</div>
          <div className="bz-boardgrid">
            <div className={`bz-boardcard ${boardColor === "light" ? "active" : ""}`} onClick={() => setBoardColor("light")}>
              <div className="bz-boardpreview" style={{ background: "#FBF8F1" }}>
                <div className="stroke" style={{ background: "#14111F" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.boardWhite}</div>
            </div>
            <div className={`bz-boardcard ${boardColor === "dark" ? "active" : ""}`} onClick={() => setBoardColor("dark")}>
              <div className="bz-boardpreview" style={{ background: "#0C0A14", border: "1px solid #2C3050" }}>
                <div className="stroke" style={{ background: "#F5B426" }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.boardBlack}</div>
            </div>
          </div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.timerLabel}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIMER_OPTIONS.map((t) => (
              <div key={t} className={`bz-chip ${timerSec === t ? "active" : ""}`} onClick={() => setTimerSec(t)}>
                {t === 0 ? s.timerOff : `${t}${s.timerUnit}`}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button className="bz-btn" disabled={!canStart} onClick={startGame}>
            <ForwardIcon size={17} /> {s.startBtn}
          </button>
          {!canStart && <div className="bz-warn">{s.startWarning}</div>}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // REVEAL
  // ==========================================================================
  function renderReveal() {
    const isSpy = revealIdx === spyIndex;
    const [locName, locIcon] = locs[locIndex];
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.passDeviceLabel}</div>
          <h1 className="bz-h1">{currentPlayerName(revealIdx)}</h1>
          <p className="bz-tagline">{s.playerOfTotal(revealIdx + 1, players.length)}</p>
        </div>

        {!revealFlipped ? (
          <div className="bz-flipcard" onClick={() => setRevealFlipped(true)}>
            <Eye size={30} color="#F5B426" />
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{s.tapReveal}</div>
          </div>
        ) : (
          <div className={`bz-reveal-face ${isSpy ? "spy" : ""}`}>
            {isSpy ? (
              <>
                <div className="bz-emoji-huge">🕵️</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{s.youAreSpy}</div>
                <div className="bz-sublabel">{s.spyHint}</div>
                <div className="bz-spy-clue">
                  <div className="bz-sublabel" style={{ marginTop: 0 }}>{s.spyClueLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{spyClue}</div>
                </div>
              </>
            ) : (
              <>
                <div className="bz-emoji-huge">{locIcon}</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{locName}</div>
                <div className="bz-sublabel">{s.locationHint}</div>
              </>
            )}
          </div>
        )}

        {revealFlipped && (
          <button
            className="bz-btn"
            style={{ marginTop: 16 }}
            onClick={() => {
              const next = revealIdx + 1;
              setRevealFlipped(false);
              if (next >= players.length) {
                setPhase("draw");
                setDrawerIdx(0);
                setTurnStarted(mode === "relay");
              } else {
                setRevealIdx(next);
              }
            }}
          >
            <Check size={17} /> {s.gotItReady}
          </button>
        )}
      </div>
    );
  }

  // ==========================================================================
  // DRAW
  // ==========================================================================
  function renderDraw() {
    return mode === "relay" ? renderRelayDraw() : renderClassicDraw();
  }

  function renderClassicDraw() {
    const isSpy = drawerIdx === spyIndex;
    const [locName, locIcon] = locs[locIndex];

    if (!turnStarted) {
      return (
        <div className="bz-shell">
          <div className="bz-center" style={{ marginTop: 10 }}>
            <div className="bz-label" style={{ color: "#9298B3" }}>{s.passDeviceLabel}</div>
            <h1 className="bz-h1">{currentPlayerName(drawerIdx)}</h1>
            <p className="bz-tagline">{s.classicDrawIntro}</p>
          </div>

          <div className="bz-icon-circle"><Pencil size={22} color="#F5B426" /></div>

          <button className="bz-btn" style={{ marginTop: 16 }} onClick={beginTurn}>
            <ForwardIcon size={17} /> {s.startDrawingBtn(currentPlayerName(drawerIdx))}
          </button>
        </div>
      );
    }

    return (
      <div className="bz-shell">
        <div className={`bz-role-banner ${isSpy ? "spy" : ""}`}>
          {isSpy ? (
            <>
              <div className="bz-emoji-med">🕵️</div>
              <div>
                <div className="bz-role-title">{s.reminderSpy}</div>
                <div className="bz-role-sub">{spyClue}</div>
              </div>
            </>
          ) : (
            <>
              <div className="bz-emoji-med">{locIcon}</div>
              <div>
                <div className="bz-role-title">{locName}</div>
              </div>
            </>
          )}
        </div>
        <div style={{ position: "relative" }}>
          {timerSec > 0 && <div className="bz-timer-pill"><Timer size={13} /> {timeLeft}{s.timerUnit}</div>}
          <div className="bz-canvas-wrap">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: 340, display: "block", background: boardBg }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </div>

          <div className="bz-toolbar">
            {PEN_COLORS.map((c) => (
              <div
                key={c}
                className={`bz-swatch ${!eraser && penColor === c ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => { setPenColor(c); setEraser(false); }}
              />
            ))}
            <div style={{ width: 1, height: 26, background: "#262B45", margin: "0 4px" }} />
            {BRUSH_SIZES.map((sz) => (
              <div key={sz} className={`bz-tool-btn ${penSize === sz ? "active" : ""}`} onClick={() => setPenSize(sz)}>
                <div style={{ width: sz, height: sz, borderRadius: "50%", background: penSize === sz ? "#14111F" : "#F3EFE6" }} />
              </div>
            ))}
            <div className={`bz-tool-btn ${eraser ? "active" : ""}`} onClick={() => setEraser((e) => !e)}>
              <Eraser size={16} />
            </div>
            <div className="bz-tool-btn" onClick={handleUndo}><Undo2 size={16} /></div>
          </div>

          <button className="bz-btn" style={{ marginTop: 14 }} onClick={submitClassicDrawing}>
            <Check size={17} /> {s.submitDrawing}
          </button>
        </div>
      </div>
    );
  }

  function renderRelayDraw() {
    const isSpy = drawerIdx === spyIndex;
    const currentLine = turnsTaken + 1;
    const activeColor = (playerColors[drawerIdx] || FIXED_PLAYER_COLORS[0]);

    return (
      <div className="bz-shell">
        <div className="bz-relay-topbar">
          <div className="bz-topbtn" onClick={() => setBoardColor((c) => (c === "dark" ? "light" : "dark"))}>
            {boardColor === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {s.modeRelayTitle}
          </div>
          <div className="bz-topbtn" onClick={newGame}>
            {s.homeBtn} <Home size={15} />
          </div>
        </div>

        <div className="bz-relay-infocard">
          <div className="col">
            <div className="bz-sublabel">{s.lineLabel}</div>
            <div className="big">{totalRelayTurns} / {currentLine}</div>
          </div>
          <div className="col">
            <div className="bz-sublabel">{s.turnLabel}</div>
            <div className="big" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {currentPlayerName(drawerIdx)}
              <span className="bz-dot" style={{ background: activeColor, width: 14, height: 14 }} />
            </div>
          </div>
        </div>

        {isSpy && (
          <div className="bz-reminder" style={{ justifyContent: "center", marginBottom: 8 }}>{s.reminderSpy}</div>
        )}

        <div style={{ position: "relative" }}>
          {timerSec > 0 && <div className="bz-timer-pill"><Timer size={13} /> {timeLeft}{s.timerUnit}</div>}
          <div className="bz-canvas-wrap">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: 420, display: "block", background: boardBg }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
          </div>
        </div>

        <div className="bz-warn">{s.relayStrokeHint}</div>

        <div className="bz-relay-legend">
          {players.map((_, i) => (
            <div key={i} className={`bz-relay-chip ${i === drawerIdx ? "active" : ""}`}>
              {currentPlayerName(i)} <span className="bz-dot" style={{ background: (playerColors[i] || FIXED_PLAYER_COLORS[0]) }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // GALLERY
  // ==========================================================================
  function renderGallery() {
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10, marginBottom: 6 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.galleryLabel}</div>
          <h1 className="bz-h1" style={{ fontSize: 26 }}>{s.galleryTitle}</h1>
          <p className="bz-tagline">{s.gallerySubtitle}</p>
        </div>

        {mode === "classic" ? (
          players.map((_, i) => (
            <div className="bz-gallery-item" key={i}>
              <div className="bz-name-pill">{currentPlayerName(i)}</div>
              <img src={drawings[i]} alt={currentPlayerName(i)} style={{ background: boardBg }} />
            </div>
          ))
        ) : (
          <div className="bz-gallery-item">
            <div className="bz-name-pill">{s.sharedBoardLabel}</div>
            <img src={relaySnapshots[relaySnapshots.length - 1]?.dataURL} alt="shared board" style={{ background: boardBg }} />
            <div className="bz-sublabel" style={{ marginTop: 10 }}>
              {s.turnOrderLabel} {relaySnapshots.map((sn) => currentPlayerName(sn.idx)).join(dir === "rtl" ? " ← " : " → ")}
            </div>
          </div>
        )}

        <button className="bz-btn" style={{ marginTop: 6 }} onClick={() => setPhase("vote")}>
          <ForwardIcon size={17} /> {s.startVotingBtn}
        </button>
      </div>
    );
  }

  // ==========================================================================
  // VOTE
  // ==========================================================================
  function renderVote() {
    const voted = votes[voterIdx] !== undefined;
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.passDeviceLabel}</div>
          <h1 className="bz-h1">{currentPlayerName(voterIdx)}</h1>
          <p className="bz-tagline">{s.whoIsSpy}</p>
        </div>

        <div className="bz-vote-grid">
          {players.map((_, i) =>
            i === voterIdx ? null : (
              <button key={i} className="bz-vote-btn" onClick={() => castVote(i)} disabled={voted}>
                {currentPlayerName(i)}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // END
  // ==========================================================================
  function renderEnd() {
    const { counts, spyCaught } = tally();
    const [locName, locIcon] = locs[locIndex];
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.roundResult(round)}</div>
        </div>

        <div
          className="bz-result-banner"
          style={{
            background: spyCaught ? "rgba(82,201,189,0.12)" : "rgba(225,89,79,0.12)",
            border: `2px solid ${spyCaught ? "#52C9BD" : "#E1594F"}`,
            color: spyCaught ? "#52C9BD" : "#E1594F",
          }}
        >
          <Trophy size={26} style={{ marginBottom: 6 }} />
          <div>{spyCaught ? s.playersWin : s.spyWins}</div>
        </div>

        <div className="bz-card">
          <div className="bz-row" style={{ alignItems: "center" }}>
            <div className="bz-emoji-huge" style={{ marginBottom: 0 }}>{locIcon}</div>
            <div>
              <div className="bz-sublabel">{s.locationWasLabel}</div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{locName}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #232840" }}>
            <div className="bz-sublabel">{s.spyWasLabel}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#E1594F" }}>🕵️ {currentPlayerName(spyIndex)}</div>
          </div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.votesLabel}</div>
          {players.map((_, i) => (
            <div className="bz-tally-row" key={i}>
              <div style={{ fontSize: 13, width: 90, flexShrink: 0, fontWeight: i === spyIndex ? 700 : 500, color: i === spyIndex ? "#E1594F" : "#F3EFE6" }}>
                {currentPlayerName(i)}
              </div>
              <div className="bz-tally-bar-bg">
                <div className="bz-tally-bar" style={{ width: `${(counts[i] / players.length) * 100}%`, background: i === spyIndex ? "#E1594F" : "#52C9BD" }} />
              </div>
              <div style={{ fontSize: 13, width: 18, textAlign: dir === "rtl" ? "left" : "right" }}>{counts[i]}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="bz-btn" onClick={playAgain}><RotateCcw size={17} /> {s.playAgainBtn}</button>
          <button className="bz-btn bz-btn-ghost" onClick={newGame}><X size={17} /> {s.newGameBtn}</button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ONLINE: MENU / CREATE / JOIN / LOBBY
  // ==========================================================================
  function renderMenu() {
    return (
      <div className="bz-shell">
        <div className="bz-topbar">
          <div className="bz-topbar-actions">
            <div className="bz-topbtn" onClick={() => setLang((l) => (l === "ckb" ? "en" : "ckb"))}>
              <Languages size={15} /> {s.langToggle}
            </div>
          </div>
          <h1 className="bz-h1" style={{ fontSize: 20 }}>{s.menuTitle}</h1>
        </div>
        <p className="bz-tagline">{s.tagline}</p>

        <div className="bz-card bz-menu-choice" onClick={() => { setAppMode("offline"); setPhase("setup"); }}>
          <Users size={20} color="#F5B426" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{s.playOfflineTitle}</div>
            <div className="bz-sublabel">{s.playOfflineDesc}</div>
          </div>
          <ForwardIcon size={17} color="#9298B3" />
        </div>

        <div className="bz-card bz-menu-choice" onClick={() => { setAppMode("online"); setNetScreen("landing"); }}>
          <Sparkles size={20} color="#52C9BD" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{s.playOnlineTitle}</div>
            <div className="bz-sublabel">{s.playOnlineDesc}</div>
          </div>
          <ForwardIcon size={17} color="#9298B3" />
        </div>
      </div>
    );
  }

  function renderNetLanding() {
    return (
      <div className="bz-shell">
        <div className="bz-topbar">
          <div className="bz-topbtn" onClick={() => setAppMode("menu")}>
            <ArrowLeft size={15} style={{ transform: dir === "ltr" ? "scaleX(-1)" : "none" }} /> {s.netBack}
          </div>
          <h1 className="bz-h1" style={{ fontSize: 20 }}>{s.playOnlineTitle}</h1>
        </div>

        {storageMissing && <div className="bz-warn" style={{ color: "#E1594F" }}>{s.missingStorage}</div>}

        <div className="bz-card">
          <div className="bz-label">{s.yourNameLabel}</div>
          <input
            className="bz-input"
            placeholder={s.yourNamePlaceholder}
            value={myName}
            maxLength={16}
            onChange={(e) => setMyName(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="bz-btn" disabled={!myName.trim() || netBusy} onClick={netCreateRoom}>
            <Plus size={17} /> {s.createRoomBtn}
          </button>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.enterCodeLabel}</div>
          <input
            className="bz-input"
            placeholder={s.codePlaceholder}
            value={joinCodeInput}
            maxLength={4}
            style={{ textAlign: "center", letterSpacing: 4, fontWeight: 800, textTransform: "uppercase" }}
            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
          />
          <button className="bz-btn" style={{ marginTop: 12 }} disabled={!myName.trim() || !joinCodeInput.trim() || netBusy} onClick={netJoinRoom}>
            <ForwardIcon size={17} /> {s.joinRoomBtn}
          </button>
          {netError && <div className="bz-warn" style={{ color: "#E1594F" }}>{netError}</div>}
        </div>
      </div>
    );
  }

  function renderNetLobby() {
    if (!room) return null;
    const iAmReady = false; // lobby has no ready step — reveal phase does
    return (
      <div className="bz-shell">
        <div className="bz-topbar">
          <div className="bz-topbtn" onClick={netLeaveRoom}>
            <X size={15} /> {s.leaveRoomBtn}
          </div>
          <h1 className="bz-h1" style={{ fontSize: 20 }}>{s.playOnlineTitle}</h1>
        </div>

        <div className="bz-card bz-center">
          <div className="bz-sublabel">{s.roomCodeLabel}</div>
          <div className="bz-code-big">{room.code}</div>
          <div className="bz-sublabel">{s.shareCodeHint}</div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.modeLabel}</div>
          <div className="bz-row">
            <div
              className={`bz-modebox ${room.mode === "classic" ? "active" : ""}`}
              onClick={() => isNetHost && netUpdateSetting({ mode: "classic" })}
            >
              <Pencil size={18} color={room.mode === "classic" ? "#52C9BD" : "#9298B3"} />
              <div style={{ fontWeight: 700, marginTop: 8 }}>{s.modeClassicTitle}</div>
              <div className="bz-sublabel">{s.modeClassicDesc}</div>
            </div>
            <div
              className={`bz-modebox ${room.mode === "relay" ? "active" : ""}`}
              onClick={() => isNetHost && netUpdateSetting({ mode: "relay" })}
            >
              <Users size={18} color={room.mode === "relay" ? "#52C9BD" : "#9298B3"} />
              <div style={{ fontWeight: 700, marginTop: 8 }}>{s.modeRelayTitle}</div>
              <div className="bz-sublabel">{s.modeRelayDesc}</div>
            </div>
          </div>

          {room.mode === "relay" && (
            <>
              <div className="bz-label" style={{ marginTop: 20 }}>{s.turnsPerPlayer(room.turnsPerPlayer)}</div>
              <div className="bz-sliderrow">
                <div className="bz-sqbtn" onClick={() => isNetHost && netUpdateSetting({ turnsPerPlayer: Math.min(6, room.turnsPerPlayer + 1) })}><Plus size={15} /></div>
                <input
                  className="bz-slider" type="range" min={1} max={6} value={room.turnsPerPlayer}
                  onChange={(e) => isNetHost && netUpdateSetting({ turnsPerPlayer: Number(e.target.value) })}
                  disabled={!isNetHost}
                />
                <div className="bz-sqbtn" onClick={() => isNetHost && netUpdateSetting({ turnsPerPlayer: Math.max(1, room.turnsPerPlayer - 1) })}><Minus size={15} /></div>
              </div>
            </>
          )}

          <div className="bz-label" style={{ marginTop: 20 }}>{s.boardLabel}</div>
          <div className="bz-boardgrid">
            <div className={`bz-boardcard ${room.boardColor === "light" ? "active" : ""}`} onClick={() => isNetHost && netUpdateSetting({ boardColor: "light" })}>
              <div className="bz-boardpreview" style={{ background: "#FBF8F1" }}><div className="stroke" style={{ background: "#14111F" }} /></div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.boardWhite}</div>
            </div>
            <div className={`bz-boardcard ${room.boardColor === "dark" ? "active" : ""}`} onClick={() => isNetHost && netUpdateSetting({ boardColor: "dark" })}>
              <div className="bz-boardpreview" style={{ background: "#0C0A14", border: "1px solid #2C3050" }}><div className="stroke" style={{ background: "#F5B426" }} /></div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{s.boardBlack}</div>
            </div>
          </div>

          <div className="bz-label" style={{ marginTop: 20 }}>{s.timerLabel}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIMER_OPTIONS.map((t) => (
              <div key={t} className={`bz-chip ${room.timerSec === t ? "active" : ""}`} onClick={() => isNetHost && netUpdateSetting({ timerSec: t })}>
                {t === 0 ? s.timerOff : `${t}${s.timerUnit}`}
              </div>
            ))}
          </div>

          {!isNetHost && <div className="bz-warn">{s.hostOnlyNote}</div>}
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.lobbyPlayersLabel(room.players.length)}</div>
          {room.players.map((p) => (
            <div key={p.id} className="bz-player-row">
              <span>{p.name}{p.id === myId ? " (تۆ)" : ""}</span>
              {p.id === room.hostId && <span className="bz-host-tag">HOST</span>}
            </div>
          ))}
        </div>

        {isNetHost ? (
          <div style={{ marginTop: 16 }}>
            <button className="bz-btn" disabled={room.players.length < 3} onClick={netStartGameOnline}>
              <ForwardIcon size={17} /> {s.startOnlineBtn}
            </button>
            {room.players.length < 3 && <div className="bz-warn">{s.notEnoughOnline}</div>}
          </div>
        ) : (
          <div className="bz-warn" style={{ marginTop: 16 }}>{s.lobbyWaitingHost}</div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // ONLINE: REVEAL / DRAW / GALLERY / VOTE / END
  // ==========================================================================
  function renderNetReveal() {
    if (!room) return null;
    const [locName, locIcon] = locs[room.locIndex];
    const readyCount = (room.readyIds || []).length;
    const iAmReady = (room.readyIds || []).includes(myId);

    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{(room.players[myIdx]?.name || "")}</div>
        </div>

        {!netRevealFlipped ? (
          <div className="bz-flipcard" onClick={() => setNetRevealFlipped(true)}>
            <Eye size={30} color="#F5B426" />
            <div style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{s.tapReveal}</div>
          </div>
        ) : (
          <div className={`bz-reveal-face ${netIsSpy ? "spy" : ""}`}>
            {netIsSpy ? (
              <>
                <div className="bz-emoji-huge">🕵️</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{s.youAreSpy}</div>
                <div className="bz-sublabel">{s.spyHint}</div>
                <div className="bz-spy-clue">
                  <div className="bz-sublabel" style={{ marginTop: 0 }}>{s.spyClueLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{CATEGORY_HINTS[lang][CATEGORY_OF[room.locIndex]]}</div>
                </div>
              </>
            ) : (
              <>
                <div className="bz-emoji-huge">{locIcon}</div>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{locName}</div>
                <div className="bz-sublabel">{s.locationHint}</div>
              </>
            )}
          </div>
        )}

        {netRevealFlipped && (
          iAmReady ? (
            <div className="bz-warn" style={{ marginTop: 16 }}>{s.waitingReady(readyCount, room.players.length)}</div>
          ) : (
            <button className="bz-btn" style={{ marginTop: 16 }} onClick={netToggleReady}>
              <Check size={17} /> {s.readyBtn}
            </button>
          )
        )}
      </div>
    );
  }

  function renderNetDraw() {
    if (!room) return null;
    return room.mode === "relay" ? renderNetRelayDraw() : renderNetClassicDraw();
  }

  function renderNetClassicDraw() {
    const [locName, locIcon] = locs[room.locIndex];
    const submitted = room.drawings && room.drawings[myId] !== undefined;
    const submittedCount = Object.keys(room.drawings || {}).length;

    if (submitted) {
      return (
        <div className="bz-shell">
          <div className="bz-icon-circle"><Check size={22} color="#52C9BD" /></div>
          <div className="bz-warn">{s.waitingSubmit(submittedCount, room.players.length)}</div>
        </div>
      );
    }

    return (
      <div className="bz-shell">
        <div className={`bz-role-banner ${netIsSpy ? "spy" : ""}`}>
          {netIsSpy ? (
            <>
              <div className="bz-emoji-med">🕵️</div>
              <div>
                <div className="bz-role-title">{s.reminderSpy}</div>
                <div className="bz-role-sub">{CATEGORY_HINTS[lang][CATEGORY_OF[room.locIndex]]}</div>
              </div>
            </>
          ) : (
            <>
              <div className="bz-emoji-med">{locIcon}</div>
              <div><div className="bz-role-title">{locName}</div></div>
            </>
          )}
        </div>
        <div style={{ position: "relative" }}>
          {room.timerSec > 0 && <div className="bz-timer-pill"><Timer size={13} /> {netTimeLeft}{s.timerUnit}</div>}
          <div className="bz-canvas-wrap">
            <canvas
              ref={netCanvasRef}
              style={{ width: "100%", height: 340, display: "block", background: netBoardBg }}
              onPointerDown={netHandlePointerDown}
              onPointerMove={netHandlePointerMove}
              onPointerUp={netHandlePointerUp}
              onPointerLeave={netHandlePointerUp}
            />
          </div>
          <div className="bz-toolbar">
            {PEN_COLORS.map((c) => (
              <div key={c} className={`bz-swatch ${!eraser && penColor === c ? "active" : ""}`} style={{ background: c }} onClick={() => { setPenColor(c); setEraser(false); }} />
            ))}
            <div style={{ width: 1, height: 26, background: "#262B45", margin: "0 4px" }} />
            {BRUSH_SIZES.map((sz) => (
              <div key={sz} className={`bz-tool-btn ${penSize === sz ? "active" : ""}`} onClick={() => setPenSize(sz)}>
                <div style={{ width: sz, height: sz, borderRadius: "50%", background: penSize === sz ? "#14111F" : "#F3EFE6" }} />
              </div>
            ))}
            <div className={`bz-tool-btn ${eraser ? "active" : ""}`} onClick={() => setEraser((e) => !e)}><Eraser size={16} /></div>
            <div className="bz-tool-btn" onClick={netHandleUndo}><Undo2 size={16} /></div>
          </div>
          <button className="bz-btn" style={{ marginTop: 14 }} onClick={netSubmitClassicDrawing}>
            <Check size={17} /> {s.submitDrawing}
          </button>
        </div>
      </div>
    );
  }

  function renderNetRelayDraw() {
    const currentLine = room.turnsTaken + 1;
    const activeColor = (room.playerColors && room.playerColors[room.drawerIdx]) || FIXED_PLAYER_COLORS[0];

    return (
      <div className="bz-shell">
        <div className="bz-relay-topbar">
          <div className="bz-topbtn" onClick={() => isNetHost && netUpdateSetting({ boardColor: room.boardColor === "dark" ? "light" : "dark" })}>
            {room.boardColor === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            {s.modeRelayTitle}
          </div>
          <div className="bz-topbtn" onClick={netLeaveRoom}>
            {s.leaveRoomBtn} <Home size={15} />
          </div>
        </div>

        <div className="bz-relay-infocard">
          <div className="col">
            <div className="bz-sublabel">{s.lineLabel}</div>
            <div className="big">{netTotalRelayTurns} / {currentLine}</div>
          </div>
          <div className="col">
            <div className="bz-sublabel">{s.turnLabel}</div>
            <div className="big" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {room.players[room.drawerIdx]?.name}
              <span className="bz-dot" style={{ background: activeColor, width: 14, height: 14 }} />
            </div>
          </div>
        </div>

        {netIsSpy && <div className="bz-reminder" style={{ justifyContent: "center", marginBottom: 8 }}>{s.reminderSpy}</div>}

        {netIsMyTurn ? (
          <div style={{ position: "relative" }}>
            {room.timerSec > 0 && <div className="bz-timer-pill"><Timer size={13} /> {netTimeLeft}{s.timerUnit}</div>}
            <div className="bz-canvas-wrap">
              <canvas
                ref={netCanvasRef}
                style={{ width: "100%", height: 420, display: "block", background: netBoardBg }}
                onPointerDown={netHandlePointerDown}
                onPointerMove={netHandlePointerMove}
                onPointerUp={netHandlePointerUp}
                onPointerLeave={netHandlePointerUp}
              />
            </div>
            <div className="bz-warn">{s.relayStrokeHint}</div>
          </div>
        ) : (
          <div>
            <div className="bz-canvas-wrap">
              {room.relayCanvas ? (
                <img src={room.relayCanvas} alt="board" style={{ width: "100%", height: 420, objectFit: "cover", display: "block", background: netBoardBg }} />
              ) : (
                <div style={{ width: "100%", height: 420, background: netBoardBg }} />
              )}
            </div>
            <div className="bz-warn">{s.waitingTurnOf(room.players[room.drawerIdx]?.name)}</div>
          </div>
        )}

        <div className="bz-relay-legend">
          {room.players.map((p, i) => (
            <div key={p.id} className={`bz-relay-chip ${i === room.drawerIdx ? "active" : ""}`}>
              {p.name} <span className="bz-dot" style={{ background: (room.playerColors && room.playerColors[i]) || FIXED_PLAYER_COLORS[0] }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderNetGallery() {
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10, marginBottom: 6 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.galleryLabel}</div>
          <h1 className="bz-h1" style={{ fontSize: 26 }}>{s.galleryTitle}</h1>
          <p className="bz-tagline">{s.gallerySubtitle}</p>
        </div>

        {room.mode === "classic" ? (
          room.players.map((p) => (
            <div className="bz-gallery-item" key={p.id}>
              <div className="bz-name-pill">{p.name}</div>
              <img src={room.drawings[p.id]} alt={p.name} style={{ background: netBoardBg }} />
            </div>
          ))
        ) : (
          <div className="bz-gallery-item">
            <div className="bz-name-pill">{s.sharedBoardLabel}</div>
            <img src={room.relayCanvas} alt="shared board" style={{ background: netBoardBg }} />
            <div className="bz-sublabel" style={{ marginTop: 10 }}>
              {s.turnOrderLabel} {(room.relayLog || []).map((id) => room.players.find((p) => p.id === id)?.name).join(dir === "rtl" ? " ← " : " → ")}
            </div>
          </div>
        )}

        {isNetHost && (
          <button className="bz-btn" style={{ marginTop: 6 }} onClick={() => netUpdateSetting({ phase: "vote" })}>
            <ForwardIcon size={17} /> {s.startVotingBtn}
          </button>
        )}
      </div>
    );
  }

  function renderNetVote() {
    const voted = room.votes && room.votes[myId] !== undefined;
    const voteCount = Object.keys(room.votes || {}).length;

    if (voted) {
      return (
        <div className="bz-shell">
          <div className="bz-icon-circle"><Check size={22} color="#52C9BD" /></div>
          <div className="bz-warn">{s.waitingVotes(voteCount, room.players.length)}</div>
        </div>
      );
    }

    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <p className="bz-tagline">{s.whoIsSpy}</p>
        </div>
        <div className="bz-vote-grid">
          {room.players.map((p) =>
            p.id === myId ? null : (
              <button key={p.id} className="bz-vote-btn" onClick={() => netCastVote(p.id)}>
                {p.name}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  function renderNetEnd() {
    const spyId = room.players[room.spyIndex]?.id;
    const { counts, spyCaught } = netTally(room.players, room.votes, spyId);
    const [locName, locIcon] = locs[room.locIndex];
    return (
      <div className="bz-shell">
        <div className="bz-center" style={{ marginTop: 10 }}>
          <div className="bz-label" style={{ color: "#9298B3" }}>{s.roundResult(room.round)}</div>
        </div>

        <div
          className="bz-result-banner"
          style={{
            background: spyCaught ? "rgba(82,201,189,0.12)" : "rgba(225,89,79,0.12)",
            border: `2px solid ${spyCaught ? "#52C9BD" : "#E1594F"}`,
            color: spyCaught ? "#52C9BD" : "#E1594F",
          }}
        >
          <Trophy size={26} style={{ marginBottom: 6 }} />
          <div>{spyCaught ? s.playersWin : s.spyWins}</div>
        </div>

        <div className="bz-card">
          <div className="bz-row" style={{ alignItems: "center" }}>
            <div className="bz-emoji-huge" style={{ marginBottom: 0 }}>{locIcon}</div>
            <div>
              <div className="bz-sublabel">{s.locationWasLabel}</div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>{locName}</div>
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #232840" }}>
            <div className="bz-sublabel">{s.spyWasLabel}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#E1594F" }}>🕵️ {room.players[room.spyIndex]?.name}</div>
          </div>
        </div>

        <div className="bz-card">
          <div className="bz-label">{s.votesLabel}</div>
          {room.players.map((p) => (
            <div className="bz-tally-row" key={p.id}>
              <div style={{ fontSize: 13, width: 90, flexShrink: 0, fontWeight: p.id === spyId ? 700 : 500, color: p.id === spyId ? "#E1594F" : "#F3EFE6" }}>
                {p.name}
              </div>
              <div className="bz-tally-bar-bg">
                <div className="bz-tally-bar" style={{ width: `${(counts[p.id] / room.players.length) * 100}%`, background: p.id === spyId ? "#E1594F" : "#52C9BD" }} />
              </div>
              <div style={{ fontSize: 13, width: 18, textAlign: dir === "rtl" ? "left" : "right" }}>{counts[p.id]}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {isNetHost ? (
            <button className="bz-btn" onClick={netPlayAgainOnline}><RotateCcw size={17} /> {s.playAgainBtn}</button>
          ) : (
            <div className="bz-warn">{s.lobbyWaitingHost}</div>
          )}
          <button className="bz-btn bz-btn-ghost" onClick={netLeaveRoom}><X size={17} /> {s.leaveRoomBtn}</button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  let content;
  if (appMode === "menu") {
    content = renderMenu();
  } else if (appMode === "online") {
    if (!room) {
      content = renderNetLanding();
    } else if (netScreen === "lobby") {
      content = renderNetLobby();
    } else if (netScreen === "reveal") {
      content = renderNetReveal();
    } else if (netScreen === "draw") {
      content = renderNetDraw();
    } else if (netScreen === "gallery") {
      content = renderNetGallery();
    } else if (netScreen === "vote") {
      content = renderNetVote();
    } else if (netScreen === "end") {
      content = renderNetEnd();
    } else {
      content = renderNetLanding();
    }
  } else {
    if (phase === "setup") content = renderSetup();
    else if (phase === "reveal") content = renderReveal();
    else if (phase === "draw") content = renderDraw();
    else if (phase === "gallery") content = renderGallery();
    else if (phase === "vote") content = renderVote();
    else content = renderEnd();
  }

  return (
    <div className="bz-root" dir={dir}>
      <Styles />
      {content}
    </div>
  );
}
