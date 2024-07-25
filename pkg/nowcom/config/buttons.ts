interface ButtonInterface {
    label: string;
    type: string;
    icon?: boolean;
    action?: string;
    links?: Links[];
};

type Links = {
    href: string;
    label: string;
    icon?: string;
}

const VNET_BUTTONS = [
    // {
    //     label: 'Create',
    //     type: 'button',
    //     icon: 'fa-plus',
    //     action: 'create'
    // },
    {
        label: 'Refresh',
        type: 'button',
        icon: 'fa-refresh',
        action: 'refresh'
    },
];

const FIREWALL_BUTTONS = [
    // {
    //     label: 'Create',
    //     type: 'button',
    //     icon: 'fa-plus',
    //     action: 'create'
    // },
    {
        label: 'Refresh',
        type: 'button',
        icon: 'fa-refresh',
        action: 'refresh'
    },
];


export { ButtonInterface, VNET_BUTTONS, FIREWALL_BUTTONS }