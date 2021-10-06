import discourseComputed from "discourse-common/utils/decorators";
import RestModel from "discourse/models/rest";
import CategoryMixin from "discourse/mixins/category-object";
import { userPath } from "discourse/lib/url";
import { alias } from "@ember/object/computed";
import { cookAsync } from "discourse/lib/text";

const PendingPost = RestModel.extend(CategoryMixin, {
  expandedExcerpt: null,
  postUrl: alias("topic_url"),
  truncated: false,

  init() {
    this._super(...arguments);
    cookAsync(this.raw_text).then((cooked) => {
      this.set("expandedExcerpt", cooked);
    });
  },

  @discourseComputed("username")
  userUrl(username) {
    return userPath(username.toLowerCase());
  },
});

export default PendingPost;
