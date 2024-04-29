const isLoadingShow = ref<boolean>(true);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),

    show: () => {
      if (!process.client) return;
      isLoadingShow.value = true;
    },
    hide: () => {
      if (!process.client) return;
      isLoadingShow.value = false;
    },
  };
}
