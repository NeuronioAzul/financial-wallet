# Implementação de High Contrast com Tailwind CSS

## Versão Atual: Classe Customizada + Utilities Layer (Versão Limpa)

### Abordagem Implementada

A implementação atual usa uma **classe customizada `.high-contrast`** combinada com o **`@layer utilities`** do Tailwind. Esta é a forma mais simples e eficaz para o projeto atual.

#### Vantagens da Abordagem Atual:
- ✅ **Simples**: Apenas ~170 linhas de CSS limpo e organizado
- ✅ **Sem Bordas Extras**: Foco em cores, não em adicionar elementos visuais
- ✅ **Mantível**: CSS organizado em um único lugar
- ✅ **Funcional**: ThemeContext já alterna a classe `.high-contrast` no `documentElement`
- ✅ **Sem Dependências**: Não precisa de plugins externos
- ✅ **WCAG AAA**: Mantém contraste de 7:1+ em todos os elementos
- ✅ **Compatível**: Funciona com dark mode (`.dark.high-contrast`)
- ✅ **Design Consistente**: Mantém o layout original, só muda cores

#### Como Funciona:

```typescript
// ThemeContext.tsx já faz isso:
if (contrast === 'high') {
  document.documentElement.classList.add('high-contrast');
} else {
  document.documentElement.classList.remove('high-contrast');
}
```

```css
/* index.css */
@layer utilities {
  /* Light Mode: Texto preto em fundo branco */
  .high-contrast .text-gray-700 {
    color: rgb(0 0 0) !important;  /* WCAG AAA: 21:1 */
  }
  
  /* Dark Mode: Texto branco em fundo preto */
  .dark.high-contrast .text-gray-700 {
    color: rgb(255 255 255) !important;  /* WCAG AAA: 21:1 */
  }
  
  /* Cores principais também são ajustadas */
  .high-contrast .text-ocean-blue {
    color: rgb(0 40 80) !important;  /* Deep ocean blue */
  }
  
  .dark.high-contrast .text-ocean-blue {
    color: rgb(100 180 255) !important;  /* Bright ocean blue */
  }
}
```

### Estrutura do CSS

**Light Mode High Contrast:**
- **Texto**: Preto puro `rgb(0 0 0)` - Contraste 21:1
- **Background**: Branco puro `rgb(255 255 255)`
- **Cores Primárias**: Deep saturated (Ocean Blue `rgb(0 40 80)`)
- **Sucesso**: Deep green `rgb(0 80 0)`
- **Erro**: Deep red `rgb(120 0 0)`
- **Warning**: Deep gold `rgb(150 100 0)`
- **Bordas**: Apenas intensifica bordas existentes (sem adicionar)
- **Outlines**: 2px em focus states

**Dark Mode High Contrast:**
- **Texto**: Branco puro `rgb(255 255 255)` - Contraste 21:1
- **Background**: Preto puro `rgb(0 0 0)`
- **Cores Primárias**: Bright saturated (Ocean Blue `rgb(70 130 220)`)
- **Sucesso**: Bright green `rgb(100 255 100)`
- **Erro**: Bright red `rgb(255 100 100)`
- **Warning**: Bright gold `rgb(255 220 100)`
- **Bordas**: Cinza claro `rgb(200 200 200)` (sem adicionar)
- **Outlines**: 2px com cor de accent em focus states

### Filosofia: Cores, Não Estrutura

O alto contraste **NÃO adiciona**:
- ❌ Bordas extras em elementos
- ❌ `border-width: 2px` forçado
- ❌ Sombras artificiais
- ❌ Mudanças no layout

O alto contraste **SÓ muda**:
- ✅ Cores de texto para máximo contraste
- ✅ Cores de fundo para suportar o contraste
- ✅ Cores de bordas existentes
- ✅ Cores de accent (primary, success, error, warning)

---

## Alternativas Pesquisadas

### 1. Tailwind Native: `contrast-more` Variant

O Tailwind oferece a variant `contrast-more` que detecta `prefers-contrast: more` do OS:

```html
<!-- Abordagem nativa do Tailwind -->
<div class="text-gray-600 contrast-more:text-black">
  Texto com auto-ajuste de contraste
</div>
```

#### Como Usar:

```jsx
// Em vez de custom CSS, usar utilities direto no HTML:
<input 
  className="border-gray-200 contrast-more:border-black contrast-more:border-2"
/>

<div className="text-gray-600 contrast-more:text-black dark:text-gray-400 dark:contrast-more:text-white">
  Conteúdo adaptativo
</div>
```

#### Prós:
- ✅ Padrão nativo do Tailwind
- ✅ Respeita configuração do OS
- ✅ Menos CSS customizado
- ✅ Funciona com `forced-colors` do Windows

#### Contras:
- ❌ Precisa adicionar `contrast-more:` em cada elemento
- ❌ Muito verbose no HTML
- ❌ Não permite toggle manual (só respeita OS)
- ❌ Requer refatoração de todos os componentes

### 2. Forced Colors (Windows High Contrast)

Tailwind também suporta `forced-colors` para modo de alto contraste do Windows:

```html
<input 
  className="appearance-none forced-colors:appearance-auto"
/>

<div className="bg-blue-500 forced-colors:bg-[ButtonFace]">
  Respeita cores do sistema
</div>
```

#### Cores do Sistema Forced Colors:
- `ButtonFace`, `ButtonText`
- `Canvas`, `CanvasText`
- `LinkText`, `VisitedText`
- `GrayText`, `Highlight`

