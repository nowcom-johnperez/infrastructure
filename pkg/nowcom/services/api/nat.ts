import { INSTANCE_V2 } from "../../config/axios";

export const natService = {
    getAllVnets: async () => {
        return await INSTANCE_V2.get(`/vnets/`)
    },

    createSubnet: async (vnet: string, data: any) => {
        return await INSTANCE_V2.post(`/vnets/${vnet}/subnets/`, data);
    },

    deleteNetwork: async (networkName: string) => {
        return await INSTANCE_V2.delete(`/vnets/${networkName}`)
    },

    getAllSubnets: async (subnetId: string) => {
        return await INSTANCE_V2.get(`/subnets/${subnetId}`)
    },

    deleteSubNet: async (subnetId: string) => {
        return await INSTANCE_V2.delete(`/subnets/${subnetId}`)
    },
}