interface HeaderType {
    title: string;
    value: string;
    main: boolean;
    sortable: boolean;
    sort?: string;
};

interface SortableHeaderType {
    name: string;
    label: string;
    sort: string|string[];
    search: string|string[];
    width?: number;
    default?: string;
    formatter?: string;
}

const SORTABLE_NETWORK_HEADERS: SortableHeaderType[] = [
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
        width: 10,
    },
    {
        name: 'translatedAddress',
        label: 'Translated Address',
        sort: ['translatedAddress'],
        search: ['translatedAddress'],
        width: 10
    },
    {
        name: 'subnetLength',
        label: 'Subnet',
        sort: ['subnetLength'],
        search: ['subnetLength'],
        width: 10
    }
];

const SORTABLE_SUB_NETWORK_HEADERS: SortableHeaderType[] = [
    {
        name: 'longName',
        label: 'Subnet Name',
        sort: ['longName'],
        search: ['longName'],
        width: 50,
    },
    {
        name: 'formattedAddress',
        label: 'Network Address',
        sort: ['formattedAddress'],
        search: ['formattedAddress'],
        width: 30
    },
    // {
    //     name: 'translatedAddress',
    //     label: 'Translated Address',
    //     sort: ['translatedAddress'],
    //     search: ['translatedAddress'],
    //     width: 30
    // },
    {
        name: 'dhcpEnabled',
        label: 'DHCP',
        sort: ['dhcpEnabled'],
        search: ['dhcpEnabled'],
        width: 30
    },
    // {
    //     name: 'prefix_len',
    //     label: 'Network Prefix',
    //     sort: ['prefix_len'],
    //     search: ['prefix_len'],
    //     width: 10
    // }
];

const SORTABLE_SUB_NETWORK_EXPRESS_HEADERS: SortableHeaderType[] = [
    {
        name: 'longName',
        label: 'Subnet Name',
        sort: ['longName'],
        search: ['longName'],
        width: 50,
    },
    {
        name: 'formattedAddress',
        label: 'Network Address',
        sort: ['formattedAddress'],
        search: ['formattedAddress'],
        width: 30
    },
    {
        name: 'dhcpEnabled',
        label: 'DHCP',
        sort: ['dhcpEnabled'],
        search: ['dhcpEnabled'],
        width: 30
    },
];

const DHCP_HEADERS: SortableHeaderType[] = [
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
        width: 10,
    },
    {
        name: 'subnet',
        label: 'Subnet',
        sort: ['subnet'],
        search: ['subnet'],
        width: 10
    },
    {
        name: 'available',
        label: 'Used / Available',
        sort: ['available'],
        search: ['available'],
        width: 10
    },
    {
        name: 'utilization',
        label: 'Utilization %',
        sort: ['utilization'],
        search: ['utilization'],
        width: 10
    }
];

const RELEASE_NOTES_HEADERS: SortableHeaderType[] = [
    {
        name: 'version',
        label: 'Version',
        sort: ['version'],
        search: ['version'],
        width: 10,
    },
    {
        name: 'notes',
        label: 'Description',
        sort: ['notes'],
        search: ['notes'],
        width: 10
    },
    {
        name: 'dateRelease',
        label: 'Date Release',
        sort: ['dateRelease'],
        search: ['dateRelease'],
        width: 10
    },
];

const RULES_HEADERS: SortableHeaderType[] = [
    {
        name: 'priority',
        label: 'Priority',
        sort: ['priority'],
        search: ['priority'],
        width: 10,
    },
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
        width: 10,
    },
    {
        name: 'destinationPortRanges',
        label: 'Port',
        sort: ['destinationPortRanges'],
        search: ['destinationPortRanges'],
        width: 10
    },
    {
        name: 'application',
        label: 'Application',
        sort: ['application'],
        search: ['application'],
        width: 10
    },
    {
        name: 'source',
        label: 'Source',
        sort: ['source'],
        search: ['source'],
        width: 10
    },
    {
        name: 'destination',
        label: 'Destination',
        sort: ['destination'],
        search: ['destination'],
        width: 10
    },
    {
        name: 'action',
        label: 'Action',
        sort: ['action'],
        search: ['action'],
        width: 10
    },
];

