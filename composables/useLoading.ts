const isLoadingShow = ref<boolean>(true);
const isAnimationEnd = ref<boolean>(false);
const timer = ref<number>(0);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),
    isAnimationEnd: readonly(isAnimationEnd),
    show: () => {
      window.clearTimeout(timer.value);
      isLoadingShow.value = true;
      isAnimationEnd.value = false;
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
    animationEnd: () => {
      isAnimationEnd.value = true;
    },
  };
}
