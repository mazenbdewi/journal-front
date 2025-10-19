<!-- pages/index.vue -->
<template>
  <main class="main">
    <div v-if="pending" class="loading">{{ $t("loading") }}</div>

    <div v-else>
      <HeroSection v-if="homeData.hero" :hero-data="homeData.hero" />
      <AboutSection v-if="homeData.about" :about-data="homeData.about" />
      <CountsSection
        v-if="homeData.stats && homeData.stats.length"
        :stats-data="homeData.stats"
      />
      <JournalsSection />
      <FeaturesSection
        v-if="homeData.partners && homeData.partners.length"
        :partners-data="homeData.partners"
      />
      <TrainersSection
        v-if="homeData.team && homeData.team.length"
        :team-data="homeData.team"
      />
    </div>
  </main>
</template>

<script setup>
// استيراد المكونات
const HeroSection = defineAsyncComponent(() =>
  import("@/components/sections/HeroSection.vue")
);
const AboutSection = defineAsyncComponent(() =>
  import("@/components/sections/AboutSection.vue")
);
const CountsSection = defineAsyncComponent(() =>
  import("@/components/sections/CountsSection.vue")
);
const FeaturesSection = defineAsyncComponent(() =>
  import("@/components/sections/FeaturesSection.vue")
);
const TrainersSection = defineAsyncComponent(() =>
  import("@/components/sections/TrainersSection.vue")
);

// جلب البيانات - سيعتمد على locale الحالي من vue-i18n
const { homeData, pending } = useHomeData();

// إعداد meta tags للـ SEO
useHead({
  title: homeData.value?.hero?.translation?.title || "Default Title",
  meta: [
    {
      name: "description",
      content:
        homeData.value?.hero?.translation?.description?.substring(0, 160) ||
        "Default description",
    },
  ],
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
}
</style>
