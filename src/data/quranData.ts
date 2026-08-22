export interface QuranParaInfo {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameBengali: string;
  startSurah: string;
  startAyah: number;
  endSurah: string;
  endAyah: number;
  totalAyahs: number;
}

export const QURAN_PARAS: QuranParaInfo[] = [
  { number: 1, nameArabic: "الم", nameEnglish: "Alif Laam Meem", nameBengali: "আলিফ লাম মীম", startSurah: "Al-Fatihah", startAyah: 1, endSurah: "Al-Baqarah", endAyah: 141, totalAyahs: 148 },
  { number: 2, nameArabic: "سيقول", nameEnglish: "Sayaqool", nameBengali: "সাইয়াকূল", startSurah: "Al-Baqarah", startAyah: 142, endSurah: "Al-Baqarah", endAyah: 252, totalAyahs: 111 },
  { number: 3, nameArabic: "تلك الرسل", nameEnglish: "Tilkar Rusul", nameBengali: "তিলকার রুসুল", startSurah: "Al-Baqarah", startAyah: 253, endSurah: "Aal-Imran", endAyah: 92, totalAyahs: 126 },
  { number: 4, nameArabic: "لن تنالوا", nameEnglish: "Lan Tanaalu", nameBengali: "লান তানালূ", startSurah: "Aal-Imran", startAyah: 93, endSurah: "An-Nisa", endAyah: 23, totalAyahs: 131 },
  { number: 5, nameArabic: "والمحصنات", nameEnglish: "Wal Muhsanat", nameBengali: "ওয়াল মুহসানাত", startSurah: "An-Nisa", startAyah: 24, endSurah: "An-Nisa", endAyah: 147, totalAyahs: 124 },
  { number: 6, nameArabic: "لا يحب الله", nameEnglish: "La Yuhibbullah", nameBengali: "লা ইউহিব্বুল্লাহ", startSurah: "An-Nisa", startAyah: 148, endSurah: "Al-Ma'idah", endAyah: 81, totalAyahs: 110 },
  { number: 7, nameArabic: "وإذا سمعوا", nameEnglish: "Wa Iza Sami'oo", nameBengali: "ওয়া ইযা সামিঊ", startSurah: "Al-Ma'idah", startAyah: 82, endSurah: "Al-An'am", endAyah: 110, totalAyahs: 149 },
  { number: 8, nameArabic: "ولو أننا", nameEnglish: "Wa Lau Annana", nameBengali: "ওয়া লাও আন্নানা", startSurah: "Al-An'am", startAyah: 111, endSurah: "Al-A'raf", endAyah: 87, totalAyahs: 142 },
  { number: 9, nameArabic: "قال الملأ", nameEnglish: "Qalal Mala'u", nameBengali: "ক্বলাল মালাউ", startSurah: "Al-A'raf", startAyah: 88, endSurah: "Al-Anfal", endAyah: 40, totalAyahs: 159 },
  { number: 10, nameArabic: "واعلموا", nameEnglish: "Wa A'lamoo", nameBengali: "ওয়া'লামূ", startSurah: "Al-Anfal", startAyah: 41, endSurah: "At-Tawbah", endAyah: 92, totalAyahs: 127 },
  { number: 11, nameArabic: "يعتذرون", nameEnglish: "Ya'taziroon", nameBengali: "ইয়া'তাযিরূন", startSurah: "At-Tawbah", startAyah: 93, endSurah: "Hud", endAyah: 5, totalAyahs: 151 },
  { number: 12, nameArabic: "وما من دابة", nameEnglish: "Wa Mamin Da'abbah", nameBengali: "ওয়া মা মিন দাব্বাহ", startSurah: "Hud", startAyah: 6, endSurah: "Yusuf", endAyah: 52, totalAyahs: 170 },
  { number: 13, nameArabic: "وما أبرئ", nameEnglish: "Wa Ma Ubri'oo", nameBengali: "ওয়া মা উবাররিউ", startSurah: "Yusuf", startAyah: 53, endSurah: "Ibrahim", endAyah: 52, totalAyahs: 154 },
  { number: 14, nameArabic: "ربما", nameEnglish: "Rubama", nameBengali: "রুবামা", startSurah: "Al-Hijr", startAyah: 1, endSurah: "An-Nahl", endAyah: 128, totalAyahs: 227 },
  { number: 15, nameArabic: "سبحان الذي", nameEnglish: "Subhanallazi", nameBengali: "সুবহানাল্লাযী", startSurah: "Al-Isra", startAyah: 1, endSurah: "Al-Kahf", endAyah: 74, totalAyahs: 185 },
  { number: 16, nameArabic: "قال ألم", nameEnglish: "Qala Alam", nameBengali: "ক্বলা আলাম", startSurah: "Al-Kahf", startAyah: 75, endSurah: "Ta-Ha", endAyah: 135, totalAyahs: 269 },
  { number: 17, nameArabic: "اقترب للناس", nameEnglish: "Iqtaraba Lin Nasi", nameBengali: "ইক্বতারা বা লিন্নাস", startSurah: "Al-Anbiya", startAyah: 1, endSurah: "Al-Hajj", endAyah: 78, totalAyahs: 190 },
  { number: 18, nameArabic: "قد أفلح", nameEnglish: "Qad Aflaha", nameBengali: "ক্বাদ আফলাহা", startSurah: "Al-Mu'minun", startAyah: 1, endSurah: "Al-Furqan", endAyah: 20, totalAyahs: 202 },
  { number: 19, nameArabic: "وقال الذين", nameEnglish: "Wa Qalallazina", nameBengali: "ওয়া ক্বালাল্লাযীনা", startSurah: "Al-Furqan", startAyah: 21, endSurah: "An-Naml", endAyah: 55, totalAyahs: 339 },
  { number: 20, nameArabic: "أمن خلق", nameEnglish: "Amman Khalaqa", nameBengali: "আম্মান খালাক্বা", startSurah: "An-Naml", startAyah: 56, endSurah: "Al-Ankabut", endAyah: 45, totalAyahs: 171 },
  { number: 21, nameArabic: "اتل ما أوحي", nameEnglish: "Utlu Ma Oohiya", nameBengali: "উতলু মা উহিয়া", startSurah: "Al-Ankabut", startAyah: 46, endSurah: "Al-Ahzab", endAyah: 30, totalAyahs: 178 },
  { number: 22, nameArabic: "ومن يقنت", nameEnglish: "Wa Man Yaqnut", nameBengali: "ওয়া মাই ইয়াক্বনুত", startSurah: "Al-Ahzab", startAyah: 31, endSurah: "Ya-Sin", endAyah: 27, totalAyahs: 169 },
  { number: 23, nameArabic: "وما لي", nameEnglish: "Wa Maliya", nameBengali: "ওয়ামালিয়া", startSurah: "Ya-Sin", startAyah: 28, endSurah: "Az-Zumar", endAyah: 31, totalAyahs: 357 },
  { number: 24, nameArabic: "فمن أظلم", nameEnglish: "Faman Azlamu", nameBengali: "ফামান আযলামু", startSurah: "Az-Zumar", startAyah: 32, endSurah: "Fussilat", endAyah: 46, totalAyahs: 175 },
  { number: 25, nameArabic: "إليه يرد", nameEnglish: "Ilaihi Yuraddu", nameBengali: "ইলাইহি ইউরাদ্দু", startSurah: "Fussilat", startAyah: 47, endSurah: "Al-Jathiyah", endAyah: 37, totalAyahs: 246 },
  { number: 26, nameArabic: "حم", nameEnglish: "Ha'a Meem", nameBengali: "হা-মীম", startSurah: "Al-Ahqaf", startAyah: 1, endSurah: "Az-Zariyat", endAyah: 30, totalAyahs: 195 },
  { number: 27, nameArabic: "قال فما خطبكم", nameEnglish: "Qala Fama Khatbukum", nameBengali: "ক্বলা ফামা খাতবুকুম", startSurah: "Az-Zariyat", startAyah: 31, endSurah: "Al-Hadid", endAyah: 29, totalAyahs: 399 },
  { number: 28, nameArabic: "قد سمع الله", nameEnglish: "Qad Sami'allah", nameBengali: "ক্বাদ সামি'আল্লাহ", startSurah: "Al-Mujadila", startAyah: 1, endSurah: "At-Tahrim", endAyah: 12, totalAyahs: 137 },
  { number: 29, nameArabic: "تبارك الذي", nameEnglish: "Tabarakallazi", nameBengali: "তাবারাকাল্লাযী", startSurah: "Al-Mulk", startAyah: 1, endSurah: "Al-Mursalat", endAyah: 50, totalAyahs: 431 },
  { number: 30, nameArabic: "عم يتساءلون", nameEnglish: "Amma Yatasa'aloon", nameBengali: "আম্মা ইয়াতাসা'আলূন", startSurah: "An-Naba", startAyah: 1, endSurah: "An-Nas", endAyah: 6, totalAyahs: 564 },
];

export const POPULAR_SURAHS = [
  "Al-Fatihah", "Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf",
  "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun",
  "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad",
  "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Az-Zariyat", "At-Tur", "An-Najm",
  "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk",
  "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir",
  "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir",
  "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah",
  "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq",
  "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr",
  "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];
