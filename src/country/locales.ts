export function findLocale(locale?: string) {
    return locales.filter(loc => loc.code === locale).pop();
}

export const locales = [
    {code: "ab", label: "Abkhaz", labelLocal: "Аҧсуа"},
    {code: "aa", label: "Afar", labelLocal: "Afaraf"},
    {code: "af", label: "Afrikaans", labelLocal: "Afrikaans"},
    {code: "ak", label: "Akan", labelLocal: "Akan"},
    {code: "sq", label: "Albanian", labelLocal: "Shqip"},
    {code: "am", label: "Amharic", labelLocal: "አማርኛ"},
    {code: "ar", label: "Arabic", labelLocal: "العربية"},
    {code: "an", label: "Aragonese", labelLocal: "Aragonés"},
    {code: "hy", label: "Armenian", labelLocal: "Հայերեն"},
    {code: "as", label: "Assamese", labelLocal: "অসমীয়া"},
    {code: "av", label: "Avaric", labelLocal: "Авар"},
    {code: "ae", label: "Avestan", labelLocal: "avesta"},
    {code: "ay", label: "Aymara", labelLocal: "Aymar"},
    {code: "az", label: "Azerbaijani", labelLocal: "Azərbaycanca"},
    {code: "bm", label: "Bambara", labelLocal: "Bamanankan"},
    {code: "ba", label: "Bashkir", labelLocal: "Башҡортса"},
    {code: "eu", label: "Basque", labelLocal: "Euskara"},
    {code: "be", label: "Belarusian", labelLocal: "Беларуская"},
    {code: "bn", label: "Bengali", labelLocal: "বাংলা"},
    {code: "bh", label: "Bihari", labelLocal: "भोजपुरी"},
    {code: "bi", label: "Bislama", labelLocal: "Bislama"},
    {code: "bs", label: "Bosnian", labelLocal: "Bosanski"},
    {code: "br", label: "Breton", labelLocal: "Brezhoneg"},
    {code: "bg", label: "Bulgarian", labelLocal: "Български"},
    {code: "my", label: "Burmese", labelLocal: "မြန်မာဘာသာ"},
    {code: "ca", label: "Catalan", labelLocal: "Català"},
    {code: "ch", label: "Chamorro", labelLocal: "Chamoru"},
    {code: "ce", label: "Chechen", labelLocal: "Нохчийн"},
    {code: "ny", label: "Chichewa", labelLocal: "Chichewa"},
    {code: "zh", label: "Chinese", labelLocal: "中文"},
    {code: "cv", label: "Chuvash", labelLocal: "Чӑвашла"},
    {code: "kw", label: "Cornish", labelLocal: "Kernewek"},
    {code: "co", label: "Corsican", labelLocal: "Corsu"},
    {code: "cr", label: "Cree", labelLocal: "ᓀᐦᐃᔭᐍᐏᐣ"},
    {code: "hr", label: "Croatian", labelLocal: "Hrvatski"},
    {code: "cs", label: "Czech", labelLocal: "Čeština"},
    {code: "da", label: "Danish", labelLocal: "Dansk"},
    {code: "dv", label: "Divehi", labelLocal: "Divehi"},
    {code: "nl", label: "Dutch", labelLocal: "Nederlands"},
    {code: "dz", label: "Dzongkha", labelLocal: "རྫོང་ཁ"},
    {code: "en", label: "English", labelLocal: "English"},
    {code: "eo", label: "Esperanto", labelLocal: "Esperanto"},
    {code: "et", label: "Estonian", labelLocal: "Eesti"},
    {code: "ee", label: "Ewe", labelLocal: "Eʋegbe"},
    {code: "fo", label: "Faroese", labelLocal: "Føroyskt"},
    {code: "fj", label: "Fijian", labelLocal: "Na Vosa Vaka-Viti"},
    {code: "fi", label: "Finnish", labelLocal: "Suomi"},
    {code: "fr", label: "French", labelLocal: "Français"},
    {code: "ff", label: "Fula", labelLocal: "Fulfulde"},
    {code: "gl", label: "Galician", labelLocal: "Galego"},
    {code: "ka", label: "Georgian", labelLocal: "ქართული"},
    {code: "de", label: "German", labelLocal: "Deutsch"},
    {code: "el", label: "Greek", labelLocal: "Ελληνικά"},
    {code: "gn", label: "Guaraní", labelLocal: "Avañe'ẽ"},
    {code: "gu", label: "Gujarati", labelLocal: "ગુજરાતી"},
    {code: "ht", label: "Haitian", labelLocal: "Kreyòl Ayisyen"},
    {code: "ha", label: "Hausa", labelLocal: "هَوُسَ"},
    {code: "he", label: "Hebrew", labelLocal: "עברית"},
    {code: "hz", label: "Herero", labelLocal: "Otjiherero"},
    {code: "hi", label: "Hindi", labelLocal: "हिन्दी"},
    {code: "ho", label: "Hiri Motu", labelLocal: "Hiri Motu"},
    {code: "hu", label: "Hungarian", labelLocal: "Magyar"},
    {code: "ia", label: "Interlingua", labelLocal: "Interlingua"},
    {code: "id", label: "Indonesian", labelLocal: "Bahasa Indonesia"},
    {code: "ie", label: "Interlingue", labelLocal: "Interlingue"},
    {code: "ga", label: "Irish", labelLocal: "Gaeilge"},
    {code: "ig", label: "Igbo", labelLocal: "Igbo"},
    {code: "ik", label: "Inupiaq", labelLocal: "Iñupiak"},
    {code: "io", label: "Ido", labelLocal: "Ido"},
    {code: "is", label: "Icelandic", labelLocal: "Íslenska"},
    {code: "it", label: "Italian", labelLocal: "Italiano"},
    {code: "iu", label: "Inuktitut", labelLocal: "ᐃᓄᒃᑎᑐᑦ"},
    {code: "ja", label: "Japanese", labelLocal: "日本語"},
    {code: "jv", label: "Javanese", labelLocal: "Basa Jawa"},
    {code: "kl", label: "Kalaallisut", labelLocal: "Kalaallisut"},
    {code: "kn", label: "Kannada", labelLocal: "ಕನ್ನಡ"},
    {code: "kr", label: "Kanuri", labelLocal: "Kanuri"},
    {code: "ks", label: "Kashmiri", labelLocal: "كشميري"},
    {code: "kk", label: "Kazakh", labelLocal: "Қазақша"},
    {code: "km", label: "Khmer", labelLocal: "ភាសាខ្មែរ"},
    {code: "ki", label: "Kikuyu", labelLocal: "Gĩkũyũ"},
    {code: "rw", label: "Kinyarwanda", labelLocal: "Kinyarwanda"},
    {code: "ky", label: "Kyrgyz", labelLocal: "Кыргызча"},
    {code: "kv", label: "Komi", labelLocal: "Коми"},
    {code: "kg", label: "Kongo", labelLocal: "Kongo"},
    {code: "ko", label: "Korean", labelLocal: "한국어"},
    {code: "ku", label: "Kurdish", labelLocal: "Kurdî"},
    {code: "kj", label: "Kwanyama", labelLocal: "Kuanyama"},
    {code: "la", label: "Latin", labelLocal: "Latina"},
    {code: "lb", label: "Luxembourgish", labelLocal: "Lëtzebuergesch"},
    {code: "lg", label: "Ganda", labelLocal: "Luganda"},
    {code: "li", label: "Limburgish", labelLocal: "Limburgs"},
    {code: "ln", label: "Lingala", labelLocal: "Lingála"},
    {code: "lo", label: "Lao", labelLocal: "ພາສາລາວ"},
    {code: "lt", label: "Lithuanian", labelLocal: "Lietuvių"},
    {code: "lu", label: "Luba-Katanga", labelLocal: "Tshiluba"},
    {code: "lv", label: "Latvian", labelLocal: "Latviešu"},
    {code: "gv", label: "Manx", labelLocal: "Gaelg"},
    {code: "mk", label: "Macedonian", labelLocal: "Македонски"},
    {code: "mg", label: "Malagasy", labelLocal: "Malagasy"},
    {code: "ms", label: "Malay", labelLocal: "Bahasa Melayu"},
    {code: "ml", label: "Malayalam", labelLocal: "മലയാളം"},
    {code: "mt", label: "Maltese", labelLocal: "Malti"},
    {code: "mi", label: "Māori", labelLocal: "Māori"},
    {code: "mr", label: "Marathi", labelLocal: "मराठी"},
    {code: "mh", label: "Marshallese", labelLocal: "Kajin M̧ajeļ"},
    {code: "mn", label: "Mongolian", labelLocal: "Монгол"},
    {code: "na", label: "Nauru", labelLocal: "Dorerin Naoero"},
    {code: "nv", label: "Navajo", labelLocal: "Diné Bizaad"},
    {code: "nd", label: "Northern Ndebele", labelLocal: "isiNdebele"},
    {code: "ne", label: "Nepali", labelLocal: "नेपाली"},
    {code: "ng", label: "Ndonga", labelLocal: "Owambo"},
    {code: "nb", label: "Norwegian Bokmål", labelLocal: "Norsk (Bokmål)"},
    {code: "nn", label: "Norwegian Nynorsk", labelLocal: "Norsk (Nynorsk)"},
    {code: "no", label: "Norwegian", labelLocal: "Norsk"},
    {code: "ii", label: "Nuosu", labelLocal: "ꆈꌠ꒿ Nuosuhxop"},
    {code: "nr", label: "Southern Ndebele", labelLocal: "isiNdebele"},
    {code: "oc", label: "Occitan", labelLocal: "Occitan"},
    {code: "oj", label: "Ojibwe", labelLocal: "ᐊᓂᔑᓈᐯᒧᐎᓐ"},
    {code: "cu", label: "Old Church Slavonic", labelLocal: "Словѣ́ньскъ"},
    {code: "om", label: "Oromo", labelLocal: "Afaan Oromoo"},
    {code: "or", label: "Oriya", labelLocal: "ଓଡି଼ଆ"},
    {code: "os", label: "Ossetian", labelLocal: "Ирон æвзаг"},
    {code: "pa", label: "Panjabi", labelLocal: "ਪੰਜਾਬੀ"},
    {code: "pi", label: "Pāli", labelLocal: "पाऴि"},
    {code: "fa", label: "Persian", labelLocal: "فارسی"},
    {code: "pl", label: "Polish", labelLocal: "Polski"},
    {code: "ps", label: "Pashto", labelLocal: "پښتو"},
    {code: "pt", label: "Portuguese", labelLocal: "Português"},
    {code: "qu", label: "Quechua", labelLocal: "Runa Simi"},
    {code: "rm", label: "Romansh", labelLocal: "Rumantsch"},
    {code: "rn", label: "Kirundi", labelLocal: "Kirundi"},
    {code: "ro", label: "Romanian", labelLocal: "Română"},
    {code: "ru", label: "Russian", labelLocal: "Русский"},
    {code: "sa", label: "Sanskrit", labelLocal: "संस्कृतम्"},
    {code: "sc", label: "Sardinian", labelLocal: "Sardu"},
    {code: "sd", label: "Sindhi", labelLocal: "سنڌي‎"},
    {code: "se", label: "Northern Sami", labelLocal: "Sámegiella"},
    {code: "sm", label: "Samoan", labelLocal: "Gagana Sāmoa"},
    {code: "sg", label: "Sango", labelLocal: "Sängö"},
    {code: "sr", label: "Serbian", labelLocal: "Српски"},
    {code: "gd", label: "Gaelic", labelLocal: "Gàidhlig"},
    {code: "sn", label: "Shona", labelLocal: "ChiShona"},
    {code: "si", label: "Sinhala", labelLocal: "සිංහල"},
    {code: "sk", label: "Slovak", labelLocal: "Slovenčina"},
    {code: "sl", label: "Slovene", labelLocal: "Slovenščina"},
    {code: "so", label: "Somali", labelLocal: "Soomaaliga"},
    {code: "st", label: "Southern Sotho", labelLocal: "Sesotho"},
    {code: "es", label: "Spanish", labelLocal: "Español"},
    {code: "su", label: "Sundanese", labelLocal: "Basa Sunda"},
    {code: "sw", label: "Swahili", labelLocal: "Kiswahili"},
    {code: "ss", label: "Swati", labelLocal: "SiSwati"},
    {code: "sv", label: "Swedish", labelLocal: "Svenska"},
    {code: "ta", label: "Tamil", labelLocal: "தமிழ்"},
    {code: "te", label: "Telugu", labelLocal: "తెలుగు"},
    {code: "tg", label: "Tajik", labelLocal: "Тоҷикӣ"},
    {code: "th", label: "Thai", labelLocal: "ภาษาไทย"},
    {code: "ti", label: "Tigrinya", labelLocal: "ትግርኛ"},
    {code: "bo", label: "Tibetan Standard", labelLocal: "བོད་ཡིག"},
    {code: "tk", label: "Turkmen", labelLocal: "Türkmençe"},
    {code: "tl", label: "Tagalog", labelLocal: "Tagalog"},
    {code: "tn", label: "Tswana", labelLocal: "Setswana"},
    {code: "to", label: "Tonga", labelLocal: "faka Tonga"},
    {code: "tr", label: "Turkish", labelLocal: "Türkçe"},
    {code: "ts", label: "Tsonga", labelLocal: "Xitsonga"},
    {code: "tt", label: "Tatar", labelLocal: "Татарча"},
    {code: "tw", label: "Twi", labelLocal: "Twi"},
    {code: "ty", label: "Tahitian", labelLocal: "Reo Mā’ohi"},
    {code: "ug", label: "Uyghur", labelLocal: "ئۇيغۇرچه"},
    {code: "uk", label: "Ukrainian", labelLocal: "Українська"},
    {code: "ur", label: "Urdu", labelLocal: "اردو"},
    {code: "uz", label: "Uzbek", labelLocal: "O‘zbek"},
    {code: "ve", label: "Venda", labelLocal: "Tshivenḓa"},
    {code: "vi", label: "Vietnamese", labelLocal: "Tiếng Việt"},
    {code: "vo", label: "Volapük", labelLocal: "Volapük"},
    {code: "wa", label: "Walloon", labelLocal: "Walon"},
    {code: "cy", label: "Welsh", labelLocal: "Cymraeg"},
    {code: "wo", label: "Wolof", labelLocal: "Wolof"},
    {code: "fy", label: "Western Frisian", labelLocal: "Frysk"},
    {code: "xh", label: "Xhosa", labelLocal: "isiXhosa"},
    {code: "yi", label: "Yiddish", labelLocal: "ייִדיש"},
    {code: "yo", label: "Yoruba", labelLocal: "Yorùbá"},
    {code: "za", label: "Zhuang", labelLocal: "Cuengh"},
    {code: "zu", label: "Zulu", labelLocal: "isiZulu"}
];


