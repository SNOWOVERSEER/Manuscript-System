import { http } from "../utils";

export function article_submission_API (data_) {
    return http({
        url: '/Manuscripts/submit',
        method: 'POST',
        data: data_
    })
}
