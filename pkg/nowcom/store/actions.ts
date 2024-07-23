import { vNetService } from '../services/api/vnet'
import { stripStrings, findTranslatedAddress } from '../services/helpers/utils'
export default {
  async findAll({ commit }: any) {
    const [networks, networkTranslations] = await Promise.all([
        vNetService.getNetworks(),
        vNetService.getNetworkTranslations()
    ]);

    const parsedData = networks.data.items.filter((item: any) => item.metadata.name !== 'express').map((item: any) => {
      const translatedAddressData = networkTranslations.data.items;
      const mainTranslatedAddress = findTranslatedAddress(translatedAddressData, item.metadata.name);
      const subnets = item.spec.subnets.map((subnet: any) => {
        return {
          address:    subnet.address,
          formattedAddress:    `${subnet.address}/${subnet.prefixLength}`,
          name:       stripStrings(item.metadata.name, subnet.name, `${subnet.address}-${subnet.prefixLength}`),
          longName:   subnet.name,
          prefix_len: subnet.prefixLength,
          dhcpEnabled: subnet.dhcpEnabled,
          translatedAddress: subnet.addressTranslation?.outside
        }
      });

      return {
        name:    item.metadata.name,
        subnets,
        subnetLength: subnets.length,
        cluster: 'local',
        translatedAddress: mainTranslatedAddress?.spec?.outside
      }
    });

    commit('setItems', parsedData)
  },
  async getSubnets({ commit }: any, networkName: string) {
      const res: any = await vNetService.getSubnetByName(networkName);
      return res.data?.spec?.subnets.map((subnet: any) => {
          return {
              address:    subnet.address,
              formattedAddress:    `${subnet.address}/${subnet.prefixLength}`,
              name:       stripStrings(networkName, subnet.name, `${subnet.address}-${subnet.prefixLength}`),
              longName:   subnet.name,
              prefix_len: subnet.prefixLength,
              dhcpEnabled: subnet.dhcpEnabled,
              translatedAddress: subnet.addressTranslation?.outside
          }
      })
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