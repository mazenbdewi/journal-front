<template>
  <nav v-if="breadcrumbs.length" class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
      >
        <template v-if="index === breadcrumbs.length - 1">
          {{ breadcrumb.name }}
        </template>
        <NuxtLink v-else :to="breadcrumb.to" class="breadcrumb-link">
          {{ breadcrumb.name }}
        </NuxtLink>

        <span
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb-separator"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const breadcrumbs = ref([]);

// توليد breadcrumbs بناءً على المسار الحالي
const generateBreadcrumbs = () => {
  const breadcrumbsArray = [];
  const pathArray = route.path.split("/").filter((item) => item);

  // إضافة الصفحة الرئيسية
  breadcrumbsArray.push({
    name: "الرئيسية",
    to: "/",
  });

  // بناء breadcrumbs الديناميكية
  let currentPath = "";
  for (const segment of pathArray) {
    currentPath += `/${segment}`;

    // الحصول على الاسم المعروض بناءً على المسار
    const displayName = getDisplayName(segment, currentPath);

    breadcrumbsArray.push({
      name: displayName,
      to: currentPath,
    });
  }

  breadcrumbs.value = breadcrumbsArray;
};

// الحصول على الاسم المعروض بناءً على المسار
const getDisplayName = (segment, fullPath) => {
  // إذا كان المسار يحتوي على معلمات (مثل slug)
  if (route.params.slug && fullPath.includes(route.params.slug)) {
    return getPageTitle(route.params.slug);
  }

  // أسماء المسارات المعرفة مسبقاً
  const routeNames = {
    about: "من نحن",
    contact: "اتصل بنا",
    journals: "المجلات",
    articles: "المقالات",
    issues: "الأعداد",
    search: "بحث",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    profile: "الملف الشخصي",
    dashboard: "لوحة التحكم",
  };

  return routeNames[segment] || segment;
};

// الحصول على عنوان الصفحة بناءً على slug (يمكن جلبها من API)
const getPageTitle = (slug) => {
  // يمكن استبدال هذا بطلب API لجلب العنوان الفعلي
  const pageTitles = {
    general: "المجلة العامة",
    since: "مجلة since",
    test: "صفحة اختبار",
  };

  return pageTitles[slug] || slug;
};

// مراقبة تغيرات المسار وتحديث breadcrumbs
watch(
  () => route.path,
  () => {
    generateBreadcrumbs();
  }
);

// توليد breadcrumbs الأولي
generateBreadcrumbs();
</script>

<style scoped>
.breadcrumb {
  padding: 1rem 0;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #6c757d;
}

.breadcrumb-item.active {
  color: #495057;
  font-weight: 500;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}

.breadcrumb-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #6c757d;
}

/* تنسيقات للغة الإنجليزية */
[dir="ltr"] .breadcrumb-list {
  direction: ltr;
}

/* تنسيقات للهواتف */
@media (max-width: 768px) {
  .breadcrumb {
    padding: 0.75rem 0;
  }

  .breadcrumb-list {
    padding: 0 0.5rem;
  }

  .breadcrumb-item {
    font-size: 0.8rem;
  }
}
</style>
