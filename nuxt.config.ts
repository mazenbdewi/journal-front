// https://nuxt.com/docs/api/configuration/nuxt-config

// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        dir: 'rtl',
        lang: 'ar'
      },
      title: 'Mentor - Education Bootstrap Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Mentor Education Bootstrap Template' },
        { name: 'keywords', content: 'mentor, education, bootstrap, template' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com'},
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' },
        { rel: 'stylesheet', href: '/assets/vendor/bootstrap/css/bootstrap.min.css' },
        { rel: 'stylesheet', href: '/assets/vendor/bootstrap-icons/bootstrap-icons.css' },
        { rel: 'stylesheet', href: '/assets/vendor/aos/aos.css' },
        { rel: 'stylesheet', href: '/assets/vendor/glightbox/css/glightbox.min.css' },
        { rel: 'stylesheet', href: '/assets/vendor/swiper/swiper-bundle.min.css' },
        { rel: 'stylesheet', href: '/assets/css/main.css' }
      ],
      script: [
        { src: '/assets/vendor/bootstrap/js/bootstrap.bundle.min.js'},
        { src: '/assets/vendor/aos/aos.js'},
        { src: '/assets/vendor/glightbox/js/glightbox.min.js'},
        { src: '/assets/vendor/purecounter/purecounter_vanilla.js'},
        { src: '/assets/vendor/swiper/swiper-bundle.min.js'},
        { src: '/assets/vendor/php-email-form/validate.js'},
       
      ]
    },

  
  
  },
    plugins: [
    '~/plugins/main.client.js',
    '~/plugins/i18n.js'
  ],
  
    runtimeConfig: {
    public: {
      apiBase: 'http://172.16.45.111'
    }
  },
  routeRules: {
    '/': { ssr: false }
  },
   components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'ui-library': ['element-plus', 'vant'],
          }
        }
      }
    }
  },
  // إعدادات إضافية لتحسين الأداء
  features: {
    inlineStyles: false
  },

})