// composables/useHomeData.js

import { useI18n } from "vue-i18n";

export const useHomeData = () => {
    
  const { locale } = useI18n();
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase || 'http://127.0.0.1:8000/api/v1';
  
  const { data, error, refresh, pending } = useAsyncData(
    `home-data-${locale.value}`,
    () => $fetch(`${apiUrl}/api/v1/home?locale=${locale.value}`),
    {
      server: true,
      default: () => ({
        hero: null,
        about: null,
        stats: [],
        partners: [],
        team: []
      }),
      watch: [locale] // يشاهد تغييرات locale ويعيد جلب البيانات
    }
  );

  if (error.value) {
    console.error('Error fetching home data:', error.value);
  }

  return {
    homeData: data,
    refreshHomeData: refresh,
    pending
  };
};