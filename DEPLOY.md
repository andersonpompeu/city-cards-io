# Deploy no Easypanel

Este guia explica como fazer o deploy da aplicação no Easypanel.

## Pré-requisitos

- Conta no Easypanel
- Repositório Git (GitHub, GitLab, etc.)
- Projeto Supabase configurado

## Configuração no Easypanel

### 1. Criar Novo Projeto

1. Acesse o painel do Easypanel
2. Clique em "Create Project"
3. Selecione "Git Repository"
4. Conecte seu repositório

### 2. Configurar Build

No Easypanel, configure as seguintes opções:

**Build Settings:**
- **Build Method:** Dockerfile
- **Dockerfile Path:** `./Dockerfile`
- **Port:** 80

### 3. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Easypanel:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
VITE_SUPABASE_PROJECT_ID=seu-project-id
```

**Importante:** Obtenha esses valores do seu projeto Supabase em:
- Settings → API → Project URL (VITE_SUPABASE_URL)
- Settings → API → Project API keys → anon public (VITE_SUPABASE_PUBLISHABLE_KEY)
- Settings → General → Reference ID (VITE_SUPABASE_PROJECT_ID)

### 4. Domínio

Configure seu domínio personalizado:
1. Vá em "Domains"
2. Adicione seu domínio
3. Configure os registros DNS conforme indicado pelo Easypanel

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse sua aplicação pelo domínio configurado

## Estrutura do Projeto

O projeto utiliza:
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Cloud)
- **Build:** Multi-stage Docker (Node.js → Nginx)

## Características do Build

### Build Stage
- Node.js 20 Alpine
- Instala dependências com `npm install --legacy-peer-deps`
- Executa build de produção otimizado

### Production Stage
- Nginx Alpine
- Serve arquivos estáticos
- Configuração otimizada para SPA
- Gzip compression ativada
- Cache de assets estáticos
- Security headers

## Verificações Pós-Deploy

Após o deploy, verifique:

1. **Conectividade com Supabase:**
   - Teste login/cadastro
   - Verifique se os dados carregam corretamente

2. **SEO:**
   - Verifique meta tags
   - Teste robots.txt em `/robots.txt`
   - Confira sitemap se implementado

3. **Performance:**
   - Verifique tempo de carregamento
   - Teste em diferentes dispositivos
   - Valide responsive design

4. **Funcionalidades:**
   - Teste todas as rotas principais
   - Verifique área admin
   - Teste área de business owners

## Troubleshooting

### Erro de Build

Se o build falhar:
1. Verifique os logs no Easypanel
2. Confirme que todas as dependências estão no package.json
3. Teste o build localmente: `docker build -t test .`

### Erro de Variáveis de Ambiente

Se houver erro de conexão com Supabase:
1. Verifique se todas as variáveis estão configuradas
2. Confirme que os valores estão corretos
3. Reinicie o deploy após ajustar

### Erro 404 em Rotas

Se páginas internas retornam 404:
1. Verifique se o nginx.conf está sendo copiado corretamente
2. Confirme a configuração `try_files $uri $uri/ /index.html`

## Build Local para Testes

Para testar o Docker localmente antes do deploy:

```bash
# Build da imagem
docker build -t diretorio-local .

# Executar container
docker run -p 8080:80 \
  -e VITE_SUPABASE_URL="https://seu-projeto.supabase.co" \
  -e VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave" \
  -e VITE_SUPABASE_PROJECT_ID="seu-id" \
  diretorio-local

# Acessar em http://localhost:8080
```

## Atualizações

Para fazer deploy de novas versões:
1. Faça commit das mudanças no Git
2. Push para o repositório
3. Easypanel detectará automaticamente e fará redeploy
4. Ou clique em "Redeploy" manualmente no painel

## Suporte

Para problemas específicos:
- **Easypanel:** Consulte a documentação oficial
- **Supabase:** Verifique o status em status.supabase.com
- **Aplicação:** Revise os logs do container no Easypanel
