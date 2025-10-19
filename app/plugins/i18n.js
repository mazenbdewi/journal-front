import { createI18n } from 'vue-i18n'

// الترجمات
const messages = {
  ar: {
    journals: {
      title: "المجلات العلمية",
      subtitle: "أحدث الإصدارات والبحوث الأكاديمية",
      issue: "العدد",
      issues: "أعداد",
      articles: "بحوث",
      scientific_journal: "مجلة علمية",
      academic_publishing: "نشر أكاديمي",
      no_journals: "لا توجد مجلات متاحة",
      no_journals_message: "لم يتم إضافة أي مجلات بعد، سيتم عرضها هنا عند توفرها",
      default_description: "مجلة أكاديمية محكمة تنشر أحدث الأبحاث والدراسات العلمية.",
      default_journal_name: "المجلة السورية",
      login:"تسجيل الدخول",
    },
    actions: {
      try_again: "حاول مرة أخرى",
      browse_journal: "استعراض المجلة",
      load_more: "عرض المزيد"
    },
    "journal": {
        "loading": "جاري التحميل...",
        "loadingData": "جاري تحميل بيانات المجلة...",
        "error": "حدث خطأ",
        "failedLoad": "فشل في تحميل بيانات المجلة",
        "retry": "إعادة المحاولة",
        "issues": "الأعداد",
        "articles": "مقالات",
        "allYears": "جميع السنوات",
        "newestFirst": "الأحدث أولاً",
        "oldestFirst": "الأقدم أولاً",
        "noIssues": "لا توجد أعداد متاحة حالياً",
        "viewContent": "استعراض المحتوى",
        "previous": "السابق",
        "next": "التالي"
  },
    "search": {
      "title": "🔍 البحث في المقالات",
      "filters": {
        "all": "الكل",
        "title": "العنوان",
        "abstract": "الشرح",
        "keywords": "الكلمات المفتاحية",
        "author": "اسم الكاتب"
    },
    "placeholder": "اكتب ما تريد البحث عنه...",
    "button": "بحث",
    "loading": "جاري تحميل النتائج...",
    "results": "نتائج البحث:",
    "author": "المؤلف",
    "abstract": "الشرح",
    "viewArticle": "عرض المقال",
    "noResults": "لا توجد مقالات مطابقة للبحث.",
    "enterQuery": "يرجى إدخال كلمة للبحث"
  },

  "footer": {
    "copyright": "حقوق النشر",
    "university_name": "جامعة اللاذقية",
    "all_rights_reserved": "جميع الحقوق محفوظة",
    "affiliated": "هذا الموقع تابع ل",
    "university_link": "جامعة اللاذقية",
    "designed_by": "صمم بواسطة",
    "distributed_by": "موزع من قبل"
  },
    loading: "جاري التحميل...",
    "page": {
    "not_found": "الصفحة غير موجودة",
    "no_title": "بدون عنوان",
    "download_file": "تحميل الملف"
  },
  "loadingIssue": "جاري تحميل بيانات العدد...",
  "errorLoadingIssue": "حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة لاحقًا.",
  "retry": "إعادة المحاولة",
  "noTitle": "بدون عنوان",
  "year": "السنة",
  "articlesCount": "عدد المقالات",
  "publishedAt": "تاريخ النشر",
  "searchArticle": "🔍 ابحث عن مقال...",
  "defaultOrder": "ترتيب افتراضي",
  "sortByTitle": "ترتيب حسب العنوان",
  "sortByDate": "ترتيب حسب التاريخ",
  "reset": "♻️ إعادة تعيين",
  "viewArticle": "استعراض المقال",
  "noMatchingArticles": "لا توجد مقالات مطابقة لبحثك.",
  "notAvailable": "غير متوفر",
  "unknownAuthor": "مؤلف غير معروف",
   "loadingArticle": "جاري تحميل المقالة...",
  "errorLoadingArticle": "حدث خطأ أثناء تحميل المقالة.",
  "retry": "إعادة المحاولة",
  "publishedAt": "تاريخ النشر",
  "unknownAuthor": "مؤلف غير معروف",
  "mainAuthor": "المؤلف الرئيسي",
  "authors": "المؤلفون",
  "abstract": "الملخص",
  "downloadPDF": "تحميل ملف PDF",
  "copyLink": "نسخ الرابط",
  "copyCitation": "نسخ الاقتباس",
  "close": "إغلاق",
  "selectCitationFormat": "اختر تنسيق الاقتباس",
  "noYear": "بدون سنة",
  "unknownJournal": "مجلة غير معروفة",
  "copyLinkSuccess": "تم نسخ الرابط!",
  "copyLinkError": "حدث خطأ في النسخ",
  "copyCitationSuccess": "تم نسخ الاقتباس!",
  "copyCitationError": "حدث خطأ في نسخ الاقتباس",
   "about": {
    "vision_title": "رؤيتنا",
    "mission_title": "مهمتنا",
    "goals_title": "أهدافنا"
  },
   error: {
        '404': {
          title: 'الصفحة غير موجودة',
          message: 'الصفحة التي تبحث عنها قد تم إزالتها أو تغيير اسمها أو أنها غير متاحة مؤقتاً.',
          suggestions: 'إليك بعض الروابط المفيدة بدلاً من ذلك:',
          goHome: 'الذهاب إلى الصفحة الرئيسية',
          contactSupport: 'الاتصال بالدعم',
          goBack: 'العودة',
          searchTitle: 'ابحث في موقعنا',
          searchPlaceholder: 'ما الذي تبحث عنه؟',
          searchButton: 'بحث'
        },
        generic: {
          title: 'حدث خطأ',
          message: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.',
          suggestions: 'جرب أحد هذه الخيارات:',
          reload: 'إعادة تحميل الصفحة',
          goHome: 'الذهاب إلى الصفحة الرئيسية'
        }
      }
  },
  en: {
    journals: {
      title: "Scientific Journals",
      subtitle: "Latest publications and academic research",
      issue: "Issue",
      issues: "issues",
      articles: "articles",
      scientific_journal: "Scientific Journal",
      academic_publishing: "Academic Publishing",
      no_journals: "No journals available",
      no_journals_message: "No journals have been added yet, they will appear here when available",
      default_description: "A peer-reviewed academic journal publishing the latest research and studies.",
      default_journal_name: "Syrian Journal",
      login: "Login"

    },
    "about": {
    "vision_title": "Our Vision",
    "mission_title": "Our Mission",
    "goals_title": "Our Goals"
  },
    actions: {
      try_again: "Try again",
      browse_journal: "Browse Journal",
      load_more: "Load more"
    },
    "loadingIssue": "Loading issue data...",
    "errorLoadingIssue": "An error occurred while loading the data. Please try again later.",
    "retry": "Retry",
    "noTitle": "No Title",
    "year": "Year",
    "articlesCount": "Articles count",
    "publishedAt": "Published at",
    "searchArticle": "🔍 Search for an article...",
    "defaultOrder": "Default order",
    "sortByTitle": "Sort by title",
    "sortByDate": "Sort by date",
    "reset": "♻️ Reset",
    "viewArticle": "View Article",
    "noMatchingArticles": "No matching articles found.",
    "notAvailable": "Not available",
    "unknownAuthor": "Unknown author",
    "journal": {
    "loading": "Loading...",
    "loadingData": "Loading journal data...",
    "error": "Error",
    "failedLoad": "Failed to load journal data",
    "retry": "Retry",
    "issues": "Issues",
    "articles": "Articles",
    "allYears": "All years",
    "newestFirst": "Newest first",
    "oldestFirst": "Oldest first",
    "noIssues": "No available issues",
    "viewContent": "View Content",
    "previous": "Previous",
    "next": "Next",
    "loadingArticle": "Loading article...",
    "errorLoadingArticle": "An error occurred while loading the article.",
    "retry": "Retry",
    "publishedAt": "Published at",
    "unknownAuthor": "Unknown author",
    "mainAuthor": "Main author",
    "authors": "Authors",
    "abstract": "Abstract",
    "downloadPDF": "Download PDF",
    "copyLink": "Copy link",
    "copyCitation": "Copy citation",
    "close": "Close",
    "selectCitationFormat": "Select citation format",
    "noYear": "No year",
    "unknownJournal": "Unknown journal",
    "copyLinkSuccess": "Link copied!",
    "copyLinkError": "Error copying link",
    "copyCitationSuccess": "Citation copied!",
    "copyCitationError": "Error copying citation",
  },
    "search": {
    "title": "🔍 Article Search",
    "filters": {
      "all": "All",
      "title": "Title",
      "abstract": "Abstract",
      "keywords": "Keywords",
      "author": "Author"
    },
    "placeholder": "Type your search query...",
    "button": "Search",
    "loading": "Loading results...",
    "results": "Search results:",
    "author": "Author",
    "abstract": "Abstract",
    "viewArticle": "View Article",
    "noResults": "No matching articles found.",
    "enterQuery": "Please enter a search term."
    },
    "footer": {
    "copyright": "Copyright",
    "university_name": "Latakia University",
    "all_rights_reserved": "All Rights Reserved",
    "affiliated": "This site is affiliated with",
    "university_link": "Latakia University",
    "designed_by": "Designed by",
    "distributed_by": "Distributed by"
  },
    loading: "Loading...",
    "page": {
    "not_found": "Page not found",
    "no_title": "No Title",
    "download_file": "Download File"
  },
      error: {
        '404': {
          title: 'Page Not Found',
          message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
          suggestions: 'Here are some helpful links instead:',
          goHome: 'Go to Homepage',
          contactSupport: 'Contact Support',
          goBack: 'Go Back',
          searchTitle: 'Search our site',
          searchPlaceholder: 'What are you looking for?',
          searchButton: 'Search'
        },
        generic: {
          title: 'An Error Occurred',
          message: 'Sorry, something went wrong. Please try again later.',
          suggestions: 'Try one of these options:',
          reload: 'Reload Page',
          goHome: 'Go to Homepage'
        }
      }
  }
}

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ar', // اللغة الافتراضية
    fallbackLocale: 'en',
    messages
  })

  vueApp.use(i18n)
})