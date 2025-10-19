<template>
  <section id="journals" class="journals section" :dir="direction">
    <!-- Section Title -->
    <div class="container section-title" data-aos="fade-up">
      <h2>{{ $t("journals.title") }}</h2>
      <p>{{ $t("journals.subtitle") }}</p>
    </div>
    <!-- End Section Title -->

    <div class="container">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ $t("loading") }}</span>
        </div>
        <p class="mt-3">{{ $t("loading") }}</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="alert alert-danger text-center">
        <p>{{ error }}</p>
        <button @click="fetchJournals" class="btn btn-primary mt-2">
          {{ $t("actions.try_again") }}
        </button>
      </div>

      <!-- حالة عدم وجود مجلات -->
      <div v-else-if="journals.length === 0" class="text-center py-5">
        <div class="empty-state">
          <i class="bi bi-journal-x"></i>
          <h4>{{ $t("journals.no_journals") }}</h4>
          <p>{{ $t("journals.no_journals_message") }}</p>
        </div>
      </div>

      <!-- عرض المجلات -->
      <div v-else class="row">
        <div
          v-for="(journal, index) in journals"
          :key="journal.id"
          class="col-lg-4 col-md-6 d-flex align-items-stretch mb-4"
          data-aos="zoom-in"
          :data-aos-delay="calculateDelay(index)"
        >
          <div class="journal-item card h-100">
            <!-- صورة المجلة -->
            <div class="image-container">
              <img
                :src="getJournalImage(journal)"
                class="card-img-top"
                :alt="getJournalTitle(journal)"
                @error="handleImageError"
                loading="lazy"
              />
              <div class="journal-badge">
                <span v-if="journal.issn">ISSN: {{ journal.issn }}</span>
              </div>
            </div>

            <!-- محتوى المجلة -->
            <div class="card-body d-flex flex-column">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <span class="category badge bg-primary">
                  {{ getCategoryText(journal) }}
                </span>
                <span class="latest-issue" v-if="journal.latest_issue">
                  {{ $t("journals.issue") }}
                  {{ journal.latest_issue.volume }}-{{
                    journal.latest_issue.number
                  }}
                </span>
              </div>

              <h5 class="card-title">
                <NuxtLink :to="getJournalLink(journal)">
                  {{ getJournalTitle(journal) }}
                </NuxtLink>
              </h5>

              <p class="card-text flex-grow-1">
                {{ getJournalDescription(journal) }}
              </p>

              <!-- إحصائيات المجلة -->
              <div
                class="journal-stats d-flex justify-content-between align-items-center mt-auto"
              >
                <div class="issues-count">
                  <i class="bi bi-journal"></i>
                  {{ journal.published_issues_count || 0 }}
                  {{ $t("journals.issues") }}
                </div>
                <div class="articles-count">
                  <i class="bi bi-file-text"></i>
                  {{ journal.published_articles_count || 0 }}
                  {{ $t("journals.articles") }}
                </div>
                <div class="year-count" v-if="journal.latest_issue">
                  <i class="bi bi-calendar"></i>
                  {{ journal.latest_issue.year }}
                </div>
              </div>

              <!-- زر زيارة المجلة -->
              <div class="text-center mt-3">
                <NuxtLink
                  :to="getJournalLink(journal)"
                  class="btn btn-outline-primary"
                >
                  {{ $t("actions.browse_journal") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
const journals = ref([]);
const loading = ref(true);
const error = ref(null);
const paginationMeta = ref({});
const paginationLinks = ref({});

const direction = computed(() => (locale.value === "ar" ? "rtl" : "ltr"));

const fetchJournals = async (url = null) => {
  try {
    loading.value = true;
    error.value = null;

    const config = useRuntimeConfig();

    // Use provided URL or construct default one
    const apiUrl =
      url ||
      `${config.public.apiBase}/api/v1/journals?per_page=6&locale=${locale.value}`;

    const response = await $fetch(apiUrl);

    // تصفية المجلات لاستبعاد تلك التي لديها slug = "general"
    const filteredData = response.data.filter(
      (journal) => journal.current_translation?.slug !== "general"
    );

    journals.value = filteredData;
    paginationMeta.value = response.meta;
    paginationLinks.value = response.links;
  } catch (err) {
    error.value = err.data?.message || t("error.loading_journals");
    console.error("Error fetching journals:", err);
  } finally {
    loading.value = false;
  }
};

const loadPage = (url) => {
  if (url) {
    fetchJournals(url);
  }
};

const handleImageError = (event) => {
  event.target.src = "/images/default-journal.png";
};

const calculateDelay = (index) => {
  return (index % 3) * 100 + 100;
};

const getJournalTitle = (journal) => {
  return (
    journal.current_translation?.title ||
    journal.name ||
    t("journals.unknown_title")
  );
};

const getJournalDescription = (journal) => {
  const description = journal.current_translation?.description;
  if (description) {
    return description.length > 120
      ? description.substring(0, 120) + "..."
      : description;
  }
  return t("journals.default_description");
};

const getJournalImage = (journal) => {
  return (
    journal.current_translation?.image_url ||
    journal.cover_url ||
    "/images/default-journal.png"
  );
};

const getJournalLink = (journal) => {
  const slug = journal.current_translation?.slug;
  return slug ? `/journals/${slug}` : "#";
};

const getCategoryText = (journal) => {
  // استخدام نوع المجلة بناءً على البيانات المتاحة
  if (journal.issn || journal.e_issn) {
    return t("journals.scientific_journal");
  }
  return t("journals.academic_publishing");
};

// عندما يتغير locale، قم بإعادة تحميل المجلات
watch(locale, () => {
  fetchJournals();
});

onMounted(() => {
  fetchJournals();
});
</script>

<style scoped>
.journals {
  background-color: #f8f9fa;
  padding: 80px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1a365d;
}

.section-title p {
  font-size: 16px;
  color: #6c757d;
}

.journal-item {
  border: none;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.journal-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.journal-item img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.journal-item:hover img {
  transform: scale(1.05);
}

.journal-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(26, 54, 93, 0.85);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.card-body {
  padding: 1.5rem;
}

.card-title a {
  color: #1a365d;
  text-decoration: none;
  transition: color 0.3s;
}

.card-title a:hover {
  color: #2c5282;
}

.category {
  font-size: 0.85rem;
}

.latest-issue {
  font-size: 0.85rem;
  color: #6c757d;
}

.journal-stats {
  font-size: 0.9rem;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
  margin-top: 15px;
}

.empty-state {
  color: #6c757d;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

/* تخصيصات للاتجاه RTL */
[dir="rtl"] .journal-badge {
  right: auto;
  left: 15px;
}

[dir="rtl"] .journal-stats {
  text-align: right;
}

[dir="rtl"] .card-title {
  text-align: right;
}

[dir="rtl"] .card-text {
  text-align: right;
}

[dir="rtl"] .me-2 {
  margin-right: 0 !important;
  margin-left: 0.5rem !important;
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: #1a365d;
  border-color: #1a365d;
}

.page-link {
  color: #1a365d;
  border: 1px solid #dee2e6;
}

.page-link:hover {
  color: #2c5282;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

@media (max-width: 768px) {
  .journals {
    padding: 60px 0;
  }

  .section-title h2 {
    font-size: 28px;
  }

  .journal-stats {
    flex-direction: column;
    gap: 10px;
  }

  .journal-stats > div {
    text-align: center;
  }
}
</style>
