import { http } from "../utils";

export function editor_review_API(id) {
  return http({
    url: `Manuscripts/EditorSubmissions/${id}`,
    method: "GET",
  });
}
