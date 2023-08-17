const axios = require("axios");


const ALCHEMY_URL = "https://eth-goerli.g.alchemy.com/v2/yv-ork0EkqfYLkz3rSjoUle1h-a-G_ad";

const address = "0x058D9aE7588B7f25AC0DDa12c9b3A1C07dA362AC";


const eth_getBlockByNumber = () => { 

axios.post(ALCHEMY_URL, {
    jsonrpc: '2.0',
    method: 'eth_getBlockByNumber',
    params: ['latest', false],
}).then((response) => {
    console.log("BLOCK_NUMBER:", response.data.result)
}).catch((err) => {
    alert("we had a problem getting the data from the server") 
});

}

const ethgetBalance =  (address) => {

    axios.post(ALCHEMY_URL, {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
    }).then((response) => {
        const balanceInWei = parseInt(response.data.result, 16);
        const balanceInEther = balanceInWei/1e18
        console.log("BALANCE:", balanceInEther)
    }).catch((err) => {
        console.log(err)
        console.log("we had a problem getting the data from the server") 
    });

}

ethgetBalance(address)
eth_getBlockByNumber()

/*
get_getBlockByNumber
eth_feehistory 
eth_getCode
eth_estimateGas 

*/ 


const get_feeHistory = (address) => {
    axios.post(ALCHEMY_URL, {
        jsonrpc: '2.0',
        method: 'eth_feeHistory',
        params: [5, "latest",],
    }).then((response) => {
        console.log( "FEE HISTORY:",response.data.result)
    }).catch((err) => {
        console.log(err)
        console.log("we had a problem getting the data from the server") 
    });
}
 
get_feeHistory(address);

const getCode = (address) => {
    axios.post(ALCHEMY_URL, {
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [address, "latest"],
    }).then((response) => {
        console.log("CODE:", response.data.result)
    }).catch((err) => {
        console.log(err)
        console.log("we had a problem getting the data from the server") 
    });
}

getCode(address)

const estimateGas = () => {
  axios
    .post(ALCHEMY_URL, {
      jsonrpc: "2.0",
      id: 1, // You can use any unique number here
      method: "eth_estimateGas",
      params: [
        {
          from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          value: "0x0",
          data: "0x", // Here you can provide the actual data if needed
        },
      ],
    })
    .then((response) => {
        const gasInWei = parseInt(response.data.result, 16);
        const gasInEther = gasInWei / 1e9;
        console.log("gas:", gasInEther);
    })
    .catch((err) => {
      console.log(err);
      console.log("We had a problem getting the data from the server");
    });
};

estimateGas()


