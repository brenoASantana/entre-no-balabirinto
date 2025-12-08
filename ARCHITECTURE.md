## 📋 Guia de Organização - Gungeon Game

Este documento explica como o projeto está organizado e como adicionar novas features.

## 📂 Estrutura de Pastas

```
src/
├── 📂 assets/              🎨 Recursos do jogo (sprites, áudio)
│   ├── images/            → Sprites, texturas do jogador/inimigos
│   └── audio/             → Arquivos de áudio (futuro)
│
├── 📂 core/                ⚙️ Engine e sistemas principais
│   ├── GameEngine.ts      → Lógica principal (movimento, colisão, etc)
│   ├── SpriteManager.ts   → Gerenciamento de sprites/imagens
│   ├── AudioGenerator.ts  → Geração de áudio com Web Audio API
│   └── index.ts           → Exports centralizados
│
├── 📂 game/                🎮 Configuração e tipos do jogo
│   ├── constants.ts       → Valores constantes (largura, velocidade, etc)
│   ├── types.ts           → Interfaces TypeScript (Player, Enemy, etc)
│   ├── 📂 utils/
│   │   ├── math.ts        → Funções matemáticas (clamp, normalize, etc)
│   │   └── index.ts       → Exports
│   └── index.ts           → Exports centralizados
│
├── 📂 hooks/               🪝 React hooks customizados
│   ├── useGameLoop.ts     → Loop principal com requestAnimationFrame
│   ├── useAudio.ts        → Gerenciamento de áudio e música
│   ├── useMouse.ts        → Input do mouse (posição, clique)
│   ├── usePlayerMovement.ts → Input do teclado (WASD)
│   └── index.ts           → Exports centralizados
│
├── 📂 ui/                  🖼️ Componentes React/Interface
│   ├── 📂 components/
│   │   ├── GameCanvas.tsx → Canvas principal (renderização)
│   │   ├── Player.tsx     → Componente do jogador (placeholder)
│   │   └── Crosshair.tsx  → Mira (placeholder)
│   └── index.ts           → Exports centralizados
│
├── 📂 styles/             🎨 Estilos CSS
│   └── App.css
│
├── App.tsx                 App principal
├── main.tsx                Entrada da aplicação
└── types/                  (Pasta legada - considerar remover)
```

## 🎯 Fluxo de Dados

```
User Input (Keyboard/Mouse)
  ↓
hooks/ (usePlayerMovement, useMouse)
  ↓
core/GameEngine (update lógica)
  ↓
game/types (estado)
  ↓
ui/GameCanvas (renderização)
  ↓
Screen 🖥️
```

## 🚀 Como Adicionar Novas Features

### ✨ Novo Tipo de Inimigo

1. **Adicione ao tipo** → `game/types.ts`
2. **Constantes** → `game/constants.ts`
3. **Lógica** → `core/GameEngine.ts` (método `update()`)
4. **Sprite** → `src/assets/images/` + atualizar `SpriteManager.ts`

### 🔊 Novo Som/Efeito

1. **Adicione ao áudio** → `core/AudioGenerator.ts`
2. **Chame do hook** → `hooks/useAudio.ts`
3. **Integre** → `ui/components/GameCanvas.tsx`

### 🎨 Novo Componente UI

1. **Crie** → `ui/components/MeuComponente.tsx`
2. **Exporte** → `ui/index.ts`
3. **Importe** → Onde precisar usar

## 📌 Regras de Ouro

✅ **DO:**
- Manter `GameEngine` independente de React
- Usar `useRef` para manter referências da engine
- Separar lógica (core/) de apresentação (ui/)
- Centralizar imports em index.ts

❌ **DON'T:**
- Usar `useState` para estado do jogo (usar GameEngine ao invés)
- Importar de caminhos relativos longos (usar index.ts)
- Misturar lógica de jogo com renderização

## 📚 Exemplos de Importação

```typescript
// ✅ Certo - usar index.ts
import { GameEngine, SpriteManager } from "../../core";
import { PLAYER_SPEED, Vector2 } from "../../game";
import { useGameLoop, useAudio } from "../../hooks";

// ❌ Errado - caminho direto
import { GameEngine } from "../../core/GameEngine";
import { PLAYER_SPEED } from "../../game/constants";
```

## 🔄 Próximas Refatorações (Opcional)

- [ ] Path aliases (`@core`, `@game`, etc)
- [ ] Estrutura de testes
- [ ] Sistema de plugins
- [ ] Pasta `services/` para lógica compartilhada
- [ ] Pasta `config/` para configurações do jogo

---

**Última atualização:** 7 de dezembro de 2025
