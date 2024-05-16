import { http } from "../utils";

export function Review_List_API(data_) {
    return http({
        url: `Manuscripts/ReviewerSubmissions/${data_}`,
        method: 'GET'
    });
}

export function Review_Get_Article(data_) {
    return http({
        url: `Manuscripts/submissiondetail/${data_}`,
        method: 'GET'
    });
}