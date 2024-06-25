import { INSTANCE_V2 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { API_VERSION, API } = getConfig();
export const vNetService = {
    getNetworks: async () => {
        return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/vnets`)
    },

    getNetworkTranslations: async () => {
        return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/addresstranslations`)
    },

    createNetwork: async (data: any) => {
        return await INSTANCE_V2.post(`/apis/${API}/${API_VERSION}/namespaces/default/vnets`, data);
    },

    deleteNetwork: async (networkName: string) => {
        return await INSTANCE_V2.delete(`/apis/${API}/${API_VERSION}/namespaces/default/vnets/${networkName}`)
    },

    getSubnetByName: async (networkName: string) => {
        return await INSTANCE_V2.get(
            `apis/${API}/${API_VERSION}/namespaces/default/vnets/${networkName}`
        )
    },
    
    patchSubnet: async (networkName: string, vNetData: any) => {
        return await INSTANCE_V2.patch(
            `apis/${API}/${API_VERSION}/namespaces/default/vnets/${networkName}`,
            vNetData,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
    },
}