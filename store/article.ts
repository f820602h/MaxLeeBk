import { defineStore } from "pinia";
import { parse } from "node-html-parser";

export type Article = {
  id: string;
  title: string;
  link: string;
  date: string;
  categories: string[];
  content: string;
};

type ArticleState = {
  articles: Article[];
  isFetched: boolean;
};

export const useArticleStore = defineStore({
  id: "article",
  state: (): ArticleState => ({
    articles: [],
    isFetched: false,
  }),
  actions: {
    async _actArticles(): Promise<void> {
      if (this.isFetched) return;
      const data = await $fetch("https://maxleebk.com/atom.xml");

      if (!data || typeof data !== "string") {
        this.articles = [];
      } else {
        this.isFetched = true;
        const doc = parse(data);
        const articleEntries = doc.querySelectorAll("entry");

        this.articles = Array.from(articleEntries).map((entry) => {
          const titleEl = entry.querySelector("title");
          const idEl = entry.querySelector("id");
          const publishedEl = entry.querySelector("published");
          const categoriesEl = entry.querySelectorAll("category");
          const contentEl = entry.querySelector("content");

          if (!titleEl || !idEl || !publishedEl || !contentEl) {
            return {
              id: "",
              title: "",
              link: "",
              date: "",
              categories: [],
              content: "",
            };
          }

          const id =
            idEl.innerHTML
              .split("/")
              .filter((str) => !!str)
              .pop() || "";
          const title = titleEl.innerHTML;
          const link = idEl.innerHTML;
          const date = publishedEl.innerHTML;
          const categories = Array.from(categoriesEl).map(
            (category) => category.getAttribute("term") || "",
          );
          const content = contentEl.innerHTML
            .replace("<![CDATA[", "")
            .replace("]]>", "");

          const div = parse("<div></div>");
          div.innerHTML = content;
          div.querySelectorAll("img").forEach((img) => {
            const imgSrc = img.getAttribute("src") || "";
            try {
              const url = new URL(imgSrc).href;
              img.setAttribute("src", url);
            } catch {
              img.setAttribute("src", link + imgSrc);
            }
          });

          return { id, title, link, date, categories, content: div.innerHTML };
        });
      }
    },
  },
});
