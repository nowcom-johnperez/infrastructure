// definition of a "blank cluster" in Rancher Dashboard
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';
import HomePage from '../pages/homepage.vue';
import ListNetwork from '../pages/listnetwork.vue';
import CreateNetwork from '../pages/createnetwork.vue';

import ListNatGateway from '../pages/list-natgateway.vue';
import CreateNatGateway from '../pages/create-natgateway.vue';

import RouteTable from '../pages/routetables.vue';
import Forms from '../pages/forms.vue';

import { PRODUCT_NAME, HOME, LIST_NETWORK, LIST_NAT_GATEWAY, CREATE_NAT_GATEWAY, CREATE_NETWORK, ROUTE_TABLE, FORMS, BLANK_CLUSTER, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP } from '../config/constants';

const routes = [
  // // this covers the "custom page"
  // {
  //   name:      `home`,
  //   path:      `/home`,
  //   component: HomePage,
  //   meta:      {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
  // this covers the "custom page"
  {
    name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${HOME}`,
    component: HomePage,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // this covers the "custom page"
  // {
  //   name:      `${ PRODUCT_NAME }-c-cluster-${ NETWORK_HOME }`,
  //   path:      `/${ PRODUCT_NAME }/c/:cluster/${ NETWORK_HOME }`,
  //   component: HomePage,
  //     meta:      {
  //       product: PRODUCT_NAME,
  //       cluster: BLANK_CLUSTER
  //     },
  //   },  
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_NETWORK}`,
    component: ListNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_K8}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_K8}`,
    component: ListNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_FIREWALL}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_FIREWALL}`,
    component: ListNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_DNS}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_DNS}`,
    component: ListNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_DHCP}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_DHCP}`,
    component: ListNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${CREATE_NETWORK}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${CREATE_NETWORK}`,
    component: CreateNetwork,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // NAT GATEWAY
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_NAT_GATEWAY}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_NAT_GATEWAY}`,
    component: ListNatGateway,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${CREATE_NAT_GATEWAY}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${CREATE_NAT_GATEWAY}`,
    component: CreateNatGateway,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },

  {
    name: `${PRODUCT_NAME}-c-cluster-${ROUTE_TABLE}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${ROUTE_TABLE}`,
    component: RouteTable,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${FORMS}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${FORMS}`,
    component: Forms,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // the following routes cover the "resource page"
  // registering routes for list/edit/create views
  {
    name: `${PRODUCT_NAME}-c-cluster-resource`,
    path: `/${PRODUCT_NAME}/c/:cluster/:resource`,
    component: ListResource,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-resource-create`,
    path: `/${PRODUCT_NAME}/c/:cluster/:resource/create`,
    component: CreateResource,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-resource-id`,
    path: `/${PRODUCT_NAME}/c/:cluster/:resource/:id`,
    component: ViewResource,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-resource-namespace-id`,
    path: `/${PRODUCT_NAME}/:cluster/:resource/:namespace/:id`,
    component: ViewNamespacedResource,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
];

export default routes;
