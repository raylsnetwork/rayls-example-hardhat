# QA Engineering Challenge — Entrega

Repositório: https://github.com/clebergrunge87/qa-engineering-challenge-rayls

## Pré-requisitos
- Node.js 20+
- npm

## Setup (rodar na raiz do projeto)

### 1) Instalar dependências
```bash
npm install 
```

2) Configurar variáveis de ambiente (NÃO commitar .env)

O repositório possui o template .env.example.

Crie o .env localmente (ele já está no .gitignore) e preencha com os valores solicitados sem commitar chaves.

Exemplo (Windows PowerShell):

```
Copy-Item .env.example .env -Force
notepad .env
```

Preencher no .env local:

RPC_URL=https://devnet-rpc.rayls.com

CHAIN_ID=123123

PRIVATE_KEY_OWNER=<private key recebida por e-mail>

PRIVATE_KEY_USER_A=<private key da conta A>

PRIVATE_KEY_USER_B=<private key da conta B>

3) Rodar testes localmente (Hardhat local)

```
npx hardhat test
```

4) Rodar testes na Rayls Devnet

```
npx hardhat test --network rayls_devnet
```

Observação — instabilidade do RPC (devnet)

Ao executar na devnet, podem ocorrer falhas intermitentes do endpoint RPC (ex.: 521/522),
resultando em erros como:

HH110: Invalid JSON-RPC response...

Evidências:

notas/RPC_ISSUE.md

notas/RPC_ISSUE_522.md

Arquivos principais

Contrato: contracts/RaylsToken.sol

Testes: test/RaylsToken.test.ts

Config: hardhat.config.ts

Template env: .env.example
