import { INSTANCE_V2, BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { API_VERSION, API, ENVIRONMENT_CLUSTER } = getConfig();
export const expressService = {
    // getAllNetworks: async () => {
    //     const res: any = await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/subnets`)
    //     return res.data.items
    // },

    getAllNetworks: async () => {
        return await BASE_URL_HOST.get(`/k8s/clusters/${ENVIRONMENT_CLUSTER}/apis/${API}/${API_VERSION}/namespaces/packetlifter-system/subnets`)
    },
    
    patchExpressSubnet: async (networkName: string, expressData: any) => {
        return await INSTANCE_V2.patch(
            `apis/${API}/${API_VERSION}/namespaces/default/subnets/${networkName}`,
            expressData,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
    },
}