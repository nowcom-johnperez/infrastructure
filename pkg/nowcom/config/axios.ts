import https from 'https';
import axios from "axios";
import { getConfig } from './api';
const { BEARERTOKEN, NETWORK_URL_V2, RANCHER_DIRECT_URL, RANCHER_BEARERTOKEN, GITLAB_URL, GITLAB_TOKEN, GITLAB_PROJECT_TOKEN } = getConfig();

export const axiosClient = axios;
export const INSTANCE_V2 = axios.create({
    baseURL:    NETWORK_URL_V2,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
    headers:    { Authorization: `Bearer ${ BEARERTOKEN }`, 'Accept': 'application/json', 'Access-Control-Allow-Origin': `*, https://localhost:8005` }
});

export const BASE_URL_HOST = axios.create({
    baseURL: RANCHER_DIRECT_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
    headers:    { Authorization: `Bearer ${ RANCHER_BEARERTOKEN }`, 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*, https://localhost:8005' }
})

export const GITLAB_API = axios.create({
    baseURL: GITLAB_URL,
    headers: {
        Authorization: `Bearer ${GITLAB_TOKEN}`,
        'Content-Type': 'application/json'
    }   
})

export const GITLAB_PROJECT_API = axios.create({
    baseURL: GITLAB_URL,
    headers: {
        'PRIVATE-TOKEN': GITLAB_PROJECT_TOKEN,
    },
})

