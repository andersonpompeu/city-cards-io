# Guia do Administrador

## 🔐 Acesso ao Painel Administrativo

### Como fazer login

1. Acesse `/admin/login`
2. Digite suas credenciais de administrador
3. Você será redirecionado para o dashboard

**Importante:** Apenas usuários com a role `admin` no banco de dados podem acessar o painel administrativo.

## 📊 Dashboard

O dashboard apresenta:
- **Total de Empresas**: Número total de empresas cadastradas
- **Empresas Aprovadas**: Empresas com status "approved"
- **Aguardando Aprovação**: Empresas com status "pending"
- **Total de Avaliações**: Número total de avaliações na plataforma
- **Gráfico de Acessos**: Visualizações dos últimos 7 dias
- **Últimas Empresas**: Lista das 5 empresas mais recentemente cadastradas

## 🏢 Gestão de Empresas

### Listar Empresas

Acesse `/admin/empresas` para ver todas as empresas.

**Filtros disponíveis:**
- Busca por nome
- Filtro por status (Todas, Pendentes, Aprovadas, Rejeitadas, Inativas)

**Ações disponíveis:**
- ✏️ **Editar**: Editar informações da empresa
- ✅ **Aprovar**: Aprovar empresa pendente
- ❌ **Rejeitar**: Rejeitar empresa pendente
- ⚡ **Ativar/Desativar**: Alternar status entre ativo e inativo
- 🗑️ **Deletar**: Remover empresa (requer confirmação)

### Aprovar uma Empresa

1. Na lista de empresas, encontre uma com status "Pendente"
2. Clique no ícone de check (✅)
3. A empresa será aprovada e ficará visível publicamente

### Rejeitar uma Empresa

1. Na lista de empresas, encontre uma com status "Pendente"
2. Clique no ícone de X (❌)
3. A empresa será rejeitada

### Criar Nova Empresa

**Em desenvolvimento**

## 📁 Gestão de Categorias

Acesse `/admin/categorias` para gerenciar categorias.

### Criar Categoria

1. Clique em "Nova Categoria"
2. Preencha:
   - **Nome**: Nome da categoria (obrigatório)
   - **Slug**: URL amigável (gerado automaticamente se deixado em branco)
   - **Ícone**: Nome do ícone Lucide (ex: Wrench, Coffee, Heart)
   - **Descrição**: Descrição opcional
3. Clique em "Salvar"

### Editar Categoria

1. Clique no ícone de lápis (✏️) na linha da categoria
2. Atualize os campos desejados
3. Clique em "Salvar"

### Deletar Categoria

1. Clique no ícone de lixeira (🗑️)
2. **Nota**: Você só pode deletar categorias que não têm empresas vinculadas

## 👥 Gestão de Usuários Empresariais

**Em desenvolvimento**

Esta funcionalidade permitirá:
- Criar contas para proprietários de empresas
- Vincular usuários a empresas específicas
- Ativar/desativar usuários
- Redefinir senhas

## ⚙️ Configurações da Plataforma

**Em desenvolvimento**

Esta funcionalidade permitirá configurar:
- Nome da plataforma
- Logo
- Cores do tema
- Meta tags SEO globais
- Google Analytics ID

## 🚪 Sair do Sistema

Clique no botão "Sair" no canto superior direito do painel.

---

## 💡 Dicas

1. **Moderação de Empresas**: Aprove empresas regularmente para manter a plataforma atualizada
2. **Categorias**: Mantenha categorias organizadas e relevantes
3. **Monitoramento**: Use o dashboard para acompanhar o crescimento da plataforma

## 🔧 Criando um Usuário Administrador

Para criar um usuário administrador, você precisa:

1. Criar uma conta normalmente via signup
2. No banco de dados, adicionar um registro na tabela `user_roles`:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('SEU_USER_ID_AQUI', 'admin');
```

Substitua `SEU_USER_ID_AQUI` pelo UUID do usuário que você quer tornar admin.
