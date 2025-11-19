# Guia do Proprietário de Empresa

## 🔐 Acesso ao Painel da Empresa

### Como fazer login

1. Acesse `/empresa/login`
2. Digite o email e senha fornecidos pelo administrador
3. Você será redirecionado para o dashboard da sua empresa

**Importante:** Apenas usuários com a role `business_owner` e que tenham uma empresa vinculada podem acessar este painel.

## 📊 Dashboard

O dashboard apresenta:

### Status da Empresa

**Badge de Status:**
- 🟡 **Pendente**: Seu cadastro está sendo analisado
- 🟢 **Aprovada**: Sua empresa está visível na plataforma
- 🔴 **Rejeitada**: Seu cadastro foi rejeitado (verifique o motivo)
- ⚪ **Inativa**: Sua empresa está desativada

### Estatísticas

- **Visualizações do Perfil**: Quantas vezes seu perfil foi visto
- **Cliques no Telefone**: Quantas vezes clicaram em seu telefone
- **Cliques no WhatsApp**: Quantas vezes clicaram no WhatsApp
- **Cliques no Website**: Quantas vezes visitaram seu site
- **Nota Média**: Sua avaliação média (0-5 estrelas)
- **Total de Avaliações**: Quantidade de avaliações recebidas

### Gráfico de Visualizações

Mostra suas visualizações dos últimos 7 dias.

### Atalhos Rápidos

- **Editar Perfil**: Ir para edição de perfil
- **Ver Avaliações**: Gerenciar avaliações
- **Ver no Site**: Visualizar como os clientes veem seu perfil

## 📝 Editar Perfil da Empresa

**Em desenvolvimento**

Esta funcionalidade permitirá editar:
- Nome da empresa
- Categoria
- Descrição
- Telefone, WhatsApp, Email, Website
- Endereço completo
- Horário de funcionamento
- Imagens da empresa

## ⭐ Gerenciar Avaliações

Acesse `/empresa/avaliacoes` para ver e responder avaliações.

### Visualizar Avaliações

Cada avaliação mostra:
- Nome do cliente
- Nota (1-5 estrelas)
- Comentário
- Data da avaliação
- Sua resposta (se houver)

### Responder a uma Avaliação

1. Encontre a avaliação que deseja responder
2. Clique em "Responder"
3. Digite sua resposta (máx. 500 caracteres)
4. Clique em "Enviar Resposta"

**Importante:**
- ✅ Você pode responder cada avaliação uma única vez
- ✅ Suas respostas ficam públicas e aparecem abaixo da avaliação
- ❌ Você não pode deletar ou editar avaliações de clientes
- ✅ Você pode editar sua própria resposta (em breve)

### Dicas para Responder Avaliações

**Avaliações Positivas:**
- Agradeça o cliente
- Reforce pontos positivos mencionados
- Convide-o a voltar

**Avaliações Negativas:**
- Mantenha a calma e seja profissional
- Peça desculpas pelo problema
- Ofereça uma solução
- Convide para conversar em particular

Exemplo:
```
"Olá [Nome]! Agradecemos seu feedback. Lamentamos que sua experiência 
não tenha sido satisfatória. Estamos trabalhando para melhorar [ponto mencionado]. 
Por favor, entre em contato conosco pelo WhatsApp para resolvermos essa situação. 
Obrigado!"
```

## 📈 Estatísticas

Acesse `/empresa/estatisticas` para ver dados detalhados.

### Métricas Disponíveis

- Total de visualizações do perfil
- Cliques em cada tipo de ação (telefone, email, WhatsApp, website)
- Gráficos de visualizações ao longo do tempo
- Distribuição de ações por tipo (gráfico de pizza)
- Distribuição de avaliações (quantas 5 estrelas, 4 estrelas, etc.)

**Nota:** Atualmente os dados são simulados. A coleta de dados reais será implementada em breve.

## 🔒 Segurança

Acesse `/empresa/senha` para gerenciar suas credenciais.

### Alterar Senha

1. Digite sua nova senha (mínimo 6 caracteres)
2. Confirme a nova senha
3. Clique em "Alterar Senha"

### Alterar Email de Login

1. Digite seu novo email
2. Clique em "Alterar Email"
3. **Importante**: Você receberá um email de confirmação no novo endereço
4. Clique no link de confirmação para completar a alteração

## 🚪 Sair do Sistema

Clique no botão "Sair" no canto superior direito do painel.

---

## 💡 Dicas para Melhorar sua Presença

### 1. Complete seu Perfil

**Em breve:** Certifique-se de preencher todas as informações:
- Fotos de qualidade da sua empresa
- Horários de funcionamento atualizados
- Todos os meios de contato
- Descrição detalhada dos serviços

### 2. Responda Todas as Avaliações

- Clientes valorizam empresas que respondem
- Demonstra que você se importa com feedback
- Melhora sua imagem profissional

### 3. Mantenha Informações Atualizadas

- Atualize horários em feriados
- Mantenha telefone e email atuais
- Atualize fotos regularmente

### 4. Monitore suas Estatísticas

- Verifique quais ações são mais clicadas
- Identifique dias/horários de maior visualização
- Use esses dados para otimizar sua presença

### 5. Incentive Avaliações

- Peça feedback aos seus clientes satisfeitos
- Facilite o processo compartilhando o link da sua página
- Mais avaliações = mais confiança dos novos clientes

## ❓ Problemas Comuns

### Não consigo fazer login

- Verifique se está usando o email correto
- Certifique-se de que sua conta foi criada pelo administrador
- Use "Esqueci minha senha" se necessário

### Meu perfil não aparece no site

- Verifique o status no dashboard
- Se estiver "Pendente", aguarde aprovação
- Se estiver "Rejeitada", entre em contato com o suporte

### Não consigo responder avaliações

- Certifique-se de estar logado
- Cada avaliação pode ser respondida apenas uma vez
- Se o botão não aparece, pode já ter respondido

## 📞 Suporte

Para problemas técnicos ou dúvidas, entre em contato com o administrador da plataforma.
