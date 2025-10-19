<template>
  <div
    class="page-content container my-5"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- ✅ شريط تنقل المجلة -->
    <JournalMenuBreadcrumb
      :menu-items="menuItems"
      :fallback-journal="journalInfo"
      class="mb-4"
    />

    <!-- حالة التحميل -->
    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">{{ t("loadingPage") }}</p>
    </div>

    <!-- حالة الخطأ -->
    <div v-else-if="error" class="alert alert-danger text-center">
      <p>{{ t("errorLoadingPage") }}</p>
      <button class="btn btn-outline-danger mt-3" @click="fetchPage">
        {{ t("retry") }}
      </button>
    </div>

    <!-- عرض الصفحة -->
    <div v-else-if="pageData" class="bg-white p-4 rounded shadow">
      <!-- العنوان -->
      <h1 class="h3 mb-3">{{ pageData.title }}</h1>

      <!-- المحتوى -->
      <div v-html="pageData.content" class="formatted-text"></div>

      <!-- الملف -->
      <div v-if="pageData.file" class="mt-4 text-center">
        <template v-if="isImage(pageData.file)">
          <img
            :src="getFileUrl(pageData.file)"
            class="img-fluid rounded"
            :alt="pageData.title"
            loading="lazy"
          />
        </template>
        <template v-else>
          <a
            :href="getFileUrl(pageData.file)"
            target="_blank"
            class="btn btn-outline-primary"
            download
          >
            📄 {{ t("downloadFile") }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHead, useRuntimeConfig } from "#imports";
import JournalMenuBreadcrumb from "~/components/JournalMenuBreadcrumb.vue";

// Props & route
const route = useRoute();
const config = useRuntimeConfig();
const { locale, t } = useI18n();

const slug = ref(route.params.slug as string);

const pageData = ref<any>(null);
const pending = ref(true);
const error = ref(false);

const journalSlug = ref<string | null>(null);
const menuItems = ref<any[]>([]);
const journalInfo = ref<any>(null);

// دالة مساعدة لتحميل ملف
const getFileUrl = (path?: string) => {
  return path
    ? `${config.public.apiBase}/storage/${path}`
    : "/images/default.png";
};

// التحقق إذا الملف صورة
const isImage = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  return ext ? imageExtensions.includes(ext) : false;
};

// ✅ تحميل بيانات الصفحة
const fetchPage = async () => {
  pending.value = true;
  error.value = false;

  try {
    const res = await $fetch(
      `${config.public.apiBase}/api/v1/pages/${slug.value}`,
      {
        query: { locale: locale.value },
      }
    );

    pageData.value = res;
    journalSlug.value = res.journal_slug;

    // SEO
    useHead({
      title: res.title,
      meta: [
        {
          name: "description",
          content:
            res.meta_description ||
            res.content.replace(/<[^>]+>/g, "").substring(0, 160),
        },
        {
          property: "og:title",
          content: res.title,
        },
        {
          property: "og:image",
          content: getFileUrl(res.file),
        },
        {
          property: "og:url",
          content: `${config.public.baseUrl}/journals/${
            res.journal_slug || "general"
          }/${res.slug}`,
        },
      ],
    });

    // ✅ تحميل بيانات المجلة إذا موجود
    if (journalSlug.value) {
      await fetchJournalMenu(journalSlug.value);
    } else {
      menuItems.value = [];
      journalInfo.value = { name: "الرئيسية" };
    }
  } catch (err) {
    console.error("❌ فشل تحميل الصفحة:", err);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

// ✅ تحميل قائمة المجلة
const fetchJournalMenu = async (slug: string) => {
  try {
    const res = await $fetch(
      `${config.public.apiBase}/api/v1/menu/${encodeURIComponent(slug)}`,
      {
        query: { locale: locale.value },
      }
    );
    menuItems.value = res.menu_items || [];
    journalInfo.value = res.journal || { name: slug };
  } catch (err) {
    console.warn("⚠️ تعذر جلب قائمة المجلة:", err);
    menuItems.value = [];
    journalInfo.value = { name: slug };
  }
};

onMounted(fetchPage);
watch(locale, fetchPage);
watch(
  () => route.params.slug,
  (val) => {
    slug.value = val as string;
    fetchPage();
  }
);
</script>

<style scoped>
.page-content {
  font-family: "Cairo", sans-serif;
}
.formatted-text p {
  margin-bottom: 1rem;
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>
