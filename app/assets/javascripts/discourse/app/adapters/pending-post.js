import RestAdapter from "discourse/adapters/rest";

export default RestAdapter.extend({
  jsonMode: true,

  pathFor() {
    return "/posts/pending";
  },
});
