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
}

const VNET_BUTTONS = [
    {
        label: 'Create',
        type: 'button',
        action: 'create'
    },
    {
        label: 'Refresh',
        type: 'button',
        action: 'refresh'
    },
];


export { ButtonInterface, VNET_BUTTONS }