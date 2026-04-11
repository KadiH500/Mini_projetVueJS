import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as null | any,
    token: null as null | string,
  }),

  actions: {
    setUser(user: any, token: string) {
      this.user = user;
      this.token = token;
    },

    logout() {
      this.user = null;
      this.token = null;
    },
  },
});