<template>
  <div>
    <NuxtLayout>
      <NuxtPage :key="locale" />
    </NuxtLayout>

    <ScrollTop />
  </div>
</template>

<script>
import ScrollTop from "@/components/ScrollTop.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "App",
  components: {
    ScrollTop,
  },
  setup() {
    const { locale } = useI18n();

    if (process.client && typeof document !== "undefined") {
      watch(
        locale,
        (newLocale) => {
          document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = newLocale;
        },
        { immediate: true }
      );
    }

    return {
      locale,
    };
  },
};
</script>
