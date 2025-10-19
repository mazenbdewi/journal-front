<template>
  <div class="issue-page" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="page-wrapper">
      <!-- حالة التحميل -->
      <div v-if="pending" class="loading">
        <p>{{ t("loadingIssue") }}</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="error">
        <p>{{ t("errorLoadingIssue") }}</p>
        <button @click="refreshData" class="btn btn-primary mt-2">
          {{ t("retry") }}
        </button>
      </div>

      <!-- المحتوى -->
      <div v-else-if="issue">
        <!-- قائمة المجلة -->
        <JournalMenuBreadcrumb
          :menu-items="menuItems"
          :fallback-journal="journalInfo"
        />

        <!-- Breadcrumb -->
        <Breadcrumb :journal-title="journalTitle" :issue-title="issueTitle" />

        <!-- رأس العدد -->
        <div class="issue-header box">
          <h1 class="issue-title">
            {{
              issue.current_translation?.title || issue.title || t("noTitle")
            }}
          </h1>
          <div class="issue-meta">
            <span>{{ t("year") }}: {{ issue.year }}</span>
            <span>{{ t("articlesCount") }}: {{ articlesList.length }}</span>
            <span v-if="issue.published_at">
              {{ t("publishedAt") }}: {{ formatDate(issue.published_at) }}
            </span>
          </div>
          <p
            v-if="issue.current_translation?.description"
            class="issue-description"
          >
            {{ issue.current_translation?.description }}
          </p>
        </div>

        <!-- أدوات التحكم -->
        <div class="filter-bar box">
          <div class="filter-group">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              :placeholder="t('searchArticle')"
            />
          </div>

          <div class="filter-group">
            <select v-model="sortBy" class="form-select">
              <option value="default">{{ t("defaultOrder") }}</option>
              <option value="title">{{ t("sortByTitle") }}</option>
              <option value="date">{{ t("sortByDate") }}</option>
            </select>
          </div>

          <div class="filter-group">
            <button @click="resetFilters" class="btn btn-secondary">
              {{ t("reset") }}
            </button>
          </div>
        </div>

        <!-- قائمة المقالات -->
        <div class="articles box">
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
          >
            <h3 class="article-title">
              {{ getArticleTitle(article) || t("noTitle") }}
            </h3>
            <p class="article-author">{{ mainAuthorName(article.authors) }}</p>
            <NuxtLink
              :to="getArticleLink(article)"
              class="btn btn-outline-primary"
            >
              {{ t("viewArticle") }}
            </NuxtLink>
          </div>
        </div>

        <div v-if="filteredArticles.length === 0" class="no-results">
          {{ t("noMatchingArticles") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

// تعريف الأنواع
interface Author {
  id: number;
  name: string;
  is_main_author?: boolean;
  email?: string;
  affiliation?: string;
}

interface Article {
  id: number;
  slug: string;
  title?: string;
  current_translation?: {
    title: string;
    description?: string;
  };

  authors?: Author[]; // جعلها اختيارية
  published_at?: string;
}

interface Issue {
  id: number;
  slug: string;
  title?: string;
  number?: string;
  year?: number;
  published_at?: string;
  current_translation?: {
    title: string;
    description?: string;
  };
  articles?: {
    data?: Article[];
  };
}

interface JournalInfo {
  name: string;
  logo_url?: string;
}

interface MenuItem {
  id: number;
  title: string;
  url: string;
  target: string;
  children?: MenuItem[];
}

const route = useRoute();
const { locale, t } = useI18n();
const config = useRuntimeConfig();

// معالجة الـ slugs بشكل آمن
const journalSlug = computed(() => {
  const slug = route.params.journalSlug;
  if (Array.isArray(slug)) return slug[0] || "";
  return slug || "";
});

const issueSlug = computed(() => {
  const slug = route.params.issueSlug;
  if (Array.isArray(slug)) return slug[0] || "";
  return slug || "";
});

const searchQuery = ref("");
const sortBy = ref("default");

// البيانات الأساسية
const issue = ref<Issue | null>(null);
const pending = ref(true);
const error = ref<any>(null);

const menuItems = ref<MenuItem[]>([]);
const journalInfo = ref<JournalInfo>({
  name: "",
  logo_url: "",
});

// دالة مساعدة لفك تشفير الـ URI بشكل آمن
const safeDecodeURI = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

// جلب بيانات العدد
const fetchIssue = async () => {
  pending.value = true;
  error.value = null;
  try {
    const data = await $fetch<{ data: Issue }>(
      `${config.public.apiBase}/api/v1/issues/${issueSlug.value}`,
      {
        query: {
          locale: locale.value,
          journal: journalSlug.value,
        },
      }
    );
    issue.value = data.data;
  } catch (err) {
    error.value = err;
    console.error("❌ فشل جلب بيانات العدد:", err);
  } finally {
    pending.value = false;
  }
};

// جلب قائمة المجلة مع معلوماتها
const fetchMenuItems = async () => {
  if (!journalSlug.value) return;

  try {
    const data = await $fetch<{ menu_items: MenuItem[]; journal: JournalInfo }>(
      `${config.public.apiBase}/api/v1/menu/${encodeURIComponent(
        journalSlug.value
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
  fetchIssue();
  fetchMenuItems();
});

watch(locale, () => {
  fetchIssue();
  fetchMenuItems();
});

// المقالات
const articlesList = computed(() => {
  if (!issue.value) return [];

  const articles = issue.value.articles?.data || issue.value.articles;
  if (Array.isArray(articles)) {
    return articles as Article[];
  }

  return [];
});

const getArticleTitle = (article: Article): string => {
  return article.current_translation?.title || article.title || "";
};

const filteredArticles = computed(() => {
  let articles = [...articlesList.value];

  if (searchQuery.value) {
    articles = articles.filter((article: Article) =>
      getArticleTitle(article)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }

  if (sortBy.value === "title") {
    articles.sort((a: Article, b: Article) =>
      getArticleTitle(a).localeCompare(getArticleTitle(b), locale.value)
    );
  } else if (sortBy.value === "date") {
    articles.sort(
      (a: Article, b: Article) =>
        new Date(b.published_at || 0).getTime() -
        new Date(a.published_at || 0).getTime()
    );
  }

  return articles;
});

// 🔧 الدالة المصححة - التعامل مع authors التي قد تكون undefined
const mainAuthorName = (authors?: Author[]): string => {
  if (!authors || authors.length === 0) return t("unknownAuthor");
  const main = authors.find((a) => a.is_main_author);
  return main?.name || authors[0].name;
};

// الآن نستخدم journalInfo لعرض اسم المجلة
const journalTitle = computed(
  () => journalInfo.value.name || safeDecodeURI(journalSlug.value)
);

const issueTitle = computed(
  () =>
    issue.value?.current_translation?.title ||
    issue.value?.title ||
    `Issue ${issue.value?.number}` ||
    safeDecodeURI(issueSlug.value)
);

const formatDate = (date: string): string => {
  if (!date) return t("notAvailable");

  try {
    return new Intl.DateTimeFormat(locale.value === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return t("notAvailable");
  }
};

const getArticleLink = (article: Article): string => {
  return `/journals/${journalSlug.value}/${issueSlug.value}/${article.slug}`;
};

const resetFilters = () => {
  searchQuery.value = "";
  sortBy.value = "default";
};

const refreshData = () => {
  fetchIssue();
  fetchMenuItems();
};
</script>

<style scoped>
.issue-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 30px 0;
}

.page-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 15px;
}

/* صناديق موحدة */
.box {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
}

.issue-view {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: "Cairo", sans-serif;
}

.loading,
.error {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: #888;
}

.issue-header {
  background: #f2f4f8;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.issue-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 10px;
}
.issue-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
  color: #6c757d;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.issue-description {
  font-size: 1rem;
  color: #444;
}

/* أدوات التحكم */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 20px;
}
.filter-group {
  flex-grow: 1;
  min-width: 200px;
}
.filter-bar .form-control,
.filter-bar .form-select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.filter-bar .btn {
  width: 100%;
  padding: 0.6rem;
}

/* قائمة المقالات */
.articles {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.article-card {
  background: #fff;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.article-title {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #2c3e50;
}
.article-author {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 10px;
}
.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
}
.btn-outline-primary:hover {
  background: #007bff;
  color: white;
}

/* لا توجد نتائج */
.no-results {
  text-align: center;
  color: #999;
  margin-top: 2rem;
  font-size: 1rem;
}
</style>
