import { INSTANCE_V4, INSTANCE_V3 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { TRIDENT_API, API_VERSION } = getConfig();
export const environmentService = {
    getAll: async () => {
        // const res: any =  await INSTANCE_V4.get(`/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
        const res: any =  await INSTANCE_V3.get(`/k8s/clusters/c-m-7mbwkw9d/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
        return res.data.items
    }
}