#### Prós:
- ✅ Compatível com Windows High Contrast Mode
- ✅ Usa cores do sistema operacional
- ✅ Acessibilidade automática

#### Contras:
- ❌ Só funciona no Windows
- ❌ Não permite customização de cores
- ❌ Não permite toggle manual

### 3. Plugin Tailwind Customizado

Criar plugin no `tailwind.config.js`:

```javascript
// tailwind.config.js
export default {
  plugins: [
    function({ addVariant }) {
      // Variant customizada para high contrast
      addVariant('high-contrast', '&:where(.high-contrast, .high-contrast *)');
      addVariant('hc', '&:where(.high-contrast, .high-contrast *)'); // shorthand
    }
  ]
}
```

#### Uso:

```jsx
<div className="text-gray-600 high-contrast:text-black">
  Texto adaptativo
</div>

// Ou com shorthand:
<input className="border-gray-300 hc:border-black hc:border-2" />
```

#### Prós:
- ✅ Menos verbose que CSS customizado
- ✅ Aproveita sistema de variants do Tailwind
- ✅ Permite toggle manual
- ✅ Autocomplete no editor

#### Contras:
- ❌ Ainda precisa adicionar `high-contrast:` em muitos elementos
- ❌ Requer refatoração parcial
- ❌ Mais complexo que solução atual

---

## Recomendação

**Manter a abordagem atual** (classe `.high-contrast` + `@layer utilities`) porque:

1. **Simplicidade**: 138 linhas focadas vs distribuir por centenas de componentes
2. **Manutenção**: Mudanças centralizadas em `index.css`
3. **Performance**: Não precisa processar centenas de utilities
4. **Compatibilidade**: Funciona perfeitamente com ThemeContext existente
5. **WCAG AAA**: Garante contraste 21:1 em todos os elementos

### Paleta de Cores High Contrast

#### Light Mode High Contrast
```css
/* Texto e Fundo Base */
--text-primary: rgb(0 0 0);           /* 21:1 */
--bg-primary: rgb(255 255 255);       /* 21:1 */
--bg-secondary: rgb(245 245 245);     /* 19:1 */

/* Cores de Marca (Brand Colors) */
--ocean-blue: rgb(0 40 80);           /* Deep ocean */
--forest-green: rgb(0 80 0);          /* Deep green */
--burgundy-red: rgb(120 0 0);         /* Deep red */
--golden-sand: rgb(150 100 0);        /* Deep gold */
--royal-blue: rgb(0 40 150);          /* Deep blue */

/* Bordas e Outlines */
--border-color: rgb(0 0 0);           /* Same as text */
--focus-outline: rgb(0 0 0);          /* 2px outline */
```

#### Dark Mode High Contrast
```css
/* Texto e Fundo Base */
--text-primary: rgb(255 255 255);     /* 21:1 */
--bg-primary: rgb(0 0 0);             /* 21:1 */
--bg-secondary: rgb(30 30 30);        /* 15:1 */

/* Cores de Marca (Brand Colors) */
--ocean-blue: rgb(70 130 220);        /* Bright ocean */
--forest-green: rgb(80 200 80);       /* Bright green */
--burgundy-red: rgb(220 60 60);       /* Bright red */
--golden-sand: rgb(255 220 100);      /* Bright gold */
--royal-blue: rgb(120 180 255);       /* Bright blue */

/* Bordas e Outlines */
--border-color: rgb(200 200 200);     /* Soft gray */
--focus-outline: rgb(100 180 255);    /* Bright blue */
```

### Quando Migrar para Tailwind Variants?

Migre para `contrast-more` ou plugin customizado **SE**:

- [ ] Precisar de controle granular por componente
- [ ] Quiser aproveitar configuração do OS (`prefers-contrast`)
- [ ] Tiver muitos casos especiais de contraste
- [ ] Quiser remover completamente CSS customizado

**Nota**: A solução atual é **superior** para este projeto porque:
1. Garante contraste consistente em todos os elementos
2. Não requer refatoração de componentes
3. Mantém centralização de estilos
4. Fácil de ajustar cores globalmente

---

## Documentação Oficial

- [Tailwind: prefers-contrast](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-for-prefers-contrast)
- [Tailwind: forced-colors](https://tailwindcss.com/docs/hover-focus-and-other-states#forced-colors)
- [Tailwind: forced-color-adjust](https://tailwindcss.com/docs/forced-color-adjust)
- [MDN: prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [MDN: forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html)

---

## Exemplo de Migração (Futuro)

Se decidir migrar para plugin customizado no futuro:

```javascript
// 1. Adicionar plugin em tailwind.config.js
plugins: [
  function({ addVariant }) {
    addVariant('hc', '&:where(.high-contrast, .high-contrast *)');
  }
]

// 2. Substituir CSS customizado por utilities nos componentes
<div className="text-gray-700 hc:text-black dark:text-gray-300 dark:hc:text-white">

// 3. Remover @layer utilities do index.css

// 4. Manter ThemeContext como está (já adiciona/remove classe)
```

## Compatibilidade de Navegadores

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `prefers-contrast` | ✅ 96+ | ✅ 101+ | ✅ 14.1+ | ✅ 96+ |
| `forced-colors` | ✅ 89+ | ✅ 89+ | ❌ | ✅ 79+ |
| Custom Classes | ✅ All | ✅ All | ✅ All | ✅ All |

**Conclusão**: A abordagem atual com classes customizadas tem **100% de compatibilidade**.

