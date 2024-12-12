export interface Subnets {
  address: string;
  formattedAddress: string;
  name: string;
  longName: string;
  prefix_len: number;
  translatedAddress: string;
}

export interface Vnets {
  name: string;
  subnets: Subnets[];
  subnetLength: number;
  cluster: string;
  translatedAddress: string;
}

export interface tridentVariables {
  items: Vnets[],
  topNav: boolean,
  azureToken: string
}