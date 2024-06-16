const validParams: { [key: string]: RegExp } = {
    transaction_type: /^([1-2](,[1-2])*)?$/,
    property_type: /^([1-9]|1[0-8])(,([1-9]|1[0-8]))*$/,
    location: /^(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38)(,(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38))*$/,
    reference_number: /^[a-zA-Z0-9-]+$/,
    price: /^\d+(\.\d+)?$/,
    maxprice: /^\d+(\.\d+)?$/,
    minprice: /^\d+(\.\d+)?$/,
    bed: /^\d+$/,
    maxbed: /^\d+$/,
    minbed: /^\d+$/,
    bathrooms: /^\d+$/,
    maxbath: /^\d+$/,
    minbath: /^\d+$/,
    terrace: /^(1|2)$/,
    parking: /^(1|2)$/,
    balcony: /^(1|2)$/,
    garden: /^(1|2)$/,
    electrodometics: /^(1|2)$/,
    heating: /^(1|2)$/,
    elevator: /^(1|2)$/,
    furnished: /^(1|2)$/,
};

function correctParameterName(key: string): string {
    const corrections: { [key: string]: string } = {
        locationlocation: "location",
        transaction: "transaction_type",
        // TODO: Add more corrections
    };

    if (corrections[key]) {
        return corrections[key];
    }

    const lowerKey = key.toLowerCase();
    if (validParams[lowerKey]) {
        return lowerKey;
    }

    for (const validKey in validParams) {
        const regex = new RegExp(`^${validKey}${validKey}$`, 'i');
        if (regex.test(key)) {
            return validKey;
        }
    }

    return key;
}

export function validateAndCorrectParams(paramsString: string): string {
    const params = paramsString.split('&');
    const correctedParams: string[] = [];

    params.forEach(param => {
        const [key, value] = param.split('=');

        const correctedKey = correctParameterName(key);

        if (validParams[correctedKey] && validParams[correctedKey].test(value)) {
            correctedParams.push(`${correctedKey}=${value}`);
        } else {
            console.warn(`Invalid parameter: ${param}`);
        }
    });

    return correctedParams.join('&');
}
