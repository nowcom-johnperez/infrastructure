// this is the definition of a "blank cluster" for Rancher Dashboard
// definition of a "blank cluster" in Rancher Dashboard
const BLANK_CLUSTER = '_';

export function init($plugin:any, store:any) {
  const PRODUCT_NAME = 'NOWCOM';
  const NODE = 'management.cattle.io.node'
  const CLUSTER = 'management.cattle.io.cluster'
  const CUSTOM_PAGE_NAME = 'Home';
  const CREATE_NETWORK = 'Network';
  const ROUTE_TABLE = 'Route Table';

  const {
    product,
    configureType,
    virtualType,
    basicType,
    weightGroup
  } = $plugin.DSL(store, PRODUCT_NAME);

  // registering a top-level product
  product({
    icon:    'storage',
    // svg: require('@pkg/nowcom/icons/nowcom.svg'),
    inStore: 'management',
    weight:  100,
    to:      {
      name:   `${ PRODUCT_NAME }-c-cluster-${ CUSTOM_PAGE_NAME }`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER,
        resource: NODE
      }
    }
  });

  // defining a k8s resource as page
  configureType(NODE, {
    displayName: 'Node',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    customRoute: {
      name:   `${ PRODUCT_NAME }-c-cluster-resource`,
      params: {
        product:  PRODUCT_NAME,
        cluster:  BLANK_CLUSTER,
        resource: NODE
      }
    }
  });

   // defining a k8s resource as page
   configureType(CLUSTER, {
    displayName: 'Cluster',
    isCreatable: true,
    isEditable:  true,
    isRemovable: true,
    showAge:     true,
    showState:   true,
    canYaml:     true,
    customRoute: {
      name:   `${ PRODUCT_NAME }-c-cluster-resource`,
      params: {
        product:  PRODUCT_NAME,
        cluster:  BLANK_CLUSTER,
        resource: CLUSTER
      }
    }
  });


  // creating a custom page
  virtualType({
    labelKey: 'some.translation.key',
    name:     CUSTOM_PAGE_NAME,
    route:    {
      name:   `${ PRODUCT_NAME }-c-cluster-${ CUSTOM_PAGE_NAME }`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

   // creating a custom page
   virtualType({
    labelKey: 'some.translation.key',
    name:     CREATE_NETWORK,
    route:    {
      name:   `${ PRODUCT_NAME }-c-cluster-${ CREATE_NETWORK }`,
      params: {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      }
    }
  });

     // creating a custom page
     virtualType({
      labelKey: 'some.translation.key',
      name:     ROUTE_TABLE,
      route:    {
        name:   `${ PRODUCT_NAME }-c-cluster-${ ROUTE_TABLE }`,
        params: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        }
      }
    });
  // registering the defined pages as side-menu entries
  //basicType([YOUR_K8S_RESOURCE_NAME, CUSTOM_PAGE_NAME, CREATE_NETWORK]);
  basicType([CUSTOM_PAGE_NAME]);
  basicType([CREATE_NETWORK, ROUTE_TABLE], "Network");
  basicType([NODE, CLUSTER], "Management");
  // weightGroup("Management", 1003, true)
}
