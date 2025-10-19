<template>
  <nav
    aria-label="breadcrumb"
    class="breadcrumb"
    :dir="isArabic ? 'rtl' : 'ltr'"
  >
    <ul>
      <li v-for="(crumb, index) in crumbs" :key="index">
        <NuxtLink v-if="index !== crumbs.length - 1" :to="crumb.path">
          {{ crumb.label }}
        </NuxtLink>
        <span v-else aria-current="page">{{ crumb.label }}</span>
        <span v-if="index !== crumbs.length - 1" class="separator">/</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const { locales, setLocale } = useI18n();

const route = useRoute();
const { locale, t, te } = useI18n();

const props = defineProps({
  journalTitle: {
    type: String,
    default: null,
  },
  issueTitle: {
    type: String,
    default: null,
  },
  articleTitle: {
    type: String,
    default: null,
  },
});

const crumbs = ref([]);
const isArabic = computed(() => locale.value === "ar");

// دالة للحصول على الترجمة مع قيمة افتراضية
const getTranslation = (key, fallback) => {
  return te(key) ? t(key) : fallback;
};

// دالة لتحديث breadcrumbs
const updateBreadcrumbs = () => {
  const segments = route.path.split("/").filter(Boolean);
  const newCrumbs = [];
  let pathAccumulator = "";

  const translate = (key, fallback) => {
    // إذا كان النظام يعمل، استخدم الترجمة
    if (te && te(key)) {
      return t(key);
    }

    // إذا لم يعمل النظام، استخدم القيم الافتراضية مباشرة
    const translations = {
      "breadcrumb.home": locale.value === "ar" ? "الرئيسية" : "Home",
      "breadcrumb.journals": locale.value === "ar" ? "المجلات" : "Journals",
    };

    return translations[key] || fallback || key;
  };

  // إضافة الصفحة الرئيسية دائماً مع الترجمة
  newCrumbs.push({
    label: translate("breadcrumb.home", "الرئيسية"),
    path: "/",
  });

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    pathAccumulator += `/${segment}`;
    let label = decodeURIComponent(segment);

    // استخدام الترجمة للمسارات الثابتة
    if (segment === "journals") {
      label = translate("breadcrumb.journals", "المجلات");
    }
    // استخدام العناوين الممررة من الصفحات الأم مع الأولوية
    else if (i === 1 && props.journalTitle) {
      label = props.journalTitle;
    } else if (i === 2 && props.issueTitle) {
      label = props.issueTitle;
    } else if (i === 3 && props.articleTitle) {
      label = props.articleTitle;
    }

    newCrumbs.push({
      label,
      path: pathAccumulator,
    });
  }

  crumbs.value = newCrumbs;
};

// مراقبة تغييرات المسار واللغة والخصائص
watch(
  [
    () => route.path,
    () => locale.value,
    () => props.journalTitle,
    () => props.issueTitle,
    () => props.articleTitle,
  ],
  updateBreadcrumbs,
  {
    immediate: true,
  }
);

// تحديث breadcrumbs عند تحميل المكون
onMounted(updateBreadcrumbs);
</script>

<style scoped>
.breadcrumb {
  padding: 1rem 0;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.breadcrumb ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0.5rem 1rem;
  margin: 0;
}

.breadcrumb li {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.breadcrumb a:hover {
  color: #0056b3;
  text-decoration: underline;
}

.breadcrumb .separator {
  margin: 0 0.5rem;
  color: #6c757d;
}

.breadcrumb span[aria-current="page"] {
  color: #6c757d;
  font-weight: bold;
}

.breadcrumb[dir="rtl"] .separator {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .breadcrumb ul {
    padding: 0.5rem;
  }

  .breadcrumb li {
    font-size: 0.9rem;
  }
}
</style>
