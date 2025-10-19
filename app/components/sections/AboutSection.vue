<template>
  <section id="why-us" class="section why-us">
    <div class="container">
      <div class="row gy-4">
        <div class="col-lg-4" data-aos="fade-up" data-aos-delay="100">
          <div class="why-box">
            <h3>
              {{ aboutData?.translation?.title || $t("about.default_title") }}
            </h3>
            <p
              class="formatted-text"
              v-html="
                formatText(
                  aboutData?.translation?.description ||
                    $t('about.default_description')
                )
              "
            ></p>
          </div>
        </div>
        <!-- End Why Box -->

        <div class="col-lg-8 d-flex align-items-stretch">
          <div class="row gy-4" data-aos="fade-up" data-aos-delay="200">
            <div class="col-xl-4">
              <div
                class="icon-box d-flex flex-column justify-content-center align-items-center"
              >
                <i class="bi bi-clipboard-data"></i>
                <h4>{{ $t("about.vision_title") }}</h4>
                <p
                  class="formatted-text"
                  v-html="
                    formatText(
                      aboutData?.translation?.vision || $t('about.vision_text')
                    )
                  "
                ></p>
              </div>
            </div>
            <!-- End Icon Box -->
            <div class="col-xl-4" data-aos="fade-up" data-aos-delay="300">
              <div
                class="icon-box d-flex flex-column justify-content-center align-items-center"
              >
                <i class="bi bi-gem"></i>
                <h4>{{ $t("about.mission_title") }}</h4>
                <p
                  class="formatted-text"
                  v-html="
                    formatText(
                      aboutData?.translation?.mission ||
                        $t('about.mission_text')
                    )
                  "
                ></p>
              </div>
            </div>
            <!-- End Icon Box -->
            <div class="col-xl-4" data-aos="fade-up" data-aos-delay="400">
              <div
                class="icon-box d-flex flex-column justify-content-center align-items-center"
              >
                <i class="bi bi-inboxes"></i>
                <h4>{{ $t("about.goals_title") }}</h4>
                <p
                  class="formatted-text"
                  v-html="
                    formatText(
                      aboutData?.translation?.goals || $t('about.goals_text')
                    )
                  "
                ></p>
              </div>
            </div>
            <!-- End Icon Box -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "WhyUsSection",
  props: {
    aboutData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatText(text) {
      if (!text) return "";

      // استبدال النقاط بفواصل أسطر
      let formattedText = text.replace(/\. /g, ".<br><br>");

      // استبدال النقاط بدون مسافة (إذا كانت في نهاية الجملة)
      formattedText = formattedText.replace(/\.([^\s])/g, ".<br><br>$1");

      // إضافة فواصل أسطر بعد النقطتين
      formattedText = formattedText.replace(/: /g, ":<br>");

      return formattedText;
    },
  },
};
</script>
<style scoped>
.why-us .icon-box {
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 30px;
  border-radius: 8px;
  height: 100%;
  text-align: center;
  transition: all 0.3s ease-in-out;
}
.icon-box p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: center;
}

.formatted-text {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-align: center;
}

.why-us .icon-box i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.why-us .icon-box h4 {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.why-us .icon-box p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
}

.formatted-text {
  word-wrap: break-word;
  white-space: normal;
  overflow-wrap: break-word;
  text-align: center;
}
</style>
