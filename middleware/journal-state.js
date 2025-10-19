export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore();
  const { locale } = useI18n();
  
  // إذا كنا ننتقل إلى صفحة مجلة
  const journalMatch = to.path.match(/^\/journals\/([^\/?#]+)/);
  if (journalMatch) {
    const journalSlug = journalMatch[1];
    
    // محاولة استعادة البيانات من الـ store أولاً
    if (store.journalsData[journalSlug]) {
      store.commit('SET_CURRENT_JOURNAL', store.journalsData[journalSlug]);
    }
  }
})