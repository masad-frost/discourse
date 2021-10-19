import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return this.store.findAll("pending-post");
  },

  activate() {
    this.appEvents.on("pending_posts_count", this, "_handleCountChange");
  },

  deactivate() {
    this.appEvents.off("pending_posts_count", this, "_handleCountChange");
  },

  _handleCountChange(count) {
    this.refresh();
    if (count <= 0) {
      this.transitionTo("userActivity");
    }
  },
});
