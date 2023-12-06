// definition of a "blank cluster" in Rancher Dashboard
import ListResource from '@shell/pages/c/_cluster/_product/_resource/index.vue';
import CreateResource from '@shell/pages/c/_cluster/_product/_resource/create.vue';
import ViewResource from '@shell/pages/c/_cluster/_product/_resource/_id.vue';
import ViewNamespacedResource from '@shell/pages/c/_cluster/_product/_resource/_namespace/_id.vue';
import HomePage from '../pages/homepage.vue';
import ListNetwork from '../pages/listnetwork.vue';
import CreateNetwork from '../pages/createnetwork.vue';
import RouteTable from '../pages/routetables.vue';
import Forms from '../pages/forms.vue';
const BLANK_CLUSTER = '_';
// to achieve naming consistency throughout the extension
// we recommend this to be defined on a config file and exported
// so that the developer can import it wherever it needs to be used
const PRODUCT_NAME = 'NOWCOM';
const PAGE_NAME = 'Home';
const LIST_NETWORK = 'Network';
const CREATE_NETWORK = 'create-network';
const ROUTE_TABLE = 'Route Table';
const FORMS = 'Forms';

const routes = [
  // this covers the "custom page"
  {
    name:      `home`,
    path:      `/home`,
    component: HomePage,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // this covers the "custom page"
  {
    name:      `${ PRODUCT_NAME }-c-cluster-${ PAGE_NAME }`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/${ PAGE_NAME }`,
    component: HomePage,
      meta:      {
        product: PRODUCT_NAME,
        cluster: BLANK_CLUSTER
      },
    },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-${ LIST_NETWORK }`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/${ LIST_NETWORK }`,
    component: ListNetwork,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-${ CREATE_NETWORK }`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/${ CREATE_NETWORK }`,
    component: CreateNetwork,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-${ ROUTE_TABLE }`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/${ ROUTE_TABLE }`,
    component: RouteTable,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-${ FORMS }`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/${ FORMS }`,
    component: Forms,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  // the following routes cover the "resource page"
  // registering routes for list/edit/create views
  {
    name:      `${ PRODUCT_NAME }-c-cluster-resource`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/:resource`,
    component: ListResource,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-resource-create`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/:resource/create`,
    component: CreateResource,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-resource-id`,
    path:      `/${ PRODUCT_NAME }/c/:cluster/:resource/:id`,
    component: ViewResource,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
  {
    name:      `${ PRODUCT_NAME }-c-cluster-resource-namespace-id`,
    path:      `/${ PRODUCT_NAME }/:cluster/:resource/:namespace/:id`,
    component: ViewNamespacedResource,
    meta:      {
      product: PRODUCT_NAME,
      cluster: BLANK_CLUSTER
    },
  },
];

export default routes;
