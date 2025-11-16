# Design System - Grupo Adriano

## Paleta de Cores

### Cores Principais

#### Ocean Blue (Azul Oceano)
- **Uso**: Cor primária principal, elementos de destaque, fundos de cartões importantes
- **Default**: `#003161` - Azul oceano profundo
- **Light**: `#3D58B6` - Royal blue
- **Dark**: `#001F3D` - Azul oceano escuro

#### Forest Green (Verde Floresta)
- **Uso**: Cor secundária, ações de sucesso, valores positivos
- **Default**: `#00610D` - Verde floresta
- **Light**: `#70E080` - Mint green (verde menta)
- **Dark**: `#004008` - Verde floresta escuro

#### Golden Sand (Dourado)
- **Uso**: Cor de acento, destaques, elementos premium
- **Default**: `#DAB655` - Dourado areia
- **Light**: `#F0D685` - Dourado claro
- **Dark**: `#B89640` - Dourado escuro

### Cores Semânticas

#### Success (Sucesso)
- **Default**: `#00610D` - Forest green
- **Light**: `#70E080` - Mint green
- **Uso**: Transações positivas, depósitos recebidos, confirmações

#### Danger (Perigo/Erro)
- **Default**: `#610019` - Burgundy red
- **Light**: `#8B0025` - Vermelho vinho claro
- **Uso**: Erros, valores negativos, alertas críticos

#### Royal Blue (Azul Real)
- **Default**: `#3D58B6` - Azul royal
- **Light**: `#5D78D6` - Azul royal claro
- **Dark**: `#2D4896` - Azul royal escuro
- **Uso**: Links, ações secundárias, informações

### Cores Neutras

#### Silver Gray (Cinza Prata)
- **Default**: `#B3B6CA` - Cinza prata
- **Light**: `#D3D6EA` - Cinza prata claro
- **Dark**: `#9396AA` - Cinza prata escuro
- **Uso**: Bordas, divisores, elementos desabilitados

#### Charcoal Gray (Cinza Carvão)
- **Default**: `#686A75` - Cinza carvão
- **Light**: `#888A95` - Cinza carvão claro
- **Dark**: `#484A55` - Cinza carvão escuro
- **Uso**: Textos secundários, ícones, placeholders

## Classes Utilitárias

### Gradientes

```css
.gradient-primary   /* Ocean blue → Royal blue → Ocean blue dark */
.gradient-success   /* Forest green → Mint green */
.gradient-accent    /* Golden sand → Golden sand dark */
.gradient-text      /* Ocean blue → Royal blue (para texto) */
```

### Botões

```css
.btn-primary        /* Gradiente azul oceano/royal, texto branco */
.btn-secondary      /* Gradiente verde floresta/mint, texto branco */
.btn-outline        /* Borda azul oceano, hover com fundo */
```

### Componentes

```css
.card               /* Card branco com sombra */
.input-field        /* Input com borda cinza prata, foco azul royal */
```

## Mapeamento de Uso

### Telas de Autenticação
- Fundo lado esquerdo: `gradient-primary` (Ocean blue → Royal blue)
- Logo: `ocean-blue` com fundo `white/10`
- Botões principais: `gradient-primary`
- Links: `ocean-blue` com hover `ocean-blue/80`

### Dashboard
- WalletCard fundo: `gradient-primary`
- Botão Depositar: Branco com texto `ocean-blue`
- Botão Transferir: Branco com texto `ocean-blue`
- Botão Histórico: Outline branco, hover inverte

### Transações
- Valores positivos: `forest-green` ou `mint-green`
- Valores negativos: `burgundy-red`
- Ícone recebido: `mint-green`
- Ícone enviado: `royal-blue`
- Ícone depósito: `mint-green`
- Badge concluída: `forest-green` background claro

## Acessibilidade

### Contraste de Cores
- Ocean blue (#003161) em branco: ✅ AAA (Excelente)
- Forest green (#00610D) em branco: ✅ AAA (Excelente)
- Royal blue (#3D58B6) em branco: ✅ AA (Bom)
- Golden sand (#DAB655) em ocean-blue: ✅ AAA (Excelente)

### Recomendações
- Sempre usar texto branco sobre cores escuras (ocean-blue, forest-green)
- Usar cores complementares para garantir legibilidade
- Manter elementos interativos com contraste mínimo de 4.5:1
- Usar ícones junto com cores para indicar estados (não confiar só na cor)

## Referência Rápida Tailwind

```javascript
// Cores no Tailwind
bg-ocean-blue
bg-forest-green
bg-golden-sand
bg-royal-blue
bg-mint-green
bg-silver-gray
bg-charcoal-gray

// Com variações
bg-ocean-blue-light
bg-ocean-blue-dark
text-forest-green
border-royal-blue
```
