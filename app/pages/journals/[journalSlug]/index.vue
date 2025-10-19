<template>
  <div class="article-page" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="article-container">
      <div class="journal-page">
        <!-- حالة التحميل -->
        <div v-if="pending" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ t("journal.loading") }}</span>
          </div>
          <p>{{ t("journal.loadingData") }}</p>
        </div>

        <!-- حالة الخطأ -->
        <div v-else-if="error" class="error-container">
          <div class="alert alert-danger">
            <h4>{{ t("journal.error") }}</h4>
            <p>{{ error.message || t("journal.failedLoad") }}</p>
            <button @click="refresh" class="btn btn-primary mt-2">
              {{ t("journal.retry") }}
            </button>
          </div>
        </div>

        <!-- عرض بيانات المجلة -->
        <div v-else-if="journal" class="journal-container">
          <!-- قائمة المجلة الخاصة -->
          <JournalMenuBreadcrumb
            v-if="menuItems.length"
            :menu-items="menuItems"
            :fallback-journal="journalInfo"
          />

          <Breadcrumb
            :journal-title="journal.current_translation?.title || journal.name"
          />

          <!-- رأس المجلة -->
          <div class="journal-header">
            <div class="cover-container">
              <img
                :src="journal.cover_url"
                :alt="journal.name"
                class="journal-cover"
              />
            </div>
            <div class="journal-info">
              <h1 class="journal-title">
                {{ journal.current_translation?.title || journal.name }}
              </h1>
              <div class="journal-meta">
                <span v-if="journal.issn" class="meta-item">
                  <i class="bi bi-journal"></i> ISSN: {{ journal.issn }}
                </span>
                <span v-if="journal.e_issn" class="meta-item">
                  <i class="bi bi-journal"></i> E-ISSN: {{ journal.e_issn }}
                </span>
                <span class="meta-item">
                  <i class="bi bi-collection"></i>
                  {{ journal.issues_count }} {{ t("journal.issues") }}
                </span>
                <span class="meta-item">
                  <i class="bi bi-file-text"></i>
                  {{ journal.articles_count }} {{ t("journal.articles") }}
                </span>
              </div>
              <p class="journal-description">
                {{ journal.current_translation?.description || "" }}
              </p>
            </div>
          </div>

          <!-- قسم الأعداد -->
          <div class="issues-section">
            <div class="section-header">
              <h2>{{ t("journal.issues") }}</h2>
              <div class="filter-controls">
                <select v-model="filterYear" class="form-select">
                  <option value="">{{ t("journal.allYears") }}</option>
                  <option
                    v-for="year in availableYears"
                    :key="year"
                    :value="year"
                  >
                    {{ year }}
                  </option>
                </select>
                <select v-model="sortBy" class="form-select">
                  <option value="newest">{{ t("journal.newestFirst") }}</option>
                  <option value="oldest">{{ t("journal.oldestFirst") }}</option>
                </select>
              </div>
            </div>

            <div v-if="filteredIssues.length === 0" class="no-issues">
              <i class="bi bi-inbox"></i>
              <p>{{ t("journal.noIssues") }}</p>
            </div>

            <div v-else class="issues-grid">
              <div
                v-for="issue in paginatedIssues"
                :key="issue.id"
                class="issue-card"
              >
                <div class="issue-header">
                  <h3 class="issue-title">
                    {{
                      issue.current_translation?.title ||
                      `العدد ${issue.volume} - ${issue.number}`
                    }}
                  </h3>
                  <span class="issue-year">{{ issue.year }}</span>
                </div>
                <div class="issue-details">
                  <p class="issue-date" v-if="issue.published_at">
                    <i class="bi bi-calendar"></i>
                    {{ formatDate(issue.published_at) }}
                  </p>
                  <p class="issue-articles">
                    <i class="bi bi-file-text"></i>
                    {{ issue.articles_count || 0 }} {{ t("journal.articles") }}
                  </p>
                </div>
                <div class="issue-actions">
                  <NuxtLink
                    :to="`/journals/${journalSlug}/${getIssueSlug(issue)}`"
                    class="btn btn-primary"
                  >
                    {{ t("journal.viewContent") }}
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="pagination-container">
              <nav aria-label="Page navigation">
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(currentPage - 1)"
                    >
                      {{ t("journal.previous") }}
                    </button>
                  </li>
                  <li
                    v-for="page in pages"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === currentPage }"
                  >
                    <button class="page-link" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button
                      class="page-link"
                      @click="changePage(currentPage + 1)"
                    >
                      {{ t("journal.next") }}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useNuxtApp } from "#app";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import Breadcrumb from "@/components/Breadcrumb.vue";
import JournalMenuBreadcrumb from "@/components/JournalMenuBreadcrumb.vue";

interface Issue {
  id: number;
  volume: string;
  number: string;
  year: number;
  slug?: string;
  current_translation?: {
    title?: string;
    slug?: string;
  };
  published_at?: string;
  articles_count?: number;
}

