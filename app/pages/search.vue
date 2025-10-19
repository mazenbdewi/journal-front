<template>
  <div class="container my-5" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <h2 class="mb-4 text-center">{{ t("search.title") }}</h2>

    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <select v-model="filter" class="form-select">
          <option value="all">{{ t("search.filters.all") }}</option>
          <option value="title">{{ t("search.filters.title") }}</option>
          <option value="abstract">{{ t("search.filters.abstract") }}</option>
          <option value="keywords">{{ t("search.filters.keywords") }}</option>
          <option value="author">{{ t("search.filters.author") }}</option>
        </select>
      </div>

      <div class="col-md-6">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          :placeholder="t('search.placeholder')"
        />
      </div>

      <div class="col-md-2">
        <button @click="searchArticles" class="btn btn-primary w-100">
          {{ t("search.button") }}
        </button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">{{ t("search.loading") }}</p>
    </div>

    <!-- النتائج -->
    <div v-else-if="articles.length > 0">
      <h5 class="mb-3">{{ t("search.results") }}</h5>
      <ul class="list-group">
        <li
          v-for="article in articles"
          :key="article.id"
          class="list-group-item"
        >
          <strong>{{ article.title }}</strong
          ><br />
          <span>✍️ {{ t("search.author") }}: {{ article.main_author }}</span
          ><br />
          <span v-if="article.abstract">
            📄 {{ t("search.abstract") }}:
            {{ article.abstract.slice(0, 100) }}... </span
          ><br />
          <NuxtLink
            class="btn btn-sm btn-outline-primary mt-2"
            :to="getArticleUrl(article)"
          >
            {{ t("search.viewArticle") }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- لا توجد نتائج -->
    <div
      v-else-if="searchDone && articles.length === 0"
      class="alert alert-warning text-center mt-4"
    >
      {{ t("search.noResults") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRuntimeConfig } from "#imports";

// تعريف نوع المقالة
interface Article {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  main_author: string;
  journal?: { slug: string };
  issue?: { slug: string };
}

// نوع الاستجابة من API
interface SearchResponse {
  current_page: number;
  data: Article[];
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

const { locale, t } = useI18n();
const config = useRuntimeConfig();

const searchQuery = ref("");
const filter = ref("all");
const articles = ref<Article[]>([]);
const pending = ref(false);
const searchDone = ref(false);

// دالة البحث
const searchArticles = async () => {
  if (!searchQuery.value.trim()) {
    alert(t("search.enterQuery"));
    return;
  }

  pending.value = true;
  searchDone.value = false;

  try {
    // استخدام النوع الصحيح للـ $fetch
    const res = await $fetch<SearchResponse>(
      `${config.public.apiBase}/api/v1/articles/article/search`,
      {
        query: {
          q: searchQuery.value,
          filter: filter.value,
          locale: locale.value,
          per_page: 10,
        },
      }
    );

    articles.value = res.data || [];
    searchDone.value = true;
  } catch (error) {
    console.error("فشل البحث:", error);
    articles.value = [];
    searchDone.value = true;
  } finally {
    pending.value = false;
  }
};

// توليد رابط المقال
const getArticleUrl = (article: Article) => {
  const journalSlug = article.journal?.slug || "unknown-journal";
  const issueSlug = article.issue?.slug || "unknown-issue";
  return `/journals/${journalSlug}/${issueSlug}/${article.slug}`;
};
</script>

<style scoped>
.container {
  font-family: "Cairo", sans-serif;
}

.list-group-item {
  background-color: #f9f9f9;
}
</style>
