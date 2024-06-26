// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
// import { STATE, NAME as NAME_COL, AGE } from '@shell/config/table-headers';
// import { IPlugin } from '@rancher/shell/core/types';
import { PRODUCT_NAME, NODE, LIST_NETWORK, FORMS, BLANK_CLUSTER, WISH_PAGE, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP } from './config/constants';

export function init($plugin: any, store: any) {
  const {
    product,
    virtualType,
    basicType,
  } = $plugin.DSL(store, PRODUCT_NAME);

  // // registering a top-level product
  product({
    icon: 'repository',
    // svg: require('@pkg/nowcom/assets/img/server-stack.svg'),
    inStore: 'management',
    // removable: false,
    showClusterSwitcher: false,
    weight: 100,
    to: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER,
        resource: NODE
      }
    }
  });

  // // defining a k8s resource as page
  // configureType(NODE, {
  //   displayName: 'Node',
  //   isCreatable: true,
  //   isEditable: true,
  //   isRemovable: true,
  //   showAge: true,
  //   showState: true,
  //   canYaml: true,
  //   customRoute: {
  //     name: `${PRODUCT_NAME}-c-cluster-resource`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER,
  //       resource: NODE
  //     }
  //   }
  // });

  // // defining a k8s resource as page
  // configureType(CLUSTER, {
  //   displayName: 'Cluster',
  //   isCreatable: true,
  //   isEditable: true,
  //   isRemovable: true,
  //   showAge: true,
  //   showState: true,
  //   canYaml: true,
  //   customRoute: {
  //     name: `${PRODUCT_NAME}-c-cluster-resource`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER,
  //       resource: CLUSTER
  //     }
  //   }
  // });


  // creating a custom page
  // virtualType({
  //   labelKey: 'some.translation.key',
  //   name: HOME,
  //   route: {
  //     name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER
  //     }
  //   }
  // });

  // configureType(CUSTOM_K8S_RESOURCE_NAME, {
  //   displayName: 'Virtual Networks',
  //   isCreatable: true,
  //   isEditable: true,
  //   isRemovable: true,
  //   showAge: true,
  //   showState: true,
  //   canYaml: true,
  //   customRoute: {
  //     name: `${PRODUCT_NAME}-c-cluster-resource`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER,
  //       resource: CUSTOM_K8S_RESOURCE_NAME
  //     }
  //   }
  // });

  const vt = [
    { name: LIST_K8, label: 'Kubernetes', displayName: 'Kubernetes', weight: 7 },
    { name: LIST_NETWORK, label: 'Network', displayName: 'Network', weight: 6 },
    { name: LIST_FIREWALL, label: 'Firewall', displayName: 'Firewall', weight: 5 },
    { name: LIST_DHCP, label: 'DHCP', displayName: 'DHCP', weight: 4 },
    { name: LIST_DNS, label: 'DNS', displayName: 'DNS', weight: 3 },
    { name: ROAD_MAP, label: 'Road Map', displayName: 'Road Map', weight: 2 },
    { name: WISH_PAGE, label: 'Make a wish!', displayName: 'Make a wish!', weight: 1 },
  ]

  // vt.sort((a, b) => b.weight - a.weight);

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
          cluster: BLANK_CLUSTER
        }
      }
    })
  })

  basicType(vt.map(v => v.name));

  // const REPO = 'catalog.cattle.io.clusterrepo';

  // mapGroup('HOME', 'Repositories');  
  // registering the defined pages as side-menu entries
  // basicType([YOUR_K8S_RESOURCE_NAME, CUSTOM_PAGE_NAME, CREATE_NETWORK]);
  // basicType([FORMS, CUSTOM_PAGE_NAME]);
  // basicType([HOME]);
  // basicType([LIST_NAT_GATEWAY, LIST_NETWORK]);
  // basicType([LIST_NETWORK]);
  // basicType([
  //   REPO,
  // ], 'HOME');

  // headers(REPO, [
  //   STATE,
  //   NAME_COL,
  //   {
  //     name:     'version',
  //     label:    'Version',
  //     value:    'version',
  //     getValue: row => row.version
  //   },
  //   {
  //     name:     'cacheState',
  //     label:    'Cache State',
  //     value:    'status.cacheState',
  //     getValue: row => row.status?.cacheState
  //   },
  //   AGE,
  // ]);
  // basicType([LIST_NETWORK, ROUTE_TABLE], "Network");
  // basicType([NODE, CLUSTER], "Management");
  // basicType(['Network', LIST_K8, LIST_NETWORK, LIST_FIREWALL, LIST_DNS, LIST_DHCP], "Infrastructure");
  // basicType([LIST_K8, LIST_NETWORK, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP, WISH_PAGE]);
  // basicType([ROAD_MAP, WISH_PAGE]);
  // weightGroup('Infrastructure', 1001, true)
}
