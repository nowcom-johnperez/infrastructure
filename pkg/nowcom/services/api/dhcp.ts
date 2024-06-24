import { INSTANCE_V3 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { CLUSTER } = getConfig();
export const dhcpService = {
    getAll: async () => {
        const res: any =  await INSTANCE_V3.get(`/k8s/clusters/${CLUSTER}/apis/network.harvesterhci.io/v1alpha1/ippools`)
        return res.data.items
    }
}