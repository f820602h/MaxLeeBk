import { SitemapStream, streamToPromise } from "sitemap";
import { serverQueryContent } from "#content/server";

export default defineEventHandler(async (event) => {
  // Fetch all documents
  const docs = await serverQueryContent(event).find();
  const sitemap = new SitemapStream({
    hostname: "https://maxlee.me",
  });

  sitemap.write({
    url: "/",
    changefreq: "monthly",
  });
  sitemap.write({
    url: "/blog",
    changefreq: "monthly",
  });
  sitemap.write({
    url: "/works",
    changefreq: "monthly",
  });

  for (const doc of docs) {
    sitemap.write({
      url: doc._path,
      changefreq: "monthly",
    });
  }

  sitemap.end();

  return streamToPromise(sitemap);
});
