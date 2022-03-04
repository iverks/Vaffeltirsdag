import preprocess from "svelte-preprocess";

const production = !process.env.ROLLUP_WATCH;

export default {
  publicPath: "/iverks/vaffeltirsdag",
  preprocess: preprocess({ sourceMap: !production }),
};
