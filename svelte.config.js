import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

export default {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
    }),
    paths: {
      base: process.env.NODE_ENV === "production" ? "/stacktrace" : "",
    },
  },
};
