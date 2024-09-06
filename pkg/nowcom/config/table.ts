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

const PLACEHOLDER_DATA = JSON.parse("{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"items\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"kind\":\"IPPool\",\"metadata\":{\"annotations\":{\"kubectl.kubernetes.io/last-applied-configuration\":\"{\\\"apiVersion\\\":\\\"network.harvesterhci.io/v1alpha1\\\",\\\"kind\\\":\\\"IPPool\\\",\\\"metadata\\\":{\\\"annotations\\\":{},\\\"name\\\":\\\"vlan-12\\\",\\\"namespace\\\":\\\"default\\\"},\\\"spec\\\":{\\\"ipv4Config\\\":{\\\"cidr\\\":\\\"10.55.12.0/24\\\",\\\"dns\\\":[\\\"10.54.21.21\\\"],\\\"leaseTime\\\":300,\\\"pool\\\":{\\\"end\\\":\\\"10.55.12.200\\\",\\\"start\\\":\\\"10.55.12.100\\\"},\\\"router\\\":\\\"10.55.12.1\\\",\\\"serverIP\\\":\\\"10.55.12.10\\\"},\\\"networkName\\\":\\\"default/vlan-12\\\"}}\\n\"},\"creationTimestamp\":\"2024-06-04T23:10:58Z\",\"finalizers\":[\"wrangler.cattle.io/vm-dhcp-ippool-controller\"],\"generation\":1,\"managedFields\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:annotations\":{\".\":{},\"f:kubectl.kubernetes.io/last-applied-configuration\":{}}},\"f:spec\":{\".\":{},\"f:ipv4Config\":{\".\":{},\"f:cidr\":{},\"f:dns\":{},\"f:leaseTime\":{},\"f:pool\":{\".\":{},\"f:end\":{},\"f:start\":{}},\"f:router\":{},\"f:serverIP\":{}},\"f:networkName\":{}}},\"manager\":\"kubectl-client-side-apply\",\"operation\":\"Update\",\"time\":\"2024-06-04T23:10:58Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:finalizers\":{\".\":{},\"v:\\\"wrangler.cattle.io/vm-dhcp-ippool-controller\\\"\":{}}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"time\":\"2024-06-04T23:10:58Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:status\":{\".\":{},\"f:agentPodRef\":{\".\":{},\"f:image\":{},\"f:name\":{},\"f:namespace\":{},\"f:uid\":{}},\"f:conditions\":{},\"f:ipv4\":{\".\":{},\"f:allocated\":{\".\":{},\"f:10.55.12.104\":{},\"f:10.55.12.105\":{},\"f:10.55.12.111\":{},\"f:10.55.12.121\":{},\"f:10.55.12.122\":{},\"f:10.55.12.135\":{},\"f:10.55.12.140\":{},\"f:10.55.12.153\":{},\"f:10.55.12.178\":{},\"f:10.55.12.190\":{}},\"f:available\":{},\"f:used\":{}},\"f:lastUpdate\":{}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"subresource\":\"status\",\"time\":\"2024-06-05T20:27:24Z\"}],\"name\":\"vlan-12\",\"namespace\":\"default\",\"resourceVersion\":\"90671949\",\"uid\":\"8f2f6f67-2230-4390-8ae3-591c341469d9\"},\"spec\":{\"ipv4Config\":{\"cidr\":\"10.55.12.0/24\",\"dns\":[\"10.54.21.21\"],\"leaseTime\":300,\"pool\":{\"end\":\"10.55.12.200\",\"start\":\"10.55.12.100\"},\"router\":\"10.55.12.1\",\"serverIP\":\"10.55.12.10\"},\"networkName\":\"default/vlan-12\"},\"status\":{\"agentPodRef\":{\"image\":\"rancher/harvester-vm-dhcp-agent:v0.3.1\",\"name\":\"default-vlan-12-agent\",\"namespace\":\"harvester-system\",\"uid\":\"1ceb8989-4087-4ace-b384-d803d368435d\"},\"conditions\":[{\"lastUpdateTime\":\"2024-06-04T23:10:58Z\",\"status\":\"True\",\"type\":\"Registered\"},{\"lastUpdateTime\":\"2024-06-04T23:10:58Z\",\"status\":\"True\",\"type\":\"CacheReady\"},{\"lastUpdateTime\":\"2024-06-04T23:11:05Z\",\"status\":\"True\",\"type\":\"AgentReady\"},{\"lastUpdateTime\":\"2024-06-04T23:10:58Z\",\"status\":\"False\",\"type\":\"Stopped\"}],\"ipv4\":{\"allocated\":{\"10.55.12.104\":\"1e:9c:88:69:2f:fd\",\"10.55.12.105\":\"26:96:d3:d7:6b:df\",\"10.55.12.111\":\"ce:3e:61:d1:09:65\",\"10.55.12.121\":\"56:67:2d:2c:a3:a3\",\"10.55.12.122\":\"02:a9:33:58:37:e7\",\"10.55.12.135\":\"26:88:1f:26:24:48\",\"10.55.12.140\":\"f2:69:4d:18:a1:6d\",\"10.55.12.153\":\"96:f3:5a:1c:cb:af\",\"10.55.12.178\":\"a2:05:8a:63:ed:b4\",\"10.55.12.190\":\"42:83:42:db:ee:a4\"},\"available\":91,\"used\":10},\"lastUpdate\":\"2024-06-05T20:27:24Z\"}},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"kind\":\"IPPool\",\"metadata\":{\"annotations\":{\"kubectl.kubernetes.io/last-applied-configuration\":\"{\\\"apiVersion\\\":\\\"network.harvesterhci.io/v1alpha1\\\",\\\"kind\\\":\\\"IPPool\\\",\\\"metadata\\\":{\\\"annotations\\\":{},\\\"name\\\":\\\"vlan-13\\\",\\\"namespace\\\":\\\"default\\\"},\\\"spec\\\":{\\\"ipv4Config\\\":{\\\"cidr\\\":\\\"192.168.13.0/24\\\",\\\"dns\\\":[\\\"4.2.2.2\\\"],\\\"leaseTime\\\":300,\\\"pool\\\":{\\\"end\\\":\\\"192.168.13.200\\\",\\\"exclude\\\":[\\\"192.168.13.101\\\",\\\"192.168.13.102\\\"],\\\"start\\\":\\\"192.168.13.100\\\"},\\\"router\\\":\\\"192.168.13.1\\\",\\\"serverIP\\\":\\\"192.168.13.10\\\"},\\\"networkName\\\":\\\"default/vlan-13\\\"}}\\n\"},\"creationTimestamp\":\"2024-06-04T17:54:47Z\",\"finalizers\":[\"wrangler.cattle.io/vm-dhcp-ippool-controller\"],\"generation\":1,\"managedFields\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:annotations\":{\".\":{},\"f:kubectl.kubernetes.io/last-applied-configuration\":{}}},\"f:spec\":{\".\":{},\"f:ipv4Config\":{\".\":{},\"f:cidr\":{},\"f:dns\":{},\"f:leaseTime\":{},\"f:pool\":{\".\":{},\"f:end\":{},\"f:exclude\":{},\"f:start\":{}},\"f:router\":{},\"f:serverIP\":{}},\"f:networkName\":{}}},\"manager\":\"kubectl-client-side-apply\",\"operation\":\"Update\",\"time\":\"2024-06-04T17:54:47Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:finalizers\":{\".\":{},\"v:\\\"wrangler.cattle.io/vm-dhcp-ippool-controller\\\"\":{}}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"time\":\"2024-06-04T17:54:47Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:status\":{\".\":{},\"f:agentPodRef\":{\".\":{},\"f:image\":{},\"f:name\":{},\"f:namespace\":{},\"f:uid\":{}},\"f:conditions\":{},\"f:ipv4\":{\".\":{},\"f:allocated\":{\".\":{},\"f:192.168.13.101\":{},\"f:192.168.13.102\":{},\"f:192.168.13.123\":{}},\"f:available\":{},\"f:used\":{}},\"f:lastUpdate\":{}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"subresource\":\"status\",\"time\":\"2024-06-05T20:26:57Z\"}],\"name\":\"vlan-13\",\"namespace\":\"default\",\"resourceVersion\":\"90671343\",\"uid\":\"df0add2d-2fca-4ec4-af34-54f4c7e6e3a6\"},\"spec\":{\"ipv4Config\":{\"cidr\":\"192.168.13.0/24\",\"dns\":[\"4.2.2.2\"],\"leaseTime\":300,\"pool\":{\"end\":\"192.168.13.200\",\"exclude\":[\"192.168.13.101\",\"192.168.13.102\"],\"start\":\"192.168.13.100\"},\"router\":\"192.168.13.1\",\"serverIP\":\"192.168.13.10\"},\"networkName\":\"default/vlan-13\"},\"status\":{\"agentPodRef\":{\"image\":\"rancher/harvester-vm-dhcp-agent:v0.3.1\",\"name\":\"default-vlan-13-agent\",\"namespace\":\"harvester-system\",\"uid\":\"5da3309c-6a39-4b06-9486-70be0b03c64b\"},\"conditions\":[{\"lastUpdateTime\":\"2024-06-04T17:54:47Z\",\"status\":\"True\",\"type\":\"Registered\"},{\"lastUpdateTime\":\"2024-06-04T17:54:47Z\",\"status\":\"True\",\"type\":\"CacheReady\"},{\"lastUpdateTime\":\"2024-06-04T17:54:50Z\",\"status\":\"True\",\"type\":\"AgentReady\"},{\"lastUpdateTime\":\"2024-06-04T17:54:47Z\",\"status\":\"False\",\"type\":\"Stopped\"}],\"ipv4\":{\"allocated\":{\"192.168.13.101\":\"EXCLUDED\",\"192.168.13.102\":\"EXCLUDED\",\"192.168.13.123\":\"16:ce:71:6e:8b:8a\"},\"available\":98,\"used\":1},\"lastUpdate\":\"2024-06-05T20:26:57Z\"}},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"kind\":\"IPPool\",\"metadata\":{\"creationTimestamp\":\"2024-06-12T00:15:27Z\",\"finalizers\":[\"wrangler.cattle.io/vm-dhcp-ippool-controller\"],\"generation\":1,\"managedFields\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:spec\":{\".\":{},\"f:ipv4Config\":{\".\":{},\"f:cidr\":{},\"f:dns\":{},\"f:pool\":{\".\":{},\"f:end\":{},\"f:start\":{}},\"f:router\":{},\"f:serverIP\":{}},\"f:networkName\":{}}},\"manager\":\"OpenAPI-Generator\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:27Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:finalizers\":{\".\":{},\"v:\\\"wrangler.cattle.io/vm-dhcp-ippool-controller\\\"\":{}}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:29Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:status\":{\".\":{},\"f:agentPodRef\":{\".\":{},\"f:image\":{},\"f:name\":{},\"f:namespace\":{},\"f:uid\":{}},\"f:conditions\":{},\"f:ipv4\":{\".\":{},\"f:available\":{},\"f:used\":{}},\"f:lastUpdate\":{}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"subresource\":\"status\",\"time\":\"2024-06-12T00:15:35Z\"}],\"name\":\"vnet1-subnet1-10.10.51.0-24\",\"namespace\":\"default\",\"resourceVersion\":\"102687908\",\"uid\":\"b21f0be8-6392-4a15-b2c0-a6a95145331c\"},\"spec\":{\"ipv4Config\":{\"cidr\":\"10.10.51.0/24\",\"dns\":[\"10.54.21.21\"],\"pool\":{\"end\":\"10.10.51.240\",\"start\":\"10.10.51.21\"},\"router\":\"10.10.51.1\",\"serverIP\":\"10.10.51.10\"},\"networkName\":\"default/vnet1-subnet1-10.10.51.0-24\"},\"status\":{\"agentPodRef\":{\"image\":\"rancher/harvester-vm-dhcp-agent:v0.3.1\",\"name\":\"default-vnet1-subnet1-10.10.51.0-24-agent\",\"namespace\":\"harvester-system\",\"uid\":\"ba43d658-175a-4952-97c7-b7e226d2df8d\"},\"conditions\":[{\"lastUpdateTime\":\"2024-06-12T00:15:28Z\",\"status\":\"True\",\"type\":\"Registered\"},{\"lastUpdateTime\":\"2024-06-12T00:15:28Z\",\"status\":\"True\",\"type\":\"CacheReady\"},{\"lastUpdateTime\":\"2024-06-12T00:15:35Z\",\"status\":\"True\",\"type\":\"AgentReady\"},{\"lastUpdateTime\":\"2024-06-12T00:15:28Z\",\"status\":\"False\",\"type\":\"Stopped\"}],\"ipv4\":{\"available\":220,\"used\":0},\"lastUpdate\":\"2024-06-12T00:15:28Z\"}},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"kind\":\"IPPool\",\"metadata\":{\"creationTimestamp\":\"2024-06-12T00:15:27Z\",\"finalizers\":[\"wrangler.cattle.io/vm-dhcp-ippool-controller\"],\"generation\":1,\"managedFields\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:spec\":{\".\":{},\"f:ipv4Config\":{\".\":{},\"f:cidr\":{},\"f:dns\":{},\"f:pool\":{\".\":{},\"f:end\":{},\"f:start\":{}},\"f:router\":{},\"f:serverIP\":{}},\"f:networkName\":{}}},\"manager\":\"OpenAPI-Generator\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:27Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:finalizers\":{\".\":{},\"v:\\\"wrangler.cattle.io/vm-dhcp-ippool-controller\\\"\":{}}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:27Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:status\":{\".\":{},\"f:agentPodRef\":{\".\":{},\"f:image\":{},\"f:name\":{},\"f:namespace\":{},\"f:uid\":{}},\"f:conditions\":{},\"f:ipv4\":{\".\":{},\"f:available\":{},\"f:used\":{}},\"f:lastUpdate\":{}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"subresource\":\"status\",\"time\":\"2024-06-12T00:16:00Z\"}],\"name\":\"vnet1-subnet2-10.10.52.0-24\",\"namespace\":\"default\",\"resourceVersion\":\"102688474\",\"uid\":\"cc7b85dc-d327-4b1d-9009-38cf459af5a2\"},\"spec\":{\"ipv4Config\":{\"cidr\":\"10.10.52.0/24\",\"dns\":[\"10.54.21.21\"],\"pool\":{\"end\":\"10.10.52.240\",\"start\":\"10.10.52.21\"},\"router\":\"10.10.52.1\",\"serverIP\":\"10.10.52.10\"},\"networkName\":\"default/vnet1-subnet2-10.10.52.0-24\"},\"status\":{\"agentPodRef\":{\"image\":\"rancher/harvester-vm-dhcp-agent:v0.3.1\",\"name\":\"default-vnet1-subnet2-10.10.52.0-24-agent\",\"namespace\":\"harvester-system\",\"uid\":\"0ebf49c5-8d33-4016-ae88-c2bb0b0228e0\"},\"conditions\":[{\"lastUpdateTime\":\"2024-06-12T00:15:29Z\",\"status\":\"True\",\"type\":\"Registered\"},{\"lastUpdateTime\":\"2024-06-12T00:15:27Z\",\"status\":\"True\",\"type\":\"CacheReady\"},{\"lastUpdateTime\":\"2024-06-12T00:16:00Z\",\"status\":\"True\",\"type\":\"AgentReady\"},{\"lastUpdateTime\":\"2024-06-12T00:15:27Z\",\"status\":\"False\",\"type\":\"Stopped\"}],\"ipv4\":{\"available\":220,\"used\":0},\"lastUpdate\":\"2024-06-12T00:15:27Z\"}},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"kind\":\"IPPool\",\"metadata\":{\"creationTimestamp\":\"2024-06-12T00:15:27Z\",\"finalizers\":[\"wrangler.cattle.io/vm-dhcp-ippool-controller\"],\"generation\":1,\"managedFields\":[{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:spec\":{\".\":{},\"f:ipv4Config\":{\".\":{},\"f:cidr\":{},\"f:dns\":{},\"f:pool\":{\".\":{},\"f:end\":{},\"f:start\":{}},\"f:router\":{},\"f:serverIP\":{}},\"f:networkName\":{}}},\"manager\":\"OpenAPI-Generator\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:27Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:metadata\":{\"f:finalizers\":{\".\":{},\"v:\\\"wrangler.cattle.io/vm-dhcp-ippool-controller\\\"\":{}}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"time\":\"2024-06-12T00:15:27Z\"},{\"apiVersion\":\"network.harvesterhci.io/v1alpha1\",\"fieldsType\":\"FieldsV1\",\"fieldsV1\":{\"f:status\":{\".\":{},\"f:agentPodRef\":{\".\":{},\"f:image\":{},\"f:name\":{},\"f:namespace\":{},\"f:uid\":{}},\"f:conditions\":{},\"f:ipv4\":{\".\":{},\"f:available\":{},\"f:used\":{}},\"f:lastUpdate\":{}}},\"manager\":\"vm-dhcp-controller\",\"operation\":\"Update\",\"subresource\":\"status\",\"time\":\"2024-06-12T00:15:39Z\"}],\"name\":\"vnet1-subnet3-10.10.53.0-24\",\"namespace\":\"default\",\"resourceVersion\":\"102688007\",\"uid\":\"42dfae9a-eaea-49b5-b428-cbb487824949\"},\"spec\":{\"ipv4Config\":{\"cidr\":\"10.10.53.0/24\",\"dns\":[\"10.54.21.21\"],\"pool\":{\"end\":\"10.10.53.240\",\"start\":\"10.10.53.21\"},\"router\":\"10.10.53.1\",\"serverIP\":\"10.10.53.10\"},\"networkName\":\"default/vnet1-subnet3-10.10.53.0-24\"},\"status\":{\"agentPodRef\":{\"image\":\"rancher/harvester-vm-dhcp-agent:v0.3.1\",\"name\":\"default-vnet1-subnet3-10.10.53.0-24-agent\",\"namespace\":\"harvester-system\",\"uid\":\"ecaf1b3a-1a46-41c2-b92d-b6ae42fbdc93\"},\"conditions\":[{\"lastUpdateTime\":\"2024-06-12T00:15:27Z\",\"status\":\"True\",\"type\":\"Registered\"},{\"lastUpdateTime\":\"2024-06-12T00:15:27Z\",\"status\":\"True\",\"type\":\"CacheReady\"},{\"lastUpdateTime\":\"2024-06-12T00:15:39Z\",\"status\":\"True\",\"type\":\"AgentReady\"},{\"lastUpdateTime\":\"2024-06-12T00:15:27Z\",\"status\":\"False\",\"type\":\"Stopped\"}],\"ipv4\":{\"available\":220,\"used\":0},\"lastUpdate\":\"2024-06-12T00:15:27Z\"}}],\"kind\":\"IPPoolList\",\"metadata\":{\"continue\":\"\",\"resourceVersion\":\"104224533\"}}")


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
        width: 100
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
];


export { SORTABLE_NETWORK_HEADERS, SORTABLE_SUB_NETWORK_HEADERS, DHCP_HEADERS, PLACEHOLDER_DATA, RELEASE_NOTES_HEADERS, SORTABLE_SUB_NETWORK_EXPRESS_HEADERS, RULES_HEADERS, SORTABLE_FIREWALL_NETWORK_HEADERS, RULES_SUBNET_TRANSLATIONS, ENVIRONMENT_HEADERS }