import { http } from "../utils";

export function article_List_API(data_) {
    return http({
        url: `Manuscripts/submissions/${data_}`,
        method: 'GET'
    });
}
