<template>
  <div class="page-content container my-5">
    <!-- حالة التحميل -->
    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">جاري تحميل الصفحة...</p>
    </div>

    <!-- حالة الخطأ -->
    <div v-else-if="error" class="alert alert-danger text-center">
      <p>حدث خطأ أثناء تحميل الصفحة.</p>
      <button class="btn btn-outline-danger mt-3" @click="fetchPage">
        إعادة المحاولة
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
            📄 تحميل الملف
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, unref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHead, useRuntimeConfig } from "#imports";

const route = useRoute();
const { locale } = useI18n();
const config = useRuntimeConfig();

const slug = ref(route.params.slug as string);
const pending = ref(false);
const error = ref(false);

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  file: string;
  keywords?: string[];
  meta_description?: string;
}

const pageData = ref<PageData | null>(null);

// رابط الملف
const getFileUrl = (path?: string) => {
  return path
    ? `${config.public.apiBase}/storage/${path}`
    : "/images/default.png";
};

// فحص إذا كان الملف صورة
const isImage = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  return ext ? imageExtensions.includes(ext) : false;
};

// جلب البيانات
const fetchPage = async () => {
  pending.value = true;
  error.value = false;

  try {
    const res: PageData = await $fetch(
      `${config.public.apiBase}/api/v1/pages/${slug.value}`,
      {
        query: {
          locale: locale.value,
        },
      }
    );

    pageData.value = res;

    if (!res || !res.title || !res.content) {
      error.value = true;

      return;
    }

    // إعداد معلومات SEO
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
          name: "keywords",
          content: res.keywords?.join(", ") || "",
        },
        {
          property: "og:title",
          content: res.title,
        },
        {
          property: "og:description",
          content:
            res.meta_description ||
            res.content.replace(/<[^>]+>/g, "").substring(0, 160),
        },
        {
          property: "og:image",
          content: getFileUrl(res.file),
        },
        {
          property: "og:url",
          content: `${config.public.baseUrl}/pages/${res.slug}`,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: res.title,
        },
        {
          name: "twitter:description",
          content:
            res.meta_description ||
            res.content.replace(/<[^>]+>/g, "").substring(0, 160),
        },
        {
          name: "twitter:image",
          content: getFileUrl(res.file),
        },
      ],
    });
  } catch (err) {
    error.value = true;
    console.error("فشل تحميل الصفحة:", err);
  } finally {
    pending.value = false;
  }
};

// المراقبة عند تغيير اللغة أو slug
watch(locale, fetchPage);
watch(
  () => route.params.slug,
  (newSlug) => {
    slug.value = newSlug as string;
    fetchPage();
  }
);

onMounted(fetchPage);
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
