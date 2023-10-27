const isLoadingShow = ref(true);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),
    show: () => (isLoadingShow.value = true),
    hide: () => (isLoadingShow.value = false),
  };
}
