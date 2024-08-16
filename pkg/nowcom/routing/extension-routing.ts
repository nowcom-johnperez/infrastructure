// definition of a "blank cluster" in Rancher Dashboard
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';

import HomePage from '../pages/home.vue';
import ListNetwork from '../pages/listnetwork.vue';
import CreateNetwork from '../pages/createnetwork.vue';
import RoadMap from '../pages/road-map.vue';
import ListDHCP from '../pages/list-dhcp.vue';
import ListDNS from '../pages/list-dns.vue';
import ListFirewall from '../pages/list-firewall.vue';
import ListK8s from '../pages/list-k8s.vue';
import WishPage from '../pages/wish-page.vue';
import WikiPage from '../pages/deprecated/wiki.vue';
import ListNatGateway from '../pages/list-natgateway.vue';
import CreateNatGateway from '../pages/deprecated/create-natgateway.vue';

import RouteTable from '../pages/deprecated/routetables.vue';
import Forms from '../pages/deprecated/forms.vue';

import { PRODUCT_NAME, HOME, LIST_NETWORK, LIST_NAT_GATEWAY, CREATE_NAT_GATEWAY, CREATE_NETWORK, ROUTE_TABLE, FORMS, BLANK_CLUSTER, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP, WISH_PAGE, WIKI_PAGE } from '../config/constants';

const routes = [
  // {
  //   path:      `/home`,
  //   component: HomePage,
  //   name:      `homepage`,
  // },
  {
    name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${HOME}`,
    component: HomePage,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
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
    component: ListK8s,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_FIREWALL}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_FIREWALL}`,
    component: ListFirewall,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_DNS}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_DNS}`,
    component: ListDNS,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${LIST_DHCP}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${LIST_DHCP}`,
    component: ListDHCP,
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
  // {
  //   name: `${PRODUCT_NAME}-c-cluster-${LIST_NAT_GATEWAY}`,
  //   path: `/${PRODUCT_NAME}/c/:cluster/${LIST_NAT_GATEWAY}`,
  //   component: ListNatGateway,
  //   meta: {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
  {
    name: `${PRODUCT_NAME}-c-cluster-${ROAD_MAP}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${ROAD_MAP}`,
    component: RoadMap,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name: `${PRODUCT_NAME}-c-cluster-${WISH_PAGE}`,
    path: `/${PRODUCT_NAME}/c/:cluster/${WISH_PAGE}`,
    component: WishPage,
    meta: {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // {
  //   name: `${PRODUCT_NAME}-c-cluster-${WIKI_PAGE}`,
  //   path: `/${PRODUCT_NAME}/c/:cluster/${WIKI_PAGE}`,
  //   component: WikiPage,
  //   meta: {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
  // {
  //   name: `${PRODUCT_NAME}-c-cluster-${CREATE_NAT_GATEWAY}`,
  //   path: `/${PRODUCT_NAME}/c/:cluster/${CREATE_NAT_GATEWAY}`,
  //   component: CreateNatGateway,
  //   meta: {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
  // {
  //   name: `${PRODUCT_NAME}-c-cluster-${ROUTE_TABLE}`,
  //   path: `/${PRODUCT_NAME}/c/:cluster/${ROUTE_TABLE}`,
  //   component: RouteTable,
  //   meta: {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
  // {
  //   name: `${PRODUCT_NAME}-c-cluster-${FORMS}`,
  //   path: `/${PRODUCT_NAME}/c/:cluster/${FORMS}`,
  //   component: Forms,
  //   meta: {
  //     product: PRODUCT_NAME,
  //     cluster: BLANK_CLUSTER
  //   },
  // },
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
