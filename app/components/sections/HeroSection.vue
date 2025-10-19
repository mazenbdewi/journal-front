<!-- components/HeroSection.vue -->
<template>
  <section id="hero" class="hero section dark-background">
    <img
      v-if="heroData?.image"
      :src="getImageUrl(heroData.image)"
      :alt="heroData?.translation?.title || $t('hero.default_title')"
      data-aos="fade-in"
    />
    <div class="container">
      <h2 data-aos="fade-up" data-aos-delay="100">
        {{ heroData?.translation?.title || $t("hero.default_title") }}
      </h2>
      <p data-aos="fade-up" data-aos-delay="200">
        {{
          heroData?.translation?.description || $t("hero.default_description")
        }}
      </p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  heroData: {
    type: Object,
    default: () => ({}),
  },
});

const getImageUrl = (path) => {
  const config = useRuntimeConfig();
  return `${config.public.apiBase || "http://127.0.0.1:8000"}/storage/${path}`;
};
</script>
