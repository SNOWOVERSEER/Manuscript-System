import { http } from "../utils";

export function article_List_API(data_) {
    return http({
        url: `Manuscripts/AuthorDashboard/${data_}`,
        method: 'GET'
    });
}
