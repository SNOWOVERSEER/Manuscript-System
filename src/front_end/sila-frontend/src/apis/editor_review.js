import { http } from "../utils";

export function editor_review_API(id) {
  return http({
    url: `Manuscripts/submissiondetailforeditor/${id}`,
    method: "GET",
  });
}

export function editor_submit_decison_API(data_) {
  return http({
    url: `Manuscripts/submiteditordecision`,
    method: "POST",
    data: data_,
  });
}
