<template>
  <section id="trainers-index" class="section trainers-index">
    <div class="container">
      <div class="row justify-content-center">
        <div
          v-for="(member, index) in teamData"
          :key="member.id"
          class="col-lg-4 col-md-6 d-flex"
          data-aos="fade-up"
          :data-aos-delay="calculateDelay(index)"
        >
          <div class="member">
            <img
              v-if="member.image"
              :src="getImageUrl(member.image)"
              class="img-fluid"
              :alt="member.translation?.name || 'Team member'"
            />
            <img
              v-else
              src="/assets/img/trainers/trainer-1.jpg"
              class="img-fluid"
              :alt="member.translation?.name || 'Team member'"
            />
            <div class="member-content">
              <h4>{{ member.translation?.name || $t("team.member_name") }}</h4>
              <span>{{
                member.translation?.position || $t("team.member_position")
              }}</span>
              <p class="formatted-text">
                {{ member.translation?.bio || $t("team.member_bio") }}
              </p>
              <div class="social">
                <a
                  v-if="member.social?.twitter"
                  :href="member.social.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-twitter-x"></i>
                </a>
                <a
                  v-if="member.social?.facebook"
                  :href="member.social.facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-facebook"></i>
                </a>
                <a
                  v-if="member.social?.instagram"
                  :href="member.social.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-instagram"></i>
                </a>
                <a
                  v-if="member.social?.linkedin"
                  :href="member.social.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i class="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- End Team Member -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "TrainersSection",
  props: {
    teamData: {
      type: Array,
      default: () => [],
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
      return 100 + (index % 3) * 100;
    },
  },
};
</script>

<style scoped>
.member {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin-bottom: 30px;
  height: 100%;
}

.member:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.member img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.member-content {
  padding: 25px;
  text-align: center;
}

.member-content h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #2c4964;
}

.member-content span {
  font-style: italic;
  display: block;
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 15px;
}

.member-content p {
  font-style: italic;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.formatted-text {
  white-space: pre-line;
}

.social {
  margin-top: 15px;
}

.social a {
  display: inline-block;
  width: 36px;
  height: 36px;
  background: #f8f9fa;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2c4964;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.social a:hover {
  background: #5846f9;
  color: #fff;
}

/* تحسين التنسيق للشاشات الصغيرة */
@media (max-width: 768px) {
  .member {
    margin-bottom: 20px;
  }

  .member-content {
    padding: 20px;
  }

  .member img {
    height: 250px;
  }
}
</style>
