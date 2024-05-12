import { http } from "../utils";

export function Review_List_API(data_) {
    return http({
        url: `Manuscripts/ReviewerSubmissions/${data_}`,
        method: 'GET'
    });
}