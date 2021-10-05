import DiscourseRoute from "discourse/routes/discourse";
import { observes } from "discourse-common/utils/decorators";

export default DiscourseRoute.extend({
  model() {
    return this.store.findAll("pending-post");
  },

  @observes("currentUser.pending_posts_count")
  _refreshModel: function () {
    this.refresh();
  },
});
