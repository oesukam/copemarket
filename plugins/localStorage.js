import createPersistedState from 'vuex-persistedstate'

export default ({store, isHMR, isClient}) => {
    if (isHMR) return;
    if (isClient) {
        window.onNuxtReady((nuxt) => {
            createPersistedState({
                storage: {
                    getItem: key => localStorage.getItem(key),
                    setItem: (key, value) => localStorage.setItem(key, value),
                    removeItem: key => localStorage.removeItem(key)
                }
            })(store); // vuex plugins can be connected to store, even after creation
        })
    }
}
