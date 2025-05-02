import type { AuthStatus } from "../types";
import type { User } from "./../types/user";
import { useLocalStorage } from "@vueuse/core";
import { acceptHMRUpdate, defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { checkAuthAction, loginAction } from "../actions";
import { registerAction } from "../actions/register";
import { AUTH_STATUS } from "../constants/auth";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  /*******
** State **
******/
  const user = ref<User | undefined>();
  const token = useLocalStorage("token", "");
  const authStatus = ref<AuthStatus>(AUTH_STATUS.Checking);

  /*******
** Getters **
******/
  const isChecking = computed(() => authStatus.value === AUTH_STATUS.Checking);
  const isAuthenticated = computed(() => authStatus.value === AUTH_STATUS.Authenticated);
  const userName = computed(() => user.value?.fullName);
  const isAdmin = computed(() => user.value?.roles.includes("admin") ?? false);

  /*******
** Actions **
******/
  async function login(email: string, password: string) {
    try {
      const resp = await loginAction(email, password);

      if (!resp.ok) {
        logout();
        return false;
      }

      user.value = resp.user;
      token.value = resp.token;
      authStatus.value = AUTH_STATUS.Authenticated;

      await router.replace({ name: "home" });

      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  }

  async function register(fullName: string, email: string, password: string) {
    try {
      const resp = await registerAction(fullName, email, password);

      if (!resp.ok) {
        logout();
        return {
          ok: false,
          message: resp.message,
        };
      }

      user.value = resp.user;
      token.value = resp.token;
      authStatus.value = AUTH_STATUS.Authenticated;

      await router.replace({ name: "home" });

      return {
        ok: true,
        message: "Registration successful.",
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: "An error occurred while registering.",
      };
    }
  }

  async function logout() {
    user.value = undefined;
    token.value = "";
    authStatus.value = AUTH_STATUS.Unauthenticated;
    localStorage.removeItem("token");

    await router.replace({ name: "login" });

    return false;
  }

  async function checkAuthStatus(): Promise<boolean> {
    try {
      const resp = await checkAuthAction();

      if (!resp.ok) {
        return logout();
      }

      authStatus.value = AUTH_STATUS.Authenticated;
      user.value = resp.user;
      token.value = resp.token;

      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  }

  return {
    user,
    token,
    authStatus,
    isChecking,
    isAuthenticated,
    userName,
    isAdmin,
    login,
    register,
    logout,
    checkAuthStatus,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}

export const useAuthState = () => storeToRefs(useAuthStore());
export function useAuthActions() {
  const store = useAuthStore();

  return {
    $dispose: store.$dispose,
    $id: store.$id,
    $onAction: store.$onAction,
    $patch: store.$patch,
    $reset: store.$reset,
    $subscribe: store.$subscribe,
    $state: store.$state,
    _customProperties: store._customProperties,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuthStatus: store.checkAuthStatus,
  };
}
