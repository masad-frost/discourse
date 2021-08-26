import discourseComputed from "discourse-common/utils/decorators";
import Category from "discourse/models/category";
import RestModel from "discourse/models/rest";
import { userPath } from "discourse/lib/url";

const PendingPost = RestModel.extend({
  @discourseComputed("category_id")
  category(categoryId) {
    return Category.findById(categoryId);
  },

  @discourseComputed("username")
  userUrl(username) {
    return userPath(username.toLowerCase());
  },
});

export default PendingPost;
