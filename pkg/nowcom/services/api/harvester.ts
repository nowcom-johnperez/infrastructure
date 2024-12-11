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
    },
    getNamespaces: async () => {
      const res: any = await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/harvester/namespaces`)
      return res.data.data
    },
    fetchHarvester: async (schema: string, schemaClassMap?: any) => {
      const res: any = await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/harvester/${schema}`)
      const data = res.data?.data || [];

      if (schemaClassMap) {
        const SchemaClass = schemaClassMap[schema];
    
        if (SchemaClass) {
          return data.map((item: any) => new SchemaClass(item));
        }

        if (!SchemaClass) {
          console.warn(`No class defined for schema: ${schema}`);
          return data;
        }
      }

      return data;
    },
    getNamespaceQuota: async () => {
      const res: any =  await BASE_URL_HOST.get(`k8s/clusters/${CLUSTER}/v1/resourcequotas?exclude=metadata.managedFields`)
      return res.data?.data
    },
    getClusterNodes: async () => {
      const res: any =  await BASE_URL_HOST.get(`k8s/clusters/${CLUSTER}/v1/harvester/nodes?exclude=metadata.managedFieldss`)
      return res.data?.data
    },
    getMetricNodes: async () => {
      const res: any =  await BASE_URL_HOST.get(`k8s/clusters/${CLUSTER}/v1/harvester/metrics.k8s.io.nodes`)
      return res.data?.data
    },
    getLonghornNodes: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/harvester/longhorn.io.nodes?limit=1`)
        return res.data?.data
    },
    getLonghornSettings: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${CLUSTER}/v1/harvester/longhorn.io.nodes`)
        return res.data?.data
    },
}