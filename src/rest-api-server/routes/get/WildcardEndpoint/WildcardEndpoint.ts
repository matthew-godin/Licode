const wildcardEndpoint = (context, prod: boolean) => {
    context.response.body = { endpoint: 
        prod ? "wss://matthew-godin.com/ws" : "ws://localhost:5000/ws"
    };
};

export default wildcardEndpoint;
