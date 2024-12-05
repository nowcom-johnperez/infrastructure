// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
// import { STATE, NAME as NAME_COL, AGE } from '@shell/config/table-headers';
// import { IPlugin } from '@rancher/shell/core/types';
import { PRODUCT_NAME, NODE, LIST_NETWORK, FORMS, BLANK_CLUSTER, WISH_PAGE, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP, HOME } from './config/constants';
import { getConfig } from './config/api'
const { ENVIRONMENT_CLUSTER } = getConfig()
export function init($plugin: any, store: any) {
  const {
    product,
    virtualType,
    basicType,
  } = $plugin.DSL(store, PRODUCT_NAME);

  // registering a top-level product
  product({
    icon: 'repository',
    // svg: require('@pkg/nowcom/assets/img/server-stack.svg'),
    inStore: 'management',
    // removable: false,
    showClusterSwitcher: false,
    weight: 100,
    // to: {
    //   name: `${PRODUCT_NAME}-c-cluster-landing`,
    //   params: {
    //     product: PRODUCT_NAME,
    //     cluster: '_',
    //     resource: NODE
    //   }
    // }
    to: {
      name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
      params: {
        product: PRODUCT_NAME,
        cluster: ENVIRONMENT_CLUSTER,
        resource: NODE
      }
    }
  });

  const vt = [
    { name: LIST_K8, label: 'Kubernetes', displayName: 'Kubernetes', weight: 7 },
    { name: LIST_NETWORK, label: 'Network', displayName: 'Network', weight: 6 },
    { name: LIST_FIREWALL, label: 'Firewall', displayName: 'Firewall', weight: 5 },
    { name: LIST_DHCP, label: 'DHCP', displayName: 'DHCP', weight: 4 },
    { name: LIST_DNS, label: 'DNS', displayName: 'DNS', weight: 3 },
    { name: ROAD_MAP, label: 'Road Map', displayName: 'Road Map', weight: 2 },
    { name: WISH_PAGE, label: 'Make a wish!', displayName: 'Make a wish!', weight: 1 },
  ]

  vt.forEach(v => {
    virtualType({
      label: v.label,
      displayName: v.displayName,
      name: v.name,
      weight: v.weight,
      route: {
        name: `${PRODUCT_NAME}-c-cluster-${v.name}`,
        params: {
          product: PRODUCT_NAME,
          // cluster: BLANK_CLUSTER
        }
      }
    })
  })

  basicType(vt.map(v => v.name));
}
