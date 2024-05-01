interface HeaderType {
    title: string;
    value: string;
    main: boolean;
    sortable: boolean;
    sort?: string;
};

const NETWORK_HEADERS: HeaderType[] = [
    {
        title: 'Name',
        value: 'name',
        main: true,
        sortable: true,
        sort: 'name',
    },
    {
        title: 'Cluster',
        value: 'cluster',
        main: false,
        sortable: false
    },
    {
        title: 'Subnet',
        value: 'subnetLength',
        main: false,
        sortable: true,
        sort: 'subnetLength'
    },
    {
        title: 'Actions',
        value: 'action',
        main: false,
        sortable: false,
    },
];

const SUB_NETWORK_HEADERS: HeaderType[] = [
    {
        title: 'Subnet Name',
        value: 'name',
        main: true,
        sortable: true,
        sort: 'name',
    },
    {
        title: 'IP Address',
        value: 'address',
        main: false,
        sortable: true,
        sort: 'address'
    },
    {
        title: 'Network Prefix',
        value: 'prefix_len',
        main: false,
        sortable: true,
        sort: 'prefix_len'
    },
    {
        title: 'Actions',
        value: 'action',
        main: false,
        sortable: false,
    },
];


export { NETWORK_HEADERS, HeaderType, SUB_NETWORK_HEADERS }