import preprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;

export default {
  // publicPath: "/iverks/vaffeltirsdag",
  publicPath: "/",
  preprocess: preprocess({ sourceMap: !production }),
};
