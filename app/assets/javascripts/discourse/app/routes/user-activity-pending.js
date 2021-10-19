import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return this.store.findAll("pending-post");
  },

  activate() {
    this.appEvents.on("pending_posts_count", this, "refresh");
  },

  deactivate() {
    this.appEvents.off("pending_posts_count", this, "refresh");
  },
});
