//callback - where we want to get result
const blobToBase64 = (blob: Blob, callback: { (base64data: any): Promise<void>; (arg0: any): void; }) => {
    const reader = new FileReader();
    reader.onload = function () {
        if (typeof reader.result === 'string') {
            const base64data = reader.result.split(",")[1];
            callback(base64data);
        }
    };
    reader.readAsDataURL(blob);
};

export { blobToBase64 };