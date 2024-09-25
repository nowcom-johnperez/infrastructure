import { INSTANCE_V4 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { TRIDENT_API, API_VERSION } = getConfig();
export const environmentService = {
    getAll: async () => {
        const res: any =  await INSTANCE_V4.get(`/apis/${TRIDENT_API}/${API_VERSION}/namespaces/default/createenvs`)
        return res.data.items
    }
}