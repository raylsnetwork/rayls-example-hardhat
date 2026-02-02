\# RPC issue (rayls\_devnet)



Data/Hora: 01/02/2026

Projeto: qa-engineering-challenge-rayls



\## Comando

npx hardhat console --network rayls\_devnet



\## Ação

await ethers.provider.getBlockNumber()



\## Resultado

HH110: Invalid JSON-RPC response received: error code: 521



Observação:

O projeto compila e o console inicia, mas a chamada ao RPC falha com 521 (instabilidade do endpoint).

RPC configurado: https://devnet-rpc.rayls.com

CHAIN\_ID: 123123



