import https from 'https';
import axios from "axios";
import { BEARERTOKEN, NETWORK_URL_V2 } from "./api";

export const INSTANCE_V2 = axios.create({
    baseURL:    NETWORK_URL_V2,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Bypass certificate validation
    headers:    { Authorization: `Bearer ${ BEARERTOKEN }` }
});