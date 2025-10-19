<template>
  <div class="error-layout">
    <!-- Header -->
    <AppHeader />

    <!-- Main content -->
    <main class="container py-5 text-center">
      <div class="error-content">
        <h1 class="display-1 text-danger">
          {{ error.statusCode || 500 }}
        </h1>
        <h2 class="h4 mb-3">
          {{ errorMessage }}
        </h2>
        <p class="text-muted mb-4">
          {{ errorDetails }}
        </p>

        <NuxtLink to="/" class="btn btn-primary">
          العودة إلى الصفحة الرئيسية
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const errorMessage = computed(() => {
  switch (error.statusCode) {
    case 404:
      return "الصفحة غير موجودة";
    case 500:
      return "خطأ في الخادم";
    default:
      return error.statusMessage || "حدث خطأ غير متوقع";
  }
});

const errorDetails = computed(() => {
  return error.message || "يرجى المحاولة لاحقًا أو العودة إلى الصفحة الرئيسية.";
});
</script>

<style scoped>
.error-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
}

.error-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
