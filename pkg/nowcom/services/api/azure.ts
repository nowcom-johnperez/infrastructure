import { axiosClient } from "../../config/axios";
import { getConfig } from "../../config/api";
const { AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_VALUE } = getConfig();
import qs from 'qs'
export const azureService = {
  fetchToken: async () => {
    const payload = qs.stringify({
      client_id: AZURE_CLIENT_ID,
      client_secret: AZURE_CLIENT_VALUE,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    })
    const res: any =  await axiosClient.post(`https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return res.data.access_token
  },
  fetchUserMemberOf: async (userId: string, token: string) => {
    const res: any = await axiosClient.get(`https://graph.microsoft.com/v1.0/users/${userId}/memberOf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return res.data
  }
}