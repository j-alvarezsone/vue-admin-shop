import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export function usePagination() {
  const route = useRoute();
  const page = ref<number>(Number(route.query.page || 1));

  watch(() => route.query.page, (newPage) => {
    page.value = Number(newPage || 1);

    window.scrollTo({ behavior: "smooth", top: 0 });
  });

  return {
    page,
  };
}

export default usePagination;
