import { INSTANCE_V2 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { API_VERSION, API } = getConfig();
export const expressService = {
    getAllNetworks: async () => {
        const res: any = await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/subnets`)
        return res.data.items
    },
    
    patchExpressSubnet: async (networkName: string, expressData: any) => {
        return await INSTANCE_V2.patch(
            `apis/${API}/${API_VERSION}/namespaces/default/subnets/${networkName}`,
            expressData,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
    },
}