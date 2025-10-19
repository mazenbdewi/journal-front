<template>
  <a
    v-show="isVisible"
    href="#"
    class="scroll-top d-flex align-items-center justify-content-center"
    :class="{ active: isVisible }"
    @click.prevent="scrollToTop"
  >
    <i class="bi bi-arrow-up-short"></i>
  </a>
</template>

<script>
export default {
  name: "ScrollTop",
  data() {
    return {
      isVisible: false,
    };
  },
  mounted() {
    // إضافة مستمع لحدث التمرير بعد تأخير بسيط
    setTimeout(() => {
      window.addEventListener("scroll", this.handleScroll);
      this.handleScroll(); // التحقق من الوضع الأولي
    }, 100);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isVisible = window.scrollY > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
.scroll-top {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  right: 15px;
  bottom: 15px;
  z-index: 99999;
  background: #4154f1;
  width: 44px;
  height: 44px;
  border-radius: 5px;
  transition: all 0.4s;
  text-decoration: none;
}

.scroll-top.active {
  visibility: visible;
  opacity: 1;
}

.scroll-top i {
  font-size: 24px;
  color: white;
  line-height: 0;
}

.scroll-top:hover {
  background: #6776f4;
  transform: translateY(-3px);
}

/* تحسين المظهر على الأجهزة المحمولة */
@media (max-width: 768px) {
  .scroll-top {
    width: 36px;
    height: 36px;
    bottom: 20px;
    right: 20px;
  }

  .scroll-top i {
    font-size: 20px;
  }
}
</style>
