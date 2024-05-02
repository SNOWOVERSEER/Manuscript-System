import { http } from "../utils";

export function update_authors_info_API(data_){
    return http({
        url: `User/${localStorage.getItem('id')}`,
        method: 'PUT',
        data: data_,
        params: {
            Id:localStorage.getItem('id')
        }
    })
}