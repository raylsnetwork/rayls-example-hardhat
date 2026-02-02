QA Engineering Challenge - Notas (Cleber)

1) Repositório:
- URL: https://dev.azure.com/parfin/PS/_git/vault-contract-poc
- Status acesso: aguardando liberação

2) Rede (Rayls Devnet):
- RPC_URL: https://devnet-rpc.rayls.com
- CHAIN_ID: 123123
- Explorer: https://devnet-explorer.rayls.com/
- MetaMask: erro ao validar RPC (remove https / não obtém chainId). Resolver depois.

3) Contas exigidas (3):
- OWNER/DEPLOYER: 0x416679D111Db8c02C658321D27cdFFaCdD3B8F19
- USER_A: 0xD07c86AB9Ebb23cB58B616bF1cc3e96A2E433f5A
- USER_B: 0x15b22844743481B5a7eA4eba8e861Bb8351c4280

“Private key do OWNER veio por e-mail e será usada no .env como PRIVATE_KEY_OWNER (não commitar).”
Obs: não registrar private keys aqui. Somente lembrar de criar/guardar em .env local.

4) Cenários obrigatórios do teste (E2E):
- Deployment & Ownership (owner = deployer)
- Access control mint (owner minta; userB não pode)
- Allowance (approve + transferFrom + validar saldos/allowance)
- Burn (userB burn e totalSupply reduz)

5) Checklist quando liberar o repo:
- [ ] git clone
- [ ] npm install
- [ ] criar .env
- [ ] configurar hardhat.config.ts para rayls_devnet
- [ ] rodar testes: npx hardhat test --network rayls_devnet
- [ ] PR com instruções e evidências
