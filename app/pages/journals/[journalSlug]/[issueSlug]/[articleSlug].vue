<template>
  <div class="article-content" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- قائمة المجلة -->
    <JournalMenuBreadcrumb
      :menu-items="menuItems"
      :fallback-journal="journalInfo"
    />

    <!-- Breadcrumb -->
    <Breadcrumb
      :journal-title="journalTitle"
      :issue-title="issueTitle"
      :article-title="articleTitle"
    />

    <!-- حالة التحميل -->
    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">{{ t("loadingArticle") }}</p>
    </div>

    <!-- حالة الخطأ -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ t("errorLoadingArticle") }} <br />
      <button class="btn btn-outline-danger mt-3" @click="fetchArticle">
        {{ t("retry") }}
      </button>
    </div>

    <!-- محتوى المقال -->
    <div v-else-if="article" class="bg-white p-4 rounded shadow">
      <h1 class="h3 mb-3">{{ article.title || t("noTitle") }}</h1>

      <p class="text-muted" v-if="article.published_at">
        <strong>{{ t("publishedAt") }}:</strong>
        {{ formatDate(article.published_at) }}
      </p>

      <p v-if="article.doi" class="mt-2">
        <span class="badge bg-secondary px-3 py-2">
          🔍 DOI: {{ article.doi }}
        </span>
      </p>

      <!-- المؤلفين -->
      <div v-if="article.authors?.length" class="mt-4">
        <h5 class="mb-3">{{ t("authors") }}:</h5>
        <p class="text-muted">{{ authorsLine }}</p>
      </div>

      <!-- الملخص -->
      <div v-if="article.abstract" class="mt-4">
        <h5>{{ t("abstract") }}:</h5>
        <p class="text-justify">{{ article.abstract }}</p>
      </div>

      <!-- تحميل PDF -->
      <div v-if="article.pdf_url" class="mt-4">
        <a :href="article.pdf_url" target="_blank" class="btn btn-primary">
          📄 {{ t("downloadPDF") }}
        </a>
      </div>

      <!-- روابط نسخ -->
      <div class="mt-4 d-flex flex-wrap gap-2">
        <button class="btn btn-outline-dark" @click="copyLink">
          🔗 {{ t("copyLink") }}
        </button>
        <button
          class="btn btn-outline-success"
          @click="showCitationModal = true"
        >
          ❝ {{ t("copyCitation") }}
        </button>
      </div>
    </div>

    <!-- نافذة النسخ -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block"
      v-if="showCitationModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ t("copyCitation") }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showCitationModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">{{ t("selectCitationFormat") }}:</label>
              <select v-model="selectedCitationFormat" class="form-select">
                <option value="apa">APA</option>
                <option value="mla">MLA</option>
                <option value="chicago">Chicago</option>
              </select>
            </div>
            <pre class="bg-light p-3 rounded">{{
              generateCitation(selectedCitationFormat)
            }}</pre>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="copyCitation">
              📋 {{ t("copyCitation") }}
            </button>
            <button
              class="btn btn-secondary"
              @click="showCitationModal = false"
            >
              {{ t("close") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import JournalMenuBreadcrumb from "@/components/JournalMenuBreadcrumb.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

interface Author {
  name: string;
  is_main_author?: boolean;
}

interface Article {
  id: number;
  slug: string;
  title?: string;
  abstract?: string;
  pdf_url?: string;
  pages?: string;
  doi?: string;
  authors?: Author[];
  published_at?: string;
  journal?: { title?: string; logo_url?: string };
  issue?: { title?: string; number?: string };
}

interface MenuResponse {
  menu_items: any[];
  journal: { name: string; logo_url?: string };
}

const route = useRoute();
const { locale, t } = useI18n();
const config = useRuntimeConfig();

const journalSlug = ref(route.params.journalSlug);
const issueSlug = ref(route.params.issueSlug);
const articleSlug = ref(route.params.articleSlug);

const article = ref<Article | null>(null);
const pending = ref(false);
const error = ref(false);
const showCitationModal = ref(false);
const selectedCitationFormat = ref("apa");

// قائمة المجلة ومعلوماتها
const menuItems = ref<any[]>([]);
const journalInfo = ref<{ name: string; logo_url?: string }>({
  name: "",
  logo_url: "",
});

// جلب المقال
const fetchArticle = async () => {
  if (!journalSlug.value || !issueSlug.value || !articleSlug.value) {
    error.value = true;
    return;
  }
  pending.value = true;
  error.value = false;
  try {
    const response = await $fetch<{ data: Article }>(
      `${config.public.apiBase}/api/v1/articles/${articleSlug.value}`,
      {
        query: {
          locale: locale.value,
          journal: journalSlug.value,
          issue: issueSlug.value,
        },
      }
    );
    article.value = response.data;
    // حفظ معلومات المجلة من المقال
    if (article.value.journal) {
      journalInfo.value = {
        name: article.value.journal.title || "",
        logo_url: article.value.journal.logo_url,
      };
    }
  } catch {
    error.value = true;
  } finally {
    pending.value = false;
  }
};

// جلب قائمة المجلة
const fetchMenuItems = async () => {
  let slug = journalSlug.value;
  if (Array.isArray(slug)) slug = slug[0];
  if (!slug) return;

  try {
    const data = await $fetch<MenuResponse>(
      `${config.public.apiBase}/api/v1/menu/${encodeURIComponent(
        slug
      )}?locale=${locale.value}`
    );
    menuItems.value = data.menu_items || [];
    journalInfo.value = data.journal || { name: "", logo_url: "" };
  } catch (err) {
    console.error("❌ فشل جلب قائمة المجلة:", err);
    menuItems.value = [];
    journalInfo.value = { name: "", logo_url: "" };
  }
};

onMounted(() => {
  fetchArticle();
  fetchMenuItems();
});

watch(locale, () => {
  fetchArticle();
  fetchMenuItems();
});

watch(
  () => route.params,
  (newParams) => {
    journalSlug.value = newParams.journalSlug;
    issueSlug.value = newParams.issueSlug;
    articleSlug.value = newParams.articleSlug;
    fetchArticle();
    fetchMenuItems();
  }
);

// Helper function to decode URI
const safeDecodeURIComponent = (
  value: string | string[] | undefined
): string => {
  if (!value) return "";
  if (Array.isArray(value)) return decodeURIComponent(value[0] || "");
  return decodeURIComponent(value);
};

// Computed properties
const journalTitle = computed(
  () => journalInfo.value.name || safeDecodeURIComponent(journalSlug.value)
);
const issueTitle = computed(
  () =>
    article.value?.issue?.title ||
    `Issue ${article.value?.issue?.number}` ||
    safeDecodeURIComponent(issueSlug.value)
);
const articleTitle = computed(
  () => article.value?.title || safeDecodeURIComponent(articleSlug.value)
);

const authorsLine = computed(() => {
  if (!article.value?.authors?.length) return "";
  return article.value.authors
    .map((a) => (a.is_main_author ? `${a.name} (${t("mainAuthor")})` : a.name))
    .join(", ");
});

const formatDate = (date?: string) => {
  if (!date) return t("noYear");
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const generateCitation = (format: string) => {
  if (!article.value) return "";
  const mainAuthor =
    article.value.authors?.find((a) => a.is_main_author) ||
    article.value.authors?.[0];
  const title = article.value.title || "";
  const year = article.value.published_at
    ? new Date(article.value.published_at).getFullYear()
    : t("noYear");
  const journal = journalInfo.value.name || t("unknownJournal");
  const volume = article.value.issue?.volume || "";
  const number = article.value.issue?.number || "";
  const doi = article.value.doi || "";
  const pages = article.value.pages || "";
  switch (format) {
    case "apa":
      return `${
        mainAuthor?.name || t("unknownAuthor")
      } (${year}). ${title}. ${journal}, ${volume}(${number}), ${pages}.${
        doi ? ` https://doi.org/${doi}` : ""
      }`;
    case "mla":
      return `${
        mainAuthor?.name || t("unknownAuthor")
      }. "${title}." ${journal}, vol. ${volume}, no. ${number}, ${year}${
        pages ? `, pp. ${pages}` : ""
      }.${doi ? ` https://doi.org/${doi}.` : ""}`;
    case "chicago":
      return `${
        mainAuthor?.name || t("unknownAuthor")
      }. "${title}." ${journal} ${volume}, no. ${number} (${year})${
        pages ? `: ${pages}.` : "."
      }${doi ? ` https://doi.org/${doi}.` : ""}`;
    default:
      return "";
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert(t("copyLinkSuccess"));
  } catch {
    alert(t("copyLinkError"));
  }
};

const copyCitation = async () => {
  try {
    await navigator.clipboard.writeText(
      generateCitation(selectedCitationFormat.value)
    );
    alert(t("copyCitationSuccess"));
    showCitationModal.value = false;
  } catch {
    alert(t("copyCitationError"));
  }
};
</script>

<style scoped>
.article-content {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: "Cairo", sans-serif;
}

/* تحسينات للعربية */
[dir="rtl"] .author-item {
  flex-direction: row-reverse;
}

/* تحسينات للجوال */
@media (max-width: 768px) {
  .bg-white {
    padding: 15px !important;
  }

  .d-flex {
    flex-direction: column;
  }
}
</style>
