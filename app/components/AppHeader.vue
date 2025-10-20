<template>
  <header
    class="app-header"
    :class="{ scrolled: isScrolled }"
    :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- 🔝 الشريط العلوي -->
    <div class="top-bar">
      <div class="logo-section">
        <NuxtLink to="/" class="logo-link">
          <img
            :src="journalLogo"
            :alt="journalName"
            class="journal-logo"
            @error="handleLogoError"
          />
          <h1 class="journal-name">{{ journalName }}</h1>
        </NuxtLink>
      </div>

      <div class="header-right">
        <NuxtLink class="search-btn desktop-only" to="/search">
          <i class="bi bi-search"></i>
        </NuxtLink>

        <!-- 🌐 التبديل بين اللغتين -->
        <div class="desktop-only language-switcher">
          <button
            @click="switchLanguage('ar')"
            :class="{ active: currentLocale === 'ar' }"
            class="lang-btn"
          >
            ع
          </button>
          <div class="lang-separator"></div>
          <button
            @click="switchLanguage('en')"
            :class="{ active: currentLocale === 'en' }"
            class="lang-btn"
          >
            EN
          </button>
        </div>

        <a
          class="login-btn desktop-only"
          :href="config.public.apiBase + '/adminpanel'"
        >
          <i class="bi bi-box-arrow-in-right"></i>
        </a>

        <button class="mobile-nav-toggle" @click="toggleMobileNav">
          <div class="hamburger" :class="{ active: mobileNavOpen }">
            <span class="line"></span><span class="line"></span
            ><span class="line"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- 📋 القائمة -->
    <nav
      :class="['nav-menu', { open: mobileNavOpen }]"
      aria-label="Main navigation"
    >
      <ul class="menu-list">
        <li
          v-for="item in menuItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'has-dropdown': item.children?.length }"
        >
          <NuxtLink
            v-if="!item.url.startsWith('http')"
            :to="item.url"
            :target="item.target"
            class="menu-item-link"
            @click="handleMenuClick"
          >
            {{ item.title }}
            <span v-if="item.children?.length" class="arrow">▼</span>
          </NuxtLink>
          <a
            v-else
            :href="item.url"
            :target="item.target"
            class="menu-item-link"
          >
            {{ item.title }}
            <span v-if="item.children?.length" class="arrow">▼</span>
          </a>
        </li>
      </ul>
    </nav>

    <!-- 🌒 خلفية القائمة الجانبية عند الفتح -->
    <div
      v-if="mobileNavOpen"
      class="nav-overlay"
      @click="mobileNavOpen = false"
    ></div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const config = useRuntimeConfig();

const currentLocale = ref(locale.value);
const menuItems = ref([]);
const journalData = ref(null);
const mobileNavOpen = ref(false);
const isScrolled = ref(false);
const logoError = ref(false);
const isLoading = ref(false);

// ✅ اسم وشعار المجلة العام (fallback ثابت)
const defaultJournal = {
  name: { ar: "المجلة العامة", en: "General Journal" },
  logo_url: "/logo.png",
};

// ✅ slug ثابت
const fixedSlug = computed(() =>
  currentLocale.value === "ar" ? "المجلة-العامة" : "general-journal"
);

// ✅ جلب القائمة
async function fetchMenu() {
  isLoading.value = true;
  try {
    const data = await $fetch(
      `${config.public.apiBase}/api/v1/menu/${fixedSlug.value}?locale=${currentLocale.value}`
    );
    menuItems.value = data.menu_items || [];
    journalData.value = data.journal || null;
    logoError.value = false;
  } catch (error) {
    console.error("❌ فشل تحميل القائمة:", error);
    menuItems.value = [
      {
        id: 1,
        title: currentLocale.value === "ar" ? "الرئيسية" : "Home",
        url: "/",
      },
    ];
    journalData.value = null;
  } finally {
    isLoading.value = false;
  }
}

// ✅ اسم المجلة
const journalName = computed(() => {
  if (journalData.value?.name) return journalData.value.name;
  return defaultJournal.name[currentLocale.value];
});

// ✅ شعار المجلة
const journalLogo = computed(() => {
  if (journalData.value?.logo_url && !logoError.value)
    return journalData.value.logo_url;
  return defaultJournal.logo_url;
});

