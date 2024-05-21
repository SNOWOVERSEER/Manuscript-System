import { http } from "../utils";

export function article_List_API(data_) {
    return http({
        url: `Manuscripts/AuthorSubmissions/${data_}`,
        method: 'GET'
    })
}

export function article_Detail_API(data_) {
    return http({
        url: `Manuscripts/GetSubmissionDetailForAuthor/${data_}`,
        method: 'GET'
    })
}
