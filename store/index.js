// في store/journal.js
export const actions = {
  // ... الإجراءات السابقة
  
  // إجراء لاستعادة الحالة عند التهيئة
  initializeStore({ commit }) {
    if (process.client) {
      const cachedJournal = sessionStorage.getItem('currentJournal');
      if (cachedJournal) {
        commit('SET_CURRENT_JOURNAL', JSON.parse(cachedJournal));
      }
    }
  }
}