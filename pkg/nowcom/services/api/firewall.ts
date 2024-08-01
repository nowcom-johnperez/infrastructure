import { INSTANCE_V2 } from "../../config/axios";
import { getConfig } from "../../config/api";
const { API_VERSION, API } = getConfig();
export const firewallService = {
    getApplicationList: async () => {
      return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/applications`)
    },
    getFirewallRules: async () => {
        return await INSTANCE_V2.get(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules`);
    },
    updateFirewall: async (ruleName: string, data: any) => {
        return await INSTANCE_V2.patch(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules/${ruleName}`, data, { headers: { 'Content-Type': 'application/merge-patch+json' } });
    },
    createFirewall: async (data: any) => {
        return await INSTANCE_V2.post(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules`, data);
    },
    deleteFirewall: async (ruleNameIdentifier: string) => {
        return await INSTANCE_V2.delete(`/apis/${API}/${API_VERSION}/namespaces/default/securityrules/${ruleNameIdentifier}`)
    }
}