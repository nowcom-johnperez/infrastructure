import { INSTANCE_V4, BASE_URL_HOST } from "../../config/axios";
import { getConfig } from "../../config/api";
const { TRIDENT_API, API, ENVIRONMENT_CLUSTER, VANGUARD_API } = getConfig();
// const FORGE_ENV_CLUSTER = 'c-m-mw54xzmw'
export const environmentService = {
    // getAll: async () => {
    //     // const res: any =  await INSTANCE_V4.get(`/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
    //     const res: any =  await BASE_URL_HOST.get(`/k8s/clusters/c-m-7mbwkw9d/apis/trident.dev/${API_VERSION}/namespaces/default/createenvs`)
    //     return res.data.items
    // }
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

    getAllUsers: async () => {
        const res: any =  await BASE_URL_HOST.get(`/v3/users`)
        return res.data
    },

    getAllGroups: async () => {
        const res: any =  await BASE_URL_HOST.get(`/v3/groups`)
        return res.data
    }
}