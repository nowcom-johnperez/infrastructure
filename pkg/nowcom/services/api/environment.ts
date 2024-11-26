import { INSTANCE_V4, BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { TRIDENT_API, API, ENVIRONMENT_CLUSTER } = getConfig();
export const environmentService = {
    // getAll: async () => {
    //     // const res: any =  await INSTANCE_V4.get(`/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
    //     const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/c-m-7mbwkw9d/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
    //     return res.data.items
    // }
    getAll: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${ENVIRONMENT_CLUSTER}/apis/${API}/v1alpha1/stacks`)
        return res.data.items
    }
}