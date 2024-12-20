export const PRODUCT_NAME = 'trident';
export const PRODUCT_STORE = 'trident';
export const PAGE_NAME = 'home';
export const NETWORK_HOME = 'trident';

export const LIST_NETWORK = 'network';
export const LIST_K8 = 'kubernetes';
export const LIST_FIREWALL = 'firewall';
export const LIST_DNS = 'dns';
export const LIST_DHCP = 'dhcp';
export const LIST_NAT_GATEWAY = 'nat.gateway';
export const ROAD_MAP = 'roadmap';
export const WISH_PAGE = 'wish';
export const WIKI_PAGE = 'wiki';
export const ENVIRONMENT = 'environment';
export const SHARED_SERVICES = 'shared.services';

export const CREATE_NAT_GATEWAY = 'create.nat.gateway';
export const CREATE_NETWORK = 'create-network';

export const ROUTE_TABLE = 'Route Table';
export const FORMS = 'Forms';

export const NODE = 'management.cattle.io.node'
export const CLUSTER = 'management.cattle.io.cluster'

export const HOME = 'Home';
export const BLANK_CLUSTER = '_';
export const CUSTOM_K8S_RESOURCE_NAME = 'vnetExtensionFactory';

export const SAMPLE_HARVESTER = 'harvester.sample';

export const RESOURCE_MANAGEMENT = 'resource-management';

export const TRIDENT = {
  PRODUCT_NAME: 'trident',
  LOCAL_TESTING: 'local-testing',
  WIKI: 'wiki',
  RESOURCE_MANAGEMENT: 'resource-management',
}

export const ENVIRONMENT_SIZES = [
  { size: 'Small', description: ['8 CPU 16G Memory', 'Role: Master/Worker'], short: ['1 node'], master: { cpu: 8, memory: 16, role: 'Master/Worker', nodeCount: 1 }},
  { size: 'Medium', description: ['8 CPU 16G Memory', 'Role: Master/Worker'], short: ['3 Nodes'], master: { cpu: 8, memory: 16, role: 'Master/Worker', nodeCount: 3 }},
  { size: 'Large', description: ['3 Nodes - 8 CPU 16G Memory (Role: Master)', '3 Nodes - 12 CPU 64G Memory (Role: Worker)', ], short: ['6 Nodes'], master: { cpu: 8, memory: 16, role: 'Master', nodeCount: 3 }, worker: { cpu: 12, memory: 64, role: 'Worker', nodeCount: 3 }},
];

export  const ENVIRONMENT_DATA = [
  {
    status: 'Active',
    name: 'Prod-trident',
    size: 'Large',
    state: {
      networks: true,
      firewall: true,
      git: true,
      keyvaults: true,
      cluster: true,
      services: true,
      certDNS: true
    }
  },
  {
    status: 'Processing',
    name: 'Dev-trident',
    size: 'Medium',
    state: {
      networks: true,
      firewall: true,
      git: true,
      keyvaults: false,
      cluster: true,
      services: false,
      certDNS: false
    }
  }
]

export const SHARED_SERVICES_LISTING = [
  { name: 'Elasticsearch', description: 'Elasticsearch is a distributed search and analytics engine built on Apache Lucene.', icon: 'fa-search'},
  { name: 'Redis', description: 'an open source, in-memory, NoSQL key/value store that is used primarily as an application cache or quick-response database.', icon: 'fa-server'},
  { name: 'Database', description: 'an organized collection of structured information, or data, typically stored electronically in a computer system', icon: 'fa-database'},
];

export const SHARED_SERVICES_DATA = [
  {
    name: 'Elasticsearch 8.0',
    service: 'Elasticsearch',
    environment: 'Dev-trident',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet congue metus. Aliquam at arcu ornare, sagittis turpis ut, convallis mi. Morbi vitae orci eu lectus efficitur hendrerit eget ac ante.',
    status: 'Approved',
    monitoring: [
      {
        name: 'Test' + Math.floor(Math.random() * 10),
        usedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        },
        reservedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        }
      }
    ]
  },
  {
    name: 'Elasticsearch 9.0',
    service: 'Elasticsearch',
    environment: 'Dev-trident',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet congue metus. Aliquam at arcu ornare, sagittis turpis ut, convallis mi. Morbi vitae orci eu lectus efficitur hendrerit eget ac ante.',
    status: 'Pending',
    monitoring: [
      {
        name: 'Test' + Math.floor(Math.random() * 10),
        usedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        },
        reservedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        }
      }
    ]
  },
  {
    name: 'Redis v5',
    service: 'Redis',
    environment: 'Dev-trident',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet congue metus. Aliquam at arcu ornare, sagittis turpis ut, convallis mi. Morbi vitae orci eu lectus efficitur hendrerit eget ac ante.',
    status: 'Pending',
    monitoring: [
      {
        name: 'Test' + Math.floor(Math.random() * 10),
        usedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        },
        reservedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        }
      }
    ]
  },
  {
    name: 'MySQL',
    service: 'Database',
    environment: 'Dev-trident',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet congue metus. Aliquam at arcu ornare, sagittis turpis ut, convallis mi. Morbi vitae orci eu lectus efficitur hendrerit eget ac ante.',
    status: 'Approved',
    monitoring: [
      {
        name: 'Test' + Math.floor(Math.random() * 10),
        usedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        },
        reservedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        }
      }
    ]
  },
  {
    name: 'PostgresSQL',
    service: 'Database',
    environment: 'Prod-trident',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet congue metus. Aliquam at arcu ornare, sagittis turpis ut, convallis mi. Morbi vitae orci eu lectus efficitur hendrerit eget ac ante.',
    status: 'Pending',
    monitoring: [
      {
        name: 'Test' + Math.floor(Math.random() * 10),
        usedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        },
        reservedObj: {
          useful: Math.floor(Math.random() * 100),
          total: Math.floor(Math.random() * 100),
          units: ''
        }
      }
    ]
  }
]