const SORTABLE_FIREWALL_NETWORK_HEADERS: SortableHeaderType[] = [
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
        width: 10,
    },
    {
        name: 'translatedAddress',
        label: 'Translated Address',
        sort: ['translatedAddress'],
        search: ['translatedAddress'],
        width: 10
    },
    {
        name: 'inbound',
        label: 'Inbound | Outbound',
        sort: ['inbound', 'outbound'],
        search: ['inbound', 'outbound'],
        width: 10
    }
];

const RULES_SUBNET_TRANSLATIONS: SortableHeaderType[] = [
    {
        name: 'longName',
        label: 'Subnet Name',
        sort: ['longName'],
        search: ['longName'],
        width: 50,
    },
    {
        name: 'formattedAddress',
        label: 'Network Address',
        sort: ['formattedAddress'],
        search: ['formattedAddress'],
        width: 30
    },
    {
        name: 'translatedAddress',
        label: 'Translated Address',
        sort: ['translatedAddress'],
        search: ['translatedAddress'],
        width: 30
    },
];

const ENVIRONMENT_HEADERS: SortableHeaderType[] = [
    {
        name: 'status',
        label: 'Status',
        sort: ['status'],
        search: ['status'],
    },
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
    },
    {
        name: 'size',
        label: 'Size',
        sort: ['size'],
        search: ['size'],
    },
    {
        name: 'networkType',
        label: 'Network Type',
        sort: ['networkType'],
        search: ['networkType'],
    },
    {
        name: 'networkPolicy',
        label: 'Network Policy',
        sort: ['networkPolicy'],
        search: ['networkPolicy'],
    },
    {
        name: 'dns',
        label: 'DNS',
        sort: ['dns'],
        search: ['dns'],
    },
    {
        name: 'explorer',
        label: 'Actions',
        sort: ['explorer'],
        search: ['explorer'],
    },
];

const PROJECT_NAMESPACE_HEADERS: SortableHeaderType[] = [
    {
      name: 'state',
      label: 'State',
      sort: ['state'],
      search: ['state'],
      width: 100,
      default:   'unknown',
      formatter: 'BadgeStateFormatter',
    },
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
        width: 10,
    },
    {
        name: 'cpu',
        label: 'CPU',
        sort: ['cpu'],
        search: ['cpu'],
        width: 10
    },
    {
        name: 'memory',
        label: 'Memory',
        sort: ['memory'],
        search: ['memory'],
        width: 10
    },
  ];

const SHARED_SERVICES_HEADERS: SortableHeaderType[] = [
    {
        name: 'status',
        label: 'Status',
        sort: ['status'],
        search: ['status'],
        width: 100
    },
    {
        name: 'name',
        label: 'Name',
        sort: ['name'],
        search: ['name'],
    },
    {
        name: 'environment',
        label: 'Environment',
        sort: ['environment'],
        search: ['environment'],
    },
    {
        name: 'description',
        label: 'Description',
        sort: ['description'],
        search: ['description'],
    },
];

const KEYVAULT_HEADER: SortableHeaderType[] = [
    {
        name: 'key',
        label: 'Key',
        sort: ['key'],
        search: ['key'],
        width: 100,
    },
    {
        name: 'value',
        label: 'Value',
        sort: ['value'],
        search: ['value'],
        width: 100
    },
];


export { 
    SORTABLE_NETWORK_HEADERS,
    SORTABLE_SUB_NETWORK_HEADERS,
    DHCP_HEADERS,
    RELEASE_NOTES_HEADERS,
    SORTABLE_SUB_NETWORK_EXPRESS_HEADERS,
    RULES_HEADERS,
    SORTABLE_FIREWALL_NETWORK_HEADERS,
    RULES_SUBNET_TRANSLATIONS,
    ENVIRONMENT_HEADERS,
    SHARED_SERVICES_HEADERS,
    KEYVAULT_HEADER,
    PROJECT_NAMESPACE_HEADERS
}