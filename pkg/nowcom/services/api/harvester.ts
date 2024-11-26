import { BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { CLUSTER } = getConfig();
export const harvesterService = {
    getAll: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/harvester/metrics.k8s.io.nodes`)
        return res.data
    },
    getUserTemplates: async () => {
      const res: any = await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/configmaps/default`)
      return res.data
    },
    getConfigMaps: async () => {
      const res: any = await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/configmaps`)
      return res.data
    }
}