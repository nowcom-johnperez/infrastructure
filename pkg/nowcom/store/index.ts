import { CoreStoreConfig, CoreStoreSpecifics } from '@shell/core/types';
import { vNetService } from '../services/api/vnet'
import { stripStrings, findTranslatedAddress } from '../services/helpers/utils'
import { PRODUCT_NAME } from '../config/constants';
interface Subnets {
    address: string;
    formattedAddress: string;
    name: string;
    longName: string;
    prefix_len: number;
    translatedAddress: string;
}

interface Vnets {
    name: string;
    subnets: Subnets[];
    subnetLength: number;
    cluster: string;
    translatedAddress: string;
}

interface vnetVariables {
    items: Vnets[]
}

const vnetExtensionFactory = (): CoreStoreSpecifics => {
    return {
        state() {
            return {
                items: []
            }
        },
        getters: {
            items: (state: vnetVariables) => state.items,
        },
        mutations: {
            setItems(state: vnetVariables, items: Vnets[]) {
                state.items = items
            },
            addItem(state: vnetVariables, item: Vnets) {
                state.items.push(item)
            },
            updateItem() {
                // do nothing
            },
            removeItem(state: vnetVariables, itemName: string) {
                state.items = state.items.filter(item => item.name !== itemName)
            }
        },
        actions: {
            async findAll({ commit }: any) {
                const [networks, networkTranslations] = await Promise.all([
                    vNetService.getNetworks(),
                    vNetService.getNetworkTranslations()
                ]);
        
                const parsedData = networks.data.items.map((item: any) => {
        
                  const translatedAddressData = networkTranslations.data.items;
                  const mainTranslatedAddress = findTranslatedAddress(translatedAddressData, item.spec.name);
        
                  const subnets = item.spec.subnets.map((subnet: any) => {
                    return {
                      address:    subnet.address,
                      formattedAddress:    `${subnet.address}/${subnet.prefixLength}`,
                      name:       stripStrings(subnet.name),
                      longName:   subnet.name,
                      prefix_len: subnet.prefixLength,
                      translatedAddress: subnet.addressTranslation?.outside
                    }
                  });
        
                  return {
                    name:    item.spec.name,
                    subnets,
                    subnetLength: subnets.length,
                    cluster: 'local',
                    translatedAddress: mainTranslatedAddress?.spec?.outside
                  }
                });
        
                commit('setItems', parsedData)
            },
            async create({ commit }: any, data: any) {
                return await vNetService.createNetwork(data);
            },
            async deleteNetwork({ commit}: any, itemName: string) {
                return await vNetService.deleteNetwork(itemName);
            },
            async deleteSubnet({ commit }: any, data: { vnetName: string, vnetData: any}) {
                return await vNetService.patchSubnet(data.vnetName, data.vnetData);
            },
            reset({ commit }: any) {
                commit('setItems', [])
            }
        }
    }
}

const config: CoreStoreConfig = { namespace: PRODUCT_NAME, isClusterStore: true };

export default {
    specifics: vnetExtensionFactory(),
    config,
};