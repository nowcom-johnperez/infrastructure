import { INSTANCE_V2 } from "../../config/axios";

export const expressService = {
    getAllNetworks: async () => {
        const res: any = await INSTANCE_V2.get(`/apis/packetlifter.dev/v1/namespaces/default/subnets`)
        return res.data.items
    },

    getNetworkTranslations: async () => {
        return await INSTANCE_V2.get(`/apis/packetlifter.dev/v1/addresstranslations`)
    },
    
    patchExpressSubnet: async (networkName: string, expressData: any) => {
        return await INSTANCE_V2.patch(
            `apis/packetlifter.dev/v1/namespaces/default/subnets/${networkName}`,
            expressData,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
    },
}