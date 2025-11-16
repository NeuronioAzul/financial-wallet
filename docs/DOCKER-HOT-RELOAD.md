# Docker Hot Reload - Frontend

## Problema

O container do frontend não estava fazendo hot reload (HMR - Hot Module Replacement) automático das mudanças no código, exigindo reinicialização manual do container a cada alteração.

## Causa

O Vite, quando executado dentro de um container Docker, precisa de configurações específicas:

1. **File Watching no Docker**: Por padrão, o sistema de watch de arquivos do Vite não funciona bem com volumes Docker no Linux
2. **HMR Host**: O Hot Module Replacement precisa saber o host correto para se conectar

## Solução Implementada

### 1. Configuração do Vite (`frontend/vite.config.ts`)

```typescript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      usePolling: true, // Necessário para Docker funcionar corretamente
      interval: 100,    // Verificar a cada 100ms
    },
    hmr: {
      protocol: 'ws',   // WebSocket
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
    },
  },
})
```

**Explicação:**
- `host: '0.0.0.0'` - Permite conexões de qualquer IP (necessário para Docker)
- `strictPort: true` - Falha se a porta já estiver em uso
- `watch.usePolling: true` - Usa polling em vez de eventos do sistema de arquivos (funciona melhor com volumes Docker)
- `watch.interval: 100` - Verifica mudanças a cada 100ms
- `hmr.protocol: 'ws'` - Usa WebSocket para HMR
- `hmr.clientPort` - Porta que o navegador usa para conectar ao WebSocket

### 2. Volume do node_modules

O `docker-compose.yml` já está configurado corretamente com volume nomeado para `node_modules`:

```yaml
volumes:
  - ./frontend:/app
  - frontend_node_modules:/app/node_modules  # Volume nomeado para melhor performance
```

## Como Testar

1. Com o container rodando, faça uma alteração em qualquer arquivo `.tsx` ou `.ts`
2. Salve o arquivo
3. O navegador deve recarregar automaticamente em 1-2 segundos
4. Verifique no terminal do container se aparecem logs de HMR:
   ```
   [vite] hmr update /src/pages/StyleGuidePage.tsx
   ```

## Comportamento Esperado

### Arquivos `.tsx` e `.ts`
✅ **HMR funciona** - O componente é atualizado sem recarregar a página inteira

### Arquivo `tailwind.config.js`
⚠️ **Page reload completo** - O Vite força um reload da página inteira

**Solução para tailwind.config.js:**
- Após salvar mudanças, faça um **hard reload** no navegador: `Ctrl + Shift + R` (Linux/Windows) ou `Cmd + Shift + R` (Mac)
- Ou limpe o cache do navegador: `Ctrl + F5`

### Arquivo `index.css`
⚠️ **Page reload completo** - Mudanças em CSS global requerem reload

## Comandos Úteis

### Ver logs do container frontend

```bash
docker compose logs -f frontend
```

### Reiniciar apenas o frontend (se necessário)

```bash
docker compose restart frontend
```

### Rebuild completo (após mudanças no Dockerfile ou package.json)

```bash
docker compose up -d --build frontend
```

## Troubleshooting

### HMR ainda não funciona

1. **Verificar porta**: Certifique-se que a porta 3000 está acessível
2. **Limpar cache do navegador**: Ctrl+Shift+R para hard reload
3. **Rebuild do container**:
   ```bash
   docker compose down
   docker compose up -d --build frontend
   ```

### Performance lenta

O `usePolling: true` pode consumir mais CPU. Se necessário, você pode ajustar o intervalo:

```typescript
watch: {
  usePolling: true,
  interval: 1000, // Verificar a cada 1 segundo (padrão é 100ms)
}
```

### Problema com WSL2 (Windows)

No WSL2, o polling pode não funcionar bem. Alternativas:

1. Usar o código diretamente no WSL2 (não no Windows)
2. Aumentar o limite de watchers:
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## Referências

- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Vite Docker Guide](https://vitejs.dev/guide/troubleshooting.html#dev-server)
