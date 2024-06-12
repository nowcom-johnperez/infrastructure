// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
// import { STATE, NAME as NAME_COL, AGE } from '@shell/config/table-headers';
import { PRODUCT_NAME, NODE, LIST_NETWORK, FORMS, BLANK_CLUSTER, CUSTOM_K8S_RESOURCE_NAME, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP } from './config/constants';

export function init($plugin: any, store: any) {
  const {
    product,
    configureType,
    virtualType,
    basicType,
    weightType,
    weightGroup,
    mapGroup,
    headers
  } = $plugin.DSL(store, PRODUCT_NAME);

  // // registering a top-level product
  product({
    icon: 'apps',
    // svg: require('@pkg/nowcom/icons/nowcom.svg'),
    inStore: 'management',
    removable: false,
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
  // creating a custom page
  virtualType({
    label: 'Kubernetes',
    displayName: 'Kubernetes',
    name: LIST_K8,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_K8}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  // creating a custom page
  virtualType({
    label: 'Virtual Network',
    displayName: 'Virtual Network',
    name: LIST_NETWORK,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  virtualType({
    label: 'Firewall',
    displayName: 'Firewall',
    name: LIST_FIREWALL,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_FIREWALL}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  virtualType({
    label: 'DNS',
    displayName: 'DNS',
    name: LIST_DNS,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_DNS}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  virtualType({
    label: 'DHCP',
    displayName: 'DHCP',
    name: LIST_DHCP,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${LIST_DHCP}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

  virtualType({
    label: 'Road Map',
    name: ROAD_MAP,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${ROAD_MAP}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });
  // creating a custom page
  // virtualType({
  //   label: 'NAT Gateway',
  //   labelKey: 'NAT Gateway',
  //   displayName: 'NAT Gateway',
  //   name: LIST_NAT_GATEWAY,
  //   route: {
  //     name: `${PRODUCT_NAME}-c-cluster-${LIST_NAT_GATEWAY}`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER
  //     }
  //   }
  // });

  // creating a custom page
  // virtualType({
  //   labelKey: 'some.translation.key',
  //   name: ROUTE_TABLE,
  //   route: {
  //     name: `${PRODUCT_NAME}-c-cluster-${ROUTE_TABLE}`,
  //     params: {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER
  //     }
  //   }
  // });

  // creating a custom page
  virtualType({
    labelKey: 'some.translation.key',
    name: FORMS,
    route: {
      name: `${PRODUCT_NAME}-c-cluster-${FORMS}`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });
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
  basicType(['Network', LIST_K8, LIST_NETWORK, LIST_FIREWALL, LIST_DNS, LIST_DHCP], "Infrastructure");
  basicType([ROAD_MAP]);
  weightType(LIST_K8, 5, true)
  weightType(LIST_NETWORK, 44, true)
  weightType(LIST_FIREWALL, 3, true)
  weightType(LIST_DNS, 2, true)
  weightType(LIST_DHCP, 1, true)
  weightGroup('Infrastructure', 1001, true)
  
}
