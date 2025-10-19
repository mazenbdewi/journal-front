<template>
  <section id="features" class="features section">
    <div class="container">
      <div class="row gy-4 justify-content-center">
        <div
          v-for="(partner, index) in partnersData"
          :key="partner.id"
          :class="columnClass"
          data-aos="fade-up"
          :data-aos-delay="calculateDelay(index)"
        >
          <div class="features-item">
            <img
              v-if="partner.image"
              :src="getImageUrl(partner.image)"
              :alt="partner.translation?.title || 'Partner'"
              class="partner-img"
            />
            <i
              v-else
              class="bi bi-building"
              :style="{ color: getIconColor(index) }"
            ></i>
            <h3>
              <a
                v-if="partner.link"
                :href="partner.link"
                class="stretched-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ partner.translation?.title || `Partner ${index + 1}` }}
              </a>
              <span v-else>
                {{ partner.translation?.title || `Partner ${index + 1}` }}
              </span>
            </h3>
          </div>
        </div>
        <!-- End Feature Item -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FeaturesSection",
  props: {
    partnersData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    columnClass() {
      const count = this.partnersData.length;

      // تحديد class الأعمدة بناءً على عدد الشركاء
      if (count === 1) return "col-12";
      if (count === 2) return "col-lg-6 col-md-6";
      if (count === 3) return "col-lg-4 col-md-4";
      if (count === 4) return "col-lg-3 col-md-6";
      if (count === 5) return "col-lg-2-4 col-md-4";

      // لأكثر من 5، نستخدم تخطيطًا متجاوبًا عامًا
      return "col-lg-3 col-md-4 col-sm-6";
    },
  },
  methods: {
    getImageUrl(path) {
      const config = useRuntimeConfig();
      return `${
        config.public.apiBase || "http://127.0.0.1:8000"
      }/storage/${path}`;
    },
    calculateDelay(index) {
      // حساب التأخير للأنيميشن بناءً على الفهرس
      return 100 + (index % 6) * 100;
    },
    getIconColor(index) {
      // ألوان متنوعة للأيقونات عندما لا تكون هناك صورة
      const colors = [
        "#ffbb2c",
        "#5578ff",
        "#e80368",
        "#e361ff",
        "#47aeff",
        "#ffa76e",
        "#11dbcf",
        "#4233ff",
        "#b2904f",
        "#b20969",
        "#ff5828",
        "#29cc61",
      ];
      return colors[index % colors.length];
    },
  },
};
</script>

<style scoped>
.features-item {
  padding: 30px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.features-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.partner-img {
  max-width: 120px;
  max-height: 80px;
  object-fit: contain;
  margin-bottom: 15px;
}

.features-item i {
  font-size: 40px;
  margin-bottom: 15px;
}

.features-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.features-item h3 a {
  color: #2c4964;
  text-decoration: none;
  transition: color 0.3s ease;
}

.features-item h3 a:hover {
  color: #5846f9;
}

/* تخصيص لـ 5 أعمدة */
.col-lg-2-4 {
  flex: 0 0 auto;
  width: 20%;
}

/* تحسين التنسيق للشاشات الصغيرة */
@media (max-width: 992px) {
  .col-lg-2-4 {
    width: 33.333333%;
  }
}

@media (max-width: 768px) {
  .col-lg-2-4 {
    width: 50%;
  }

  .features-item {
    margin-bottom: 20px;
    padding: 20px 15px;
  }

  .partner-img {
    max-width: 100px;
    max-height: 60px;
  }

  .features-item i {
    font-size: 32px;
  }
}

@media (max-width: 576px) {
  .col-lg-2-4,
  .col-md-4,
  .col-md-6 {
    width: 100%;
  }
}
</style>
