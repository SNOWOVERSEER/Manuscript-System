import { http } from "../utils";

export function article_submission_API (data_) {
    return http({
        url: '/Manuscripts/suubmit',
        method: 'POST',
        data: data_
    })
}
