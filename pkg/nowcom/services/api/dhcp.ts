import { BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { CLUSTER } = getConfig();
export const dhcpService = {
    getAll: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/apis/network.harvesterhci.io/v1alpha1/ippools`)
        return res.data.items
    }
}