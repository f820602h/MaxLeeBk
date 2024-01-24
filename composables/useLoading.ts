const isLoadingShow = ref<boolean>(true);
const isAnimationEnd = ref<boolean>(false);
export function useLoading() {
  return {
    isLoadingShow: readonly(isLoadingShow),
    isAnimationEnd: readonly(isAnimationEnd),

    show: () => {
      if (!process.client) return;
      isLoadingShow.value = true;
      isAnimationEnd.value = false;
    },
    hide: () => {
      if (!process.client) return;
      isLoadingShow.value = false;
      isAnimationEnd.value = true;
    },
    // animationEnd: () => {
    //   isAnimationEnd.value = true;
    // },
  };
}