// ✅ أخطاء تحميل الشعار
function handleLogoError(event) {
  logoError.value = true;
  event.target.src = defaultJournal.logo_url;
}

async function switchLanguage(lang) {
  if (locale.value === lang) return;

  // تغيير اللغة
  locale.value = lang;
  currentLocale.value = lang;

  // حفظ اللغة في التخزين المحلي
  localStorage.setItem("user_language", lang);

  // تحديث اتجاه الصفحة
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;

  // ✅ توجيه إلى الصفحة الرئيسية (بدون ar أو en)
  await router.push("/");

  // ✅ تحميل القائمة بعد تغيير اللغة
  await fetchMenu();
}

// ✅ التحكم في القائمة الجانبية
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
  document.body.style.overflow = mobileNavOpen.value ? "hidden" : "";
}

function handleMenuClick() {
  if (mobileNavOpen.value) {
    mobileNavOpen.value = false;
    document.body.style.overflow = "";
  }
}

// ✅ التعامل مع التمرير
function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  const savedLang = localStorage.getItem("user_language");
  if (savedLang) {
    locale.value = savedLang;
    currentLocale.value = savedLang;
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLang;
  }

  window.addEventListener("scroll", handleScroll);
  fetchMenu();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// ✅ راقب اللغة
watch(locale, () => {
  currentLocale.value = locale.value;
  fetchMenu();
});
</script>

<style scoped>
/* الأنماط تبقى كما هي بدون تغيير */
.app-header {
  background: linear-gradient(135deg, #4a5568, #2d3748);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header.scrolled {
  background: rgba(74, 85, 104, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.journal-logo {
  height: 45px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.app-header.scrolled .journal-logo {
  height: 38px;
  max-width: 140px;
}

.journal-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.journal-name {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: white;
  transition: all 0.3s ease;
}

.app-header.scrolled .journal-name {
  font-size: 1.1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  color: white;
  background-color: transparent;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  width: 40px;
  height: 40px;
}

.search-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.25rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.lang-separator {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 0.1rem;
}

.lang-btn {
  padding: 0.35rem 0.8rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.lang-btn.active,
.lang-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  color: white;
  background-color: #4299e1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.login-btn:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 2000;
  position: relative;
  width: 32px;
  height: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  transition: background 0.3s ease;
}

.mobile-nav-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 22px;
  height: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger .line {
  height: 2px;
  width: 100%;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active .line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.active .line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-menu {
  display: flex;
  justify-content: center;
  background: #2d3748;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  padding-right: 2rem;
  padding-left: 2rem;
}

[dir="rtl"] .menu-list {
  padding-right: 0;
  padding-left: 2rem;
  margin-right: 2rem;
}

[dir="ltr"] .menu-list {
  padding-right: 2rem;
  padding-left: 0;
  margin-left: 2rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
}

.menu-item-link {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.9rem 1.1rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  font-size: 0.95rem;
}

.menu-item-link:hover {
  color: #f6e05e;
  background: rgba(255, 255, 255, 0.05);
}

.menu-item-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #f6e05e;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.menu-item-link:hover::after {
  width: 70%;
}

.arrow {
  font-size: 0.65rem;
  transition: transform 0.3s ease;
  margin-left: 0.3rem;
}

[dir="rtl"] .arrow {
  margin-left: 0;
  margin-right: 0.3rem;
}

@media (max-width: 768px) {
  .journal-info {
    display: none;
  }

  .mobile-nav-toggle {
    display: flex;
  }

  .desktop-only {
    display: none !important;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    background: #2d3748;
    padding: 2rem 0;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
  }

  [dir="rtl"] .nav-menu {
    right: auto;
    left: 0;
    transform: translateX(-100%);
  }

  .nav-menu.open {
    transform: translateX(0);
  }

  .menu-list {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    padding: 0 !important;
  }

  .nav-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
  }

  .nav-link {
    justify-content: space-between;
    padding: 0;
    width: 100%;
  }

  .menu-item-link {
    justify-content: space-between;
    padding: 1rem 1.5rem;
    width: 100%;
  }
}

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
}
</style>
