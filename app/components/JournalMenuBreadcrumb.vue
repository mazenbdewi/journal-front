<template>
  <div class="journal-header" :dir="isArabic ? 'rtl' : 'ltr'">
    <!-- 🖼️ الشعار -->
    <div class="journal-logo-container">
      <img
        v-if="activeJournal?.logo_url"
        :src="activeJournal.logo_url"
        :alt="activeJournal.name"
        class="journal-logo"
        @error="handleLogoError"
      />
      <img
        v-else
        src="/assets/img/logo.png"
        alt="Journal Logo"
        class="journal-logo fallback"
      />
      <h2 class="journal-name">{{ activeJournal?.name || defaultName }}</h2>
    </div>

    <!-- 📋 قائمة الروابط -->
    <nav class="breadcrumb journal-menu">
      <ul>
        <li
          v-for="(item, index) in menuItems"
          :key="item.id"
          class="breadcrumb-item"
        >
          <NuxtLink v-if="item.url" :to="item.url" class="breadcrumb-link">
            {{ item.title }}
          </NuxtLink>
          <span v-if="index !== menuItems.length - 1" class="separator">/</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  menuItems: {
    type: Array,
    default: () => [],
  },
  fallbackJournal: {
    type: Object,
    default: () => ({
      name: "",
      logo_url: null,
    }),
  },
});

const { locale } = useI18n();
const isArabic = computed(() => locale.value === "ar");

// المجلة التي نعرض بياناتها (شعار + اسم)
const activeJournal = computed(() => {
  const firstItemJournal = props.menuItems[0]?.journal;
  return firstItemJournal && firstItemJournal.name
    ? firstItemJournal
    : props.fallbackJournal;
});

const defaultName = computed(() =>
  isArabic.value ? "المجلة العامة" : "General Journal"
);

// fallback إذا تعذر تحميل الشعار
const handleLogoError = (event) => {
  event.target.src = "/assets/img/logo.png";
};
</script>

<style scoped>
.journal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  gap: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.journal-logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.journal-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 6px;
  transition: opacity 0.3s ease;
}

.journal-logo.fallback {
  opacity: 0.7;
}

.journal-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.journal-menu {
  width: 100%;
  overflow-x: auto;
}

.journal-menu ul {
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}

[dir="rtl"] .separator {
  transform: rotate(180deg);
}

/* دعم الجوال */
@media (max-width: 768px) {
  .journal-header {
    padding: 1rem;
    gap: 0.75rem;
  }

  .journal-logo {
    width: 60px;
    height: 60px;
  }

  .journal-name {
    font-size: 1.1rem;
  }

  .journal-menu ul {
    gap: 0.4rem;
    font-size: 0.95rem;
  }
}
</style>
