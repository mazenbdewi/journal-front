<!-- ~/app/error.vue -->
<template>
  <div>
    <!-- سيعرض الهيدر والفوتر تلقائياً من خلال التخطيط -->
    <div :class="['error-content', { 'rtl-direction': isRTL }]">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h1>{{ error.statusCode }}</h1>
            <h2>{{ pageTitle }}</h2>
            <p>{{ errorMessage }}</p>

            <!-- محتوى اختياري للصفحة 404 -->
            <div v-if="error.statusCode === 404" class="optional-content mt-4">
              <div class="d-flex justify-content-center gap-3 flex-wrap">
                <button @click="goHome" class="btn btn-primary">
                  {{ $t("error.goHome") }}
                </button>
                <button @click="goBack" class="btn btn-outline-primary">
                  {{ $t("error.goBack") }}
                </button>
              </div>

              <!-- بحث داخل الموقع -->
              <div class="search-box mt-5">
                <h4>{{ $t("error.searchTitle") }}</h4>
                <form @submit.prevent="searchSite" class="mt-3">
                  <div class="input-group">
                    <input
                      v-model="searchQuery"
                      type="text"
                      :placeholder="$t('error.searchPlaceholder')"
                      class="form-control"
                    />
                    <button type="submit" class="btn btn-primary">
                      {{ $t("error.searchButton") }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- محتوى لأخطاء أخرى -->
            <div v-else class="mt-4">
              <button @click="reloadPage" class="btn btn-primary">
                {{ $t("error.reloadPage") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// تأكد من أن هذه الواردات صحيحة
const { locale, t } = useI18n();
const error = useError();
const router = useRouter();
const searchQuery = ref("");

const isRTL = computed(() => locale.value === "ar");

const pageTitle = computed(() => {
  return error.value.statusCode === 404
    ? t("error.404.title")
    : t("error.generic.title");
});

const errorMessage = computed(() => {
  return error.value.statusCode === 404
    ? t("error.404.message")
    : t("error.generic.message");
});

const goHome = () => {
  clearError({ redirect: "/" });
};

const goBack = () => {
  router.go(-1);
};

const reloadPage = () => {
  window.location.reload();
};

const searchSite = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
  }
};

// استخدام رأس الصفحة المناسب
useHead({
  title: pageTitle,
  htmlAttrs: {
    lang: locale.value,
    dir: isRTL.value ? "rtl" : "ltr",
  },
});
</script>

<style scoped>
.error-content {
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
}

h1 {
  font-size: 120px;
  font-weight: 700;
  color: #e03a3c;
  margin-bottom: 20px;
  line-height: 1;
}

h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e1e1e;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 30px;
}

.search-box {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-top: 30px;
}

.search-box h4 {
  margin-bottom: 15px;
}

.input-group {
  max-width: 500px;
  margin: 0 auto;
}

.btn {
  padding: 10px 25px;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #e03a3c;
  border-color: #e03a3c;
}

.btn-primary:hover {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  h1 {
    font-size: 80px;
  }

  h2 {
    font-size: 24px;
  }

  .error-content {
    padding: 40px 0;
  }
}
</style>
