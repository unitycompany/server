# Schema da Coleção "assinaturas" - Banco Default

## Visão Geral
Esta documentação descreve a estrutura da coleção `assinaturas` que deve ser criada no banco de dados Firebase `default` (unitycompany-2dbbe) para armazenar informações sobre assinaturas e serviços pagos.

## Nome da Coleção
- **Nome**: `assinaturas`
- **Banco**: `default` (unitycompany-2dbbe)

## Campos da Coleção

### Campos Obrigatórios
1. **nome** (string)
   - Descrição: Nome da assinatura/serviço
   - Exemplo: "Netflix Premium", "Adobe Creative Cloud", "GitHub Pro"
   - Obrigatório: Sim

2. **empresa** (string)
   - Descrição: Empresa à qual a assinatura pertence
   - Valores aceitos: "Unity", "Nova Metálica", "Fast Sistemas Construtivos", "Fast Homes", "Pousada Le Ange", "Milena"
   - Obrigatório: Sim

3. **acesso** (string)
   - Descrição: Link de acesso ao serviço/plataforma
   - Formato: Sempre iniciado com "https://"
   - Exemplo: "https://netflix.com", "https://adobe.com/login"
   - Obrigatório: Sim

4. **status** (string)
   - Descrição: Status atual da assinatura
   - Valores aceitos: "ativo", "inativo", "suspenso"
   - Padrão: "ativo"
   - Obrigatório: Sim

### Campos de Valor e Pagamento
4. **mensalidade** (string/number)
   - Descrição: Valor fixo da assinatura
   - Exemplo: "29.90", "150.00"
   - Obrigatório: Não (pode ser vazio se valorRelativo for true)

5. **tipoPagamento** (string)
   - Descrição: Frequência do pagamento
   - Valores aceitos: "mensal", "anual"
   - Padrão: "mensal"
   - Obrigatório: Sim

6. **moeda** (string)
   - Descrição: Tipo de moeda utilizada
   - Valores aceitos: "real", "dolar"
   - Padrão: "real"
   - Obrigatório: Sim

7. **valorRelativo** (boolean)
   - Descrição: Indica se o valor é uma faixa (de X até Y)
   - Padrão: false
   - Obrigatório: Sim

8. **valorMin** (string/number)
   - Descrição: Valor mínimo (usado quando valorRelativo = true)
   - Exemplo: "10.00"
   - Obrigatório: Apenas se valorRelativo = true

9. **valorMax** (string/number)
   - Descrição: Valor máximo (usado quando valorRelativo = true)
   - Exemplo: "50.00"
   - Obrigatório: Apenas se valorRelativo = true

### Campos Opcionais
10. **observacoes** (string)
    - Descrição: Informações adicionais sobre a assinatura
    - Exemplo: "Inclui 5 usuários", "Renovação automática"
    - Obrigatório: Não

## Exemplos de Documentos

### Exemplo 1: Assinatura com Valor Fixo
```json
{
  "nome": "Netflix Premium",
  "empresa": "Unity",
  "mensalidade": "45.90",
  "status": "ativo",
  "acesso": "https://netflix.com/login",
  "tipoPagamento": "mensal",
  "moeda": "real",
  "valorRelativo": false,
  "valorMin": "",
  "valorMax": "",
  "observacoes": "Plano premium com 4 telas simultâneas"
}
```

### Exemplo 2: Assinatura com Valor Relativo
```json
{
  "nome": "AWS Cloud Services",
  "empresa": "Unity",
  "mensalidade": "",
  "status": "ativo",
  "acesso": "https://aws.amazon.com/console",
  "tipoPagamento": "mensal",
  "moeda": "dolar",
  "valorRelativo": true,
  "valorMin": "50.00",
  "valorMax": "500.00",
  "observacoes": "Varia conforme uso de recursos"
}
```

### Exemplo 3: Assinatura Anual
```json
{
  "nome": "Adobe Creative Cloud",
  "empresa": "Nova Metálica",
  "mensalidade": "1200.00",
  "status": "ativo",
  "acesso": "https://adobe.com/creativecloud",
  "tipoPagamento": "anual",
  "moeda": "real",
  "valorRelativo": false,
  "valorMin": "",
  "valorMax": "",
  "observacoes": "Licença completa para toda equipe de design"
}
```

## Regras de Validação

1. **Campos obrigatórios**: `nome`, `empresa`, `acesso`, `status`, `tipoPagamento`, `moeda`, `valorRelativo`
2. **Valores relativos**: Se `valorRelativo = true`, os campos `valorMin` e `valorMax` devem ser preenchidos
3. **Valor fixo**: Se `valorRelativo = false`, o campo `mensalidade` deve ser preenchido
4. **Status válidos**: Apenas "ativo", "inativo" ou "suspenso"
5. **Empresas válidas**: "Unity", "Nova Metálica", "Fast Sistemas Construtivos", "Fast Homes", "Pousada Le Ange", "Milena"
6. **Tipo de pagamento**: Apenas "mensal" ou "anual"
7. **Moeda**: Apenas "real" ou "dolar"
8. **Formato do link**: Deve sempre começar com "https://"

## Como Criar a Coleção

### Opção 1: Via Console Firebase
1. Acesse o Console Firebase
2. Navegue até o projeto "unity"
3. Vá em Firestore Database
4. Clique em "Iniciar uma coleção"
5. Nome da coleção: `assinaturas`
6. Adicione o primeiro documento com os campos descritos acima

### Opção 2: Via Interface do Sistema
1. Acesse a página de Assinaturas no dashboard
2. Clique em "Nova Assinatura"
3. Preencha os campos e salve
4. A coleção será criada automaticamente

## Funcionalidades da Interface

A página de assinaturas oferece:
- ✅ Visualização em formato de planilha com bordas definidas
- ✅ Busca por nome
- ✅ Filtro por status e empresa  
- ✅ Adição de novas assinaturas
- ✅ Edição de assinaturas existentes
- ✅ Exclusão de assinaturas
- ✅ Suporte a valores fixos e variação de custo
- ✅ Suporte a diferentes moedas (Real/Dólar)
- ✅ Opção de pagamento mensal/anual
- ✅ Campo de observações
- ✅ **Resumo financeiro** com totais mensais/anuais
- ✅ **Exportação para CSV** com dados completos
- ✅ **Contagem de softwares ativos** 
- ✅ **Cálculos automáticos** por empresa selecionada
- ✅ **Fontes padrão** Inter/System fonts

## Notas Importantes

- A coleção será criada automaticamente no banco "unity" quando a primeira assinatura for adicionada
- Todos os valores monetários são armazenados como string para preservar formatação
- O campo `valorRelativo` determina se o sistema deve usar `mensalidade` ou a faixa `valorMin`-`valorMax`
- A formatação da exibição inclui símbolo da moeda e frequência de pagamento
