# Estrutura de Pastas - Gungeon Game

## 📁 Organização do Projeto

```
gungeon-game/
│
├── 📂 public/                 # Arquivos públicos
│   └── (favicon, manifest, etc)
│
├── 📂 src/                    # Código fonte
│   │
│   ├── 📂 assets/             # Recursos do jogo
│   │   ├── 📂 images/         # Sprites, texturas
│   │   ├── 📂 audio/          # Músicas, SFX
│   │   └── 📂 fonts/          # Fontes (futuro)
│   │
│   ├── 📂 core/               # Engine e sistemas principais
│   │   ├── GameEngine.ts      # Lógica principal do jogo
│   │   ├── SpriteManager.ts   # Gerenciamento de sprites
│   │   ├── AudioGenerator.ts  # Geração de áudio
│   │   └── index.ts           # Export central
│   │
│   ├── 📂 game/               # Configurações e tipos do jogo
│   │   ├── constants.ts       # Constantes do jogo
│   │   ├── types.ts           # Tipos TypeScript
│   │   └── 📂 utils/
│   │       ├── math.ts        # Funções matemáticas
│   │       └── index.ts       # Export central
│   │
│   ├── 📂 hooks/              # React hooks customizados
│   │   ├── useGameLoop.ts     # Loop principal do jogo
│   │   ├── useAudio.ts        # Gerenciamento de áudio
│   │   ├── useMouse.ts        # Input do mouse
│   │   ├── usePlayerMovement.ts # Input do teclado
│   │   └── index.ts           # Export central
│   │
│   ├── 📂 ui/                 # Componentes React/UI
│   │   ├── 📂 components/
│   │   │   ├── GameCanvas.tsx # Canvas principal
│   │   │   ├── HUD.tsx        # Interface do jogador
│   │   │   └── GameOver.tsx   # Tela de game over
│   │   └── index.ts           # Export central
│   │
│   ├── 📂 styles/             # Estilos globais
│   │   └── App.css
│   │
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Entrada da aplicação
│
├── 📂 node_modules/           # Dependências
│
├── .gitignore                 # Git ignore
├── Makefile                   # Comandos úteis
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
└── README.md                  # Documentação
```

## 🎯 Princípios de Organização

### **Separação de Responsabilidades**
- **core/** - Lógica do jogo, independente de React
- **game/** - Dados e configurações
- **hooks/** - Integração React com a engine
- **ui/** - Componentes visuais React
- **assets/** - Recursos estáticos

### **Escalabilidade**
- Fácil adicionar novos inimigos, powerups, etc
- Sistema de plugins pronto para futuras features
- Separação entre lógica e apresentação

### **Manutenibilidade**
- Cada pasta tem responsabilidade clara
- Index files para imports limpos
- Estrutura pronta para testes

## 📦 Como Usar a Nova Estrutura

### Importações Antigas vs Novas

**Antes:**
```typescript
import { GameEngine } from '../utils/GameEngine';
import { constants } from '../utils/constants';
```

**Depois:**
```typescript
import { GameEngine } from '@/core';
import { constants } from '@/game';
```

(Com path aliases configuradas em tsconfig.json)

## 🚀 Próximos Passos

1. ✅ Estrutura criada
2. ⏳ Mover arquivos para novos locais
3. ⏳ Atualizar imports nos arquivos
4. ⏳ Configurar path aliases (opcional)
5. ⏳ Atualizar documentação
