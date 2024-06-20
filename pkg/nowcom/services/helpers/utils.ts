export const isValidIP = (ip: string) => {
    // const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[1-9][0-9]?|0)$/;
    const ipRegex = /^10\.(25[0-5]|2[0-4][0-9]|1[0-9]{1,2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{1,2}|[1-9]?[0-9])\.0$/;
    return ipRegex.test(ip);
}

export const stripStrings = (networkName: string, subnetName: string, addressSub: string) => {
    const prefix = `${networkName}-`;
    const suffix = `-${addressSub}`;
    
    if (subnetName.startsWith(prefix) && subnetName.endsWith(suffix)) {
        const stripped = subnetName.slice(prefix.length, -suffix.length);
        return stripped;
    }
    return subnetName;
}

export const findTranslatedAddress = (addressList: any[], addressName: string) => {
    return addressList.find((d) => d.metadata?.ownerReferences?.find((owner: any) => owner.name === addressName))
}

export const combineArraysIntoObjects = (subnets: any, subnetNames: any) => {
    if (subnets.length !== subnetNames.length) {
        console.error("Arrays must have the same length");
        return [];
    }

    // Use map to combine the arrays into an array of objects
    const combinedArray = subnets.map((subnet: any, index: number) => {
        return {
            address: subnet,
            name: subnetNames[index],
            prefix_len: 24
        };
    });

    return combinedArray;
}

export const transformArrayToObject = (arr: { key: string, value: string }[]): { [key: string]: string } => {
    return arr.reduce((acc: { [key: string]: string }, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
}

export const validateString = (input: string) => {
    const regex = /^[a-zA-Z0-9-.]+$/;
    return regex.test(input);
}

export const stripErrorMessage = (errorMessage: string) => {
    const parts = errorMessage.split('denied the request: ');
    if (parts.length > 1) {
        return parts[1].trim();
    }
    return errorMessage;
}