\# RPC issue (rayls\_devnet) — error 522



Data/Hora: 01/02/2026

Projeto: qa-engineering-challenge-rayls



\## Comando

npx hardhat test --network rayls\_devnet



\## Resultado

HH110: Invalid JSON-RPC response received: error code: 522



Observação:

Localmente (Hardhat network) os testes passam: `npx hardhat test` -> 14 passing.

O erro ocorre somente ao apontar para o RPC da devnet.



# RPC Issue (Rayls Devnet) — Error 522 / HH110

Data/Hora: 2026-02-01 (America/Sao_Paulo)

Comando executado:
```powershell
npx hardhat test --network rayls_devnet
```


Resultado:
HardhatError: HH110: Invalid JSON-RPC response received: error code: 522

Observação:

Os testes locais (hardhat network) rodam com sucesso: npx hardhat test

A falha ocorre antes do deploy/testes iniciarem (hook before each), devido à instabilidade do endpoint RPC.
