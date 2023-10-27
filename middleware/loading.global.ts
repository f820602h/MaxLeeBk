export default defineNuxtRouteMiddleware((to, from) => {
  // skip middleware on server
  if (process.server) return;
  if (to.path === from.path) return;
  const { show } = useLoading();
  show();
});
