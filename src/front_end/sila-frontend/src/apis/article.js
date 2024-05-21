import { http } from "../utils";

export function article_List_API(data_) {
  return http({
    url: `Manuscripts/AuthorSubmissions/${data_}`,
    method: "GET",
  });
}

export function article_Detail_API(data_) {
  return http({
    url: `Manuscripts/GetSubmissionDetailForAuthor/${data_}`,
    method: "GET",
  });
}

export function request_Extension_API(data_) {
  return http({
    url: `Manuscripts/requestextension/${data_}`,
    method: "POST",
    data: data_,
  });
}

export function withdraw_API(data_) {
  return http({
    url: `Manuscripts/withdraw/${data_}`,
    method: "POST",
    data: data_,
  });
}

export function submit_Revision_API(data_) {
  return http({
    url: `Manuscripts/submitrevision`,
    method: "POST",
    data: data_,
  });
}
