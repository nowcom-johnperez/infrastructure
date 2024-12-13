import { BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { ENVIRONMENT_CLUSTER, VANGUARD_API } = getConfig();

export const environmentService = {
    getAll: async () => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${ENVIRONMENT_CLUSTER}/apis/${VANGUARD_API}/stacks`)
        return res.data.items
    },

    getById: async (envName: string) => {
        const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/${ENVIRONMENT_CLUSTER}/apis/${VANGUARD_API}/namespaces/vanguard-system/stacks/${envName}`)
        return res.data
    },

    create: async (payload: any) => {
        const res: any =  await BASE_URL_HOST.post(`/k8s/clusters/${ENVIRONMENT_CLUSTER}/apis/${VANGUARD_API}/namespaces/vanguard-system/stacks`, payload)
        return res.data
    },

    getClusterRoleBinding: async (clusterId: string) => {
        const res: any =  await BASE_URL_HOST.get(`/v3/clusterroletemplatebindings?clusterId=${encodeURIComponent(clusterId)}`)
        return res.data
    },

    getClustersRoleBindings: async () => {
        const res: any =  await BASE_URL_HOST.get(`/v3/clusterroletemplatebindings`)
        return res.data
    },

    getUser: async (principalId: string) => {
        const res: any =  await BASE_URL_HOST.get(`/v3/principals/${encodeURIComponent(principalId)}`)
        return res.data
    },

    getUserGroup: async (principalId: string) => {
        const res: any =  await BASE_URL_HOST.get(`/v3/principals?provider=azuread_group`)
        return res.data
    },

    getAllUsers: async () => {
        const res: any =  await BASE_URL_HOST.get(`/v3/users`)
        return res.data
    },

    getAllGroups: async () => {
        const res: any =  await BASE_URL_HOST.get(`/v3/groups`)
        return res.data
    }
}