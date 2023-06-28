import { ethers } from "./ethers-5.6.es.min.js"
import {abi,contractAddress} from "./constants.js"

const connectbutton = document.getElementById("connectbutton")
const fundbutton = document.getElementById("fundbutton")
const balancebutton = document.getElementById("balancebutton")
const withdrawbutton = document.getElementById("withdrawbutton")
connectbutton.onclick = connect
fundbutton.onclick = fund
balancebutton.onclick = getBalance
withdrawbutton.onclick = withdraw

async function connect() {
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method: "eth_requestAccounts"})
        console.log("ok")
        connectbutton.innerHTML = "Connected"
    }
    else{
        console.log("No metamask")
    }
}
async function getBalance() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}`)
    ethAmount = document.getElementById("ethAmount").value
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount)
            })
            await listenForTransactionResponse(transactionResponse,provider)
            console.log("done")
        }
        catch(error){
            console.log(error)
        }
        function listenForTransactionResponse(transactionResponse,provider) {
            console.log(`Mining ${transactionResponse.hash} ...`)
            return new Promise((resolve,reject) => {
                provider.once(transactionResponse.hash, (transactionReceipt) => {
                    console.log(transactionReceipt.confirmations)
                }) 
                resolve()
            })
            
        }
    }
}
async function withdraw() {
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer)
        try{
            const transactionResponse = await contract.withdraw()
            await listenForTransactionResponse(transactionResponse, provider)
        }catch(error){
            console.log(error)
        }
    }
}