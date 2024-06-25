import { INSTANCE_V2 } from "../../config/axios";

export const expressService = {
    getAllNetworks: async () => {
        const res: any = await INSTANCE_V2.get(`/apis/packetlifter.io/v1/namespaces/default/subnets`)
        return res.data.items
    },
    
    patchExpressSubnet: async (networkName: string, expressData: any) => {
        return await INSTANCE_V2.patch(
            `apis/packetlifter.io/v1/namespaces/default/subnets/${networkName}`,
            expressData,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
    },
}