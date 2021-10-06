import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  model() {
    return this.store.findAll("pending-post");
  },

  activate() {
    this.appEvents.on("current-user:updated", this, "_refreshModel");
  },

  deactivate() {
    this.appEvents.off("current-user:updated", this, "_refreshModel");
  },

  _refreshModel(data) {
    if (data.hasOwnProperty("pending_posts_count")) {
      this.refresh();
    }
  },
});