interface Journal {
  id: number;
  name: string;
  cover_url?: string;
  issn?: string;
  e_issn?: string;
  issues_count?: number;
  articles_count?: number;
  current_translation?: {
    title?: string;
    description?: string;
  };
  issues?: Issue[];
}

interface MenuItem {
  id: number;
  title: string;
  url: string;
  // يمكنك إضافة خصائص أخرى حسب الحاجة
}

interface MenuResponse {
  menu_items: MenuItem[];
  journal: {
    name: string;
    logo_url?: string;
    slug?: string;
    issn?: string;
    e_issn?: string;
  };
}

const { $config } = useNuxtApp();
const { locale, t } = useI18n();
const route = useRoute();

const journalSlug = computed(
  () => route.params.journalSlug || route.params.slug
);

const filterYear = ref("");
const sortBy = ref("newest");
const currentPage = ref(1);
const perPage = 12;

const journal = ref<Journal | null>(null);
const menuItems = ref<MenuItem[]>([]);
const journalInfo = ref<MenuResponse["journal"]>({ name: "", logo_url: "" });

const pending = ref(true);
const error = ref<any>(null);
const isMounted = ref(false);

// جلب بيانات المجلة
const fetchJournal = async () => {
  if (!isMounted.value) return;
  pending.value = true;
  error.value = null;
  try {
    const response = await $fetch<{ data: Journal }>(
      `${$config.public.apiBase}/api/v1/journals/${journalSlug.value}?locale=${locale.value}`
    );
    journal.value = response.data;

    // بعد جلب بيانات المجلة، جلب قائمة المجلة
    await fetchMenuItems();
  } catch (err) {
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// جلب قائمة المجلة مع معلوماتها
const fetchMenuItems = async () => {
  let slug = journalSlug.value;
  if (Array.isArray(slug)) slug = slug[0];
  if (!slug) return;

  try {
    const data = await $fetch<MenuResponse>(
      `${$config.public.apiBase}/api/v1/menu/${encodeURIComponent(
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
  isMounted.value = true;
  updateDocumentLanguage(locale.value);
  fetchJournal();

  const stopWatch = watch(locale, (newLocale) => {
    updateDocumentLanguage(newLocale);
    fetchJournal();
  });

  onUnmounted(() => stopWatch());
});

const updateDocumentLanguage = (lang: string) => {
  if (process.client && typeof document !== "undefined") {
    document.documentElement.lang = lang;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getIssueSlug = (issue: Issue) => {
  return issue.current_translation?.slug || issue.slug || "issue";
};

const availableYears = computed(() => {
  if (!journal.value?.issues) return [];
  const years = [...new Set(journal.value.issues.map((i) => i.year))];
  return years.sort((a, b) => b - a);
});

const filteredIssues = computed(() => {
  if (!journal.value?.issues) return [];

  let issues = [...journal.value.issues];

  if (filterYear.value) {
    const yearNumber = Number(filterYear.value);
    issues = issues.filter((issue) => issue.year === yearNumber);
  }

  issues.sort((a, b) => {
    if (sortBy.value === "newest")
      return (
        new Date(b.published_at || "").getTime() -
        new Date(a.published_at || "").getTime()
      );
    return (
      new Date(a.published_at || "").getTime() -
      new Date(b.published_at || "").getTime()
    );
  });

  return issues;
});

const totalPages = computed(() =>
  Math.ceil(filteredIssues.value.length / perPage)
);

const paginatedIssues = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredIssues.value.slice(start, start + perPage);
});

const pages = computed(() => {
  const range = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let i = start; i <= end; i++) range.push(i);
  return range;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const refresh = () => fetchJournal();
</script>

<style scoped>
.article-page {
  background-color: #f8f9fa;
  padding: 20px 0;
  min-height: 100vh;
}

.article-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 15px;
}

/* أنماط الصفحة كما هي */
.journal-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
}
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}
.journal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
.journal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.cover-container {
  margin-bottom: 20px;
}
.journal-cover {
  width: 200px;
  height: 280px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.journal-info {
  text-align: center;
}
.journal-title {
  color: #1a365d;
  margin-bottom: 15px;
  font-weight: 700;
}
.journal-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6c757d;
}
.journal-description {
  color: #4a5568;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}
.issues-section {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}
.section-header h2 {
  color: #1a365d;
  margin: 0;
}
.filter-controls {
  display: flex;
  gap: 10px;
}
.filter-controls .form-select {
  width: auto;
}
.no-issues {
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
}
.no-issues i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
}
.issues-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.issue-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.issue-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}
.issue-title {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}
.issue-year {
  background: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.issue-details {
  margin-bottom: 15px;
}
.issue-date,
.issue-articles {
  margin: 5px 0;
  color: #6c757d;
  font-size: 0.9rem;
}
.issue-actions {
  text-align: center;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .journal-header {
    padding: 20px;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-controls {
    width: 100%;
  }
  .filter-controls .form-select {
    width: 100%;
  }
  .issues-grid {
    grid-template-columns: 1fr;
  }
}
</style>
