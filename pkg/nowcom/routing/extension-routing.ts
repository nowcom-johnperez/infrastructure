// definition of a "blank cluster" in Rancher Dashboard
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';

import NowcomLayout from '../layouts/NowcomLayout.vue';
import HomePage from '../pages/home.vue';
import ListNetwork from '../pages/listnetwork.vue';
import CreateNetwork from '../pages/createnetwork.vue';
import RoadMap from '../pages/road-map.vue';
import ListDHCP from '../pages/list-dhcp.vue';
import ListDNS from '../pages/list-dns.vue';
import ListFirewall from '../pages/list-firewall.vue';
import ListK8s from '../pages/list-k8s.vue';
import WishPage from '../pages/wish-page.vue';
import HarvesterPage from '../pages/sample-harvester.vue';
import EnvironmentCreatePage from '../pages/environment/create-page.vue';
import SharedServicesCreatePage from '../pages/environment/create-shared-service.vue';
// import WikiPage from '../pages/deprecated/wiki.vue';
// import ListNatGateway from '../pages/list-natgateway.vue';
// import CreateNatGateway from '../pages/deprecated/create-natgateway.vue';

// import RouteTable from '../pages/deprecated/routetables.vue';
// import Forms from '../pages/deprecated/forms.vue';

import { PRODUCT_NAME, HOME, LIST_NETWORK, CREATE_NETWORK, BLANK_CLUSTER, LIST_K8, LIST_FIREWALL, LIST_DNS, LIST_DHCP, ROAD_MAP, WISH_PAGE, ENVIRONMENT, SHARED_SERVICES, SAMPLE_HARVESTER } from '../config/constants';

const routes = [
  {
    path: `/${PRODUCT_NAME}/c/:cluster`,
    component: NowcomLayout,
    name: 'default-nowcom-layout',
    meta: {
      product: PRODUCT_NAME,
    },
    children: [
      {
        name: `${PRODUCT_NAME}-c-cluster-${HOME}`,
        path: `${HOME}`,
        component: HomePage,
        meta: {
          product: PRODUCT_NAME,
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${ENVIRONMENT}-create`,
        path: `${ENVIRONMENT}/create`,
        component: EnvironmentCreatePage,
        meta: {
          product: PRODUCT_NAME,
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${SHARED_SERVICES}-create`,
        path: `${SHARED_SERVICES}/create`,
        component: SharedServicesCreatePage,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${LIST_NETWORK}`,
        path: `${LIST_NETWORK}`,
        component: ListNetwork,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${CREATE_NETWORK}`,
        path: `${CREATE_NETWORK}`,
        component: CreateNetwork,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${LIST_K8}`,
        path: `${LIST_K8}`,
        component: ListK8s,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${LIST_FIREWALL}`,
        path: `${LIST_FIREWALL}`,
        component: ListFirewall,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${LIST_DNS}`,
        path: `${LIST_DNS}`,
        component: ListDNS,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${LIST_DHCP}`,
        path: `${LIST_DHCP}`,
        component: ListDHCP,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${ROAD_MAP}`,
        path: `${ROAD_MAP}`,
        component: RoadMap,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${WISH_PAGE}`,
        path: `${WISH_PAGE}`,
        component: WishPage,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
      {
        name: `${PRODUCT_NAME}-c-cluster-${SAMPLE_HARVESTER}`,
        path: `${SAMPLE_HARVESTER}`,
        component: HarvesterPage,
        meta: {
          product: PRODUCT_NAME,
          cluster: BLANK_CLUSTER
        },
      },
    ]
  },
  {
    path:      `/home`,
    component: HomePage,
    name:      `homepage`,
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
