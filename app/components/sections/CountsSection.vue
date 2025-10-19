<template>
  <section id="counts" class="section counts light-background">
    <div class="container" data-aos="fade-up" data-aos-delay="100">
      <div class="row gy-4 justify-content-center">
        <div
          v-for="(stat, index) in statsData"
          :key="stat.id"
          :class="columnClass"
        >
          <div class="stats-item text-center w-100 h-100">
            <span
              :data-purecounter-start="0"
              :data-purecounter-end="stat.number"
              data-purecounter-duration="2"
              class="purecounter"
            >
              {{ stat.number }}
            </span>
            <p>{{ stat.translation?.label || `Stat ${index + 1}` }}</p>
          </div>
        </div>
        <!-- End Stats Item -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CountsSection",
  props: {
    statsData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    columnClass() {
      const count = this.statsData.length;

      // تحديد class الأعمدة بناءً على عدد الإحصائيات
      if (count === 1) return "col-12";
      if (count === 2) return "col-lg-6 col-md-6";
      if (count === 3) return "col-lg-4 col-md-4";
      if (count === 4) return "col-lg-3 col-md-6";
      if (count === 5) return "col-lg-2-4 col-md-4"; // نحتاج CSS مخصص لـ 5 أعمدة

      // لأكثر من 5، نستخدم تخطيطًا متجاوبًا عامًا
      return "col-lg-3 col-md-4 col-sm-6";
    },
  },
  mounted() {
    // تهيئة PureCounter بعد تحميل المكون
    if (process.client && typeof PureCounter !== "undefined") {
      new PureCounter();
    } else if (process.client) {
      this.loadPureCounter();
    }
  },
  methods: {
    loadPureCounter() {
      // تحميل مكتبة PureCounter ديناميكيًا
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@srexi/purecounterjs/dist/purecounter_vanilla.js";
      script.onload = () => {
        new PureCounter();
      };
      document.head.appendChild(script);
    },
  },
};
</script>

<style scoped>
/* تحسين التنسيق العام */
.stats-item {
  padding: 30px 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stats-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.purecounter {
  font-size: 42px;
  font-weight: 700;
  color: #5846f9;
  display: block;
  margin-bottom: 10px;
}

.stats-item p {
  font-size: 16px;
  font-weight: 600;
  color: #2c4964;
  margin: 0;
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

  .stats-item {
    margin-bottom: 20px;
  }

  .purecounter {
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
