const isLoadingShow = ref<boolean>(true);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),

    show: () => {
      if (!import.meta.client) return;
      isLoadingShow.value = true;
    },
    hide: () => {
      if (!import.meta.client) return;
      isLoadingShow.value = false;
    },
  };
}
