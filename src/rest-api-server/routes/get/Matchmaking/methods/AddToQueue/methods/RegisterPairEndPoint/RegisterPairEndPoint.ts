const registerPairEndPoint = (prod: boolean): string => {
    return prod ? "https://matthew-godin.com/registerPair" : "http://localhost:5000/registerPair";
}

export default registerPairEndPoint;
