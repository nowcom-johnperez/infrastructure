import { INSTANCE_V3 } from "../../config/axios";

export const dhcpService = {
    getAll: async () => {
        const res: any =  await INSTANCE_V3.get(`/k8s/clusters/c-m-qcvh2r78/apis/network.harvesterhci.io/v1alpha1/ippools`)
        // const res: any =  await INSTANCE_V3.get(`/apis/network.harvesterhci.io/v1alpha1/ippools`)
        return res.items
    }
}