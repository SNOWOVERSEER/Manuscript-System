import { http } from "../utils";

export function article_List_API(data_) {
<<<<<<< HEAD
    return http({
        url: `Manuscripts/AuthorSubmissions/${data_}`,
        method: 'GET'
    });
=======
  return http({
    url: `Manuscripts/AuthorSubmissions/${data_}`,
    method: "GET",
  });
>>>>>>> remotes/origin/editor_edit_article_DH
}
