export const isValidIP = (ip: string) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[1-9][0-9]?|0)$/;
    return ipRegex.test(ip);
}

export const stripStrings = (input: string) => {
    const firstDashIndex = input.indexOf("-");
    if (firstDashIndex === -1) return input;

    const secondDashIndex = input.indexOf("-", firstDashIndex + 1);
    if (secondDashIndex === -1) return input;

    return input.substring(firstDashIndex + 1, secondDashIndex);
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