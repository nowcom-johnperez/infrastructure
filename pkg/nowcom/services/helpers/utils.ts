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