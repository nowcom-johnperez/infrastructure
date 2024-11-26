import https from 'https';
import axios from "axios";
import { getConfig } from './api';
const { BEARERTOKEN, NETWORK_URL_V2, NETWORK_URL_V3, BEARERTOKEN_V3, RANCHER_DIRECT_URL, RANCHER_BEARERTOKEN } = getConfig();

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

export const INSTANCE_V4 = axios.create({
    baseURL: NETWORK_URL_V3,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
    headers:    { Authorization: `Bearer ${ BEARERTOKEN_V3 }`, 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*, https://localhost:8005' }
})