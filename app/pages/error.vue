<!-- pages/error.vue -->
<template>
  <div>
    <AppHeader />
    <main class="error-page">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <h1 v-if="error.statusCode === 404">الصفحة غير موجودة</h1>
            <h1 v-else>حدث خطأ ما</h1>
            <p v-if="error.statusCode === 404">
              عذراً، الصفحة التي تبحث عنها غير موجودة.
            </p>
            <p v-else>حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.</p>
            <NuxtLink to="/" class="btn btn-primary"
              >العودة إلى الصفحة الرئيسية</NuxtLink
            >
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  props: ["error"],
  layout: "default",
};
</script>

<style scoped>
.error-page {
  padding: 100px 0;
  text-align: center;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.error-page h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dc3545;
}

.error-page p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #6c757d;
}

.btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #5846f9;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3a2fd3;
  color: white;
}

/* تحسين التنسيق للغة العربية */
[dir="rtl"] .error-page {
  text-align: right;
}
</style>
