const isLoadingShow = ref<boolean>(true);
const timer = ref<number>(0);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),
    show: () => {
      window.clearTimeout(timer.value);
      isLoadingShow.value = true;
      // 保險關閉
      timer.value = window.setTimeout(
        () => (isLoadingShow.value = false),
        3000,
      );
    },
    hide: () => {
      window.clearTimeout(timer.value);
      isLoadingShow.value = false;
    },
  };
}
