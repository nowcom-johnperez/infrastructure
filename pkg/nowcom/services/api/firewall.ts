import { INSTANCE_V2 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { API_VERSION, API } = getConfig();
export const firewallService = {
    getApplicationList: async () => {
      return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/paloaltoapplications`)
    },
    getFirewallRules: async () => {
        return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules`);
    },
    createFirewall: async (data: any) => {
        return await INSTANCE_V2.post(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules`, data);
    },
}