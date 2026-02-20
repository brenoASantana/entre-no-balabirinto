# Entre no Balabirinto

Este é um projeto de jogo estilo "Enter the Gungeon" desenvolvido com **React**, **TypeScript** e **Vite**. O jogo apresenta uma mecânica de movimentação do jogador, renderização com Canvas 2D e um indicador de mira que rotaciona em direção ao mouse.

## 🎮 Características

- ✨ Renderização com Canvas 2D API
- 🎯 Sistema de mira inteligente seguindo o mouse
- ⌨️ Sistema de movimentação com teclado (WASD)
- 🎵 Trilha sonora imersiva ("Unstoppable Force")
- 🎨 Interface responsiva com Menu, Pausa e Game Over
- 📱 Suporte a diferentes resoluções
- 🔧 Configuração com Biome para linting e formatação
- 🎬 Sistema de screens (Menu → Playing → Paused → GameOver)
- 📊 HUD completo com saúde, score, wave e armas ativas

## 🆕 Atualizações Recentes

### Interface e Navegação
- **Menu Inicial**: Tela de boas-vindas com controles, objetivos e dicas
- **Sistema de Screens**: Menu → Playing → Paused → GameOver com transições suaves
- **Tela de Pausa (ESC)**: Pause o jogo para retomar ou voltar ao menu
- **Tela de Game Over**: Mostra estatísticas finais, comparação com recorde e opção de retry
- **HUD Melhorado**: Barra de saúde, contador de inimigos, tempo vivo, arma ativa com timer

### 🦾 Sistema de Bosses
- **4 Tipos Únicos** de bosses com habilidades especiais
  - **Titã**: Ataque Shockwave (círculo de balas)
  - **Vórtice**: Ataque Espiral (balas em padrão rotativo)
  - **Inferno**: Ataque Fireball (3 bolas de fogo grandes)
  - **Sombra**: Ataque Teleport (múltiplos locais de ataque)
- **Spawn Inteligente**: Boss aparece a cada 3 waves
- **Renders Visuais**: Aura pulsante, borda brilhante, barra de saúde grande
- **Recompensas Especiais**: Score multiplicado + 2 armas garantidas
- **Progressão de Dificuldade**: HP e dano aumentam com as waves

Ver documentação completa em [BOSSES.md](BOSSES.md)

## 📦 Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **Biome** - Linter e formatter
- **CSS3** - Estilização com tema cyberpunk

## 📁 Estrutura do Projeto

```
entre-no-balabirinto
├── src
│   ├── main.tsx                    # Ponto de entrada da aplicação
│   ├── App.tsx                     # Gerenciador de screens
│   ├── components/                 # Componentes React
│   ├── core/                       # Lógica central do jogo
│   │   ├── AudioGenerator.ts       # Gerador de áudio
│   │   ├── GameEngine.ts           # Engine principal do jogo
│   │   └── SpriteManager.ts        # Gerenciador de sprites
│   ├── game/                       # Configurações do jogo
│   │   ├── constants.ts            # Constantes
│   │   ├── types.ts                # Tipos do jogo
│   │   └── utils/
│   ├── hooks/                      # Hooks personalizados
│   │   ├── useGameLoop.ts          # Loop do jogo
│   │   ├── usePlayerMovement.ts    # Movimentação do jogador
│   │   ├── useMouse.ts             # Captura do mouse
│   │   └── useAudio.ts             # Sistema de áudio
│   ├── types/                      # Tipos TypeScript
│   │   ├── game.ts                 # Tipos do jogo
│   │   └── screen.ts               # Tipos de screens
│   ├── ui/                         # Componentes de UI
│   │   ├── components/
│   │   │   ├── GameCanvas.tsx      # Canvas principal
│   │   │   ├── GameHUD.tsx         # HUD durante o jogo
│   │   │   ├── Menu.tsx            # Tela de menu
│   │   │   ├── GameOver.tsx        # Tela de game over
│   │   │   ├── PauseScreen.tsx     # Tela de pausa
│   │   │   └── Scorecard.tsx       # Placar de histórico
│   │   └── index.ts
│   ├── utils/                      # Utilitários
│   ├── assets/                     # Imagens e áudio
│   ├── styles/                     # Estilos CSS
│   └── types/                      # Tipos TypeScript
├── index.html                      # Template HTML
├── biome.json                      # Configuração do Biome
├── package.json                    # Dependências do projeto
├── tsconfig.json                   # Configuração do TypeScript
├── vite.config.ts                  # Configuração do Vite
└── README.md                       # Este arquivo
```

## 🚀 Começando

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/brenoASantana/entre-no-balabirinto.git
cd entre-no-balabirinto

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

O jogo estará disponível em `http://localhost:3000` ou `http://localhost:5173` (porta padrão do Vite).

### Build para Produção

```bash
npm run build
```

A versão otimizada será gerada na pasta `dist/`.

## 🎮 Controles

| Tecla     | Ação                                  |
| --------- | ------------------------------------- |
| **W**     | Mover para cima                       |
| **A**     | Mover para a esquerda                 |
| **S**     | Mover para baixo                      |
| **D**     | Mover para a direita                  |
| **Mouse** | Rotaciona a mira e atira              |
| **ESC**   | Pausar/Retomar o jogo                 |
| **R**     | Reiniciar o jogo                      |

## 🎵 Trilha Sonora

O jogo conta com uma trilha sonora imersiva:

- **Música de Fundo**: "Unstoppable Force" - Toca continuamente durante o jogo, criando uma atmosfera épica e envolvente.

A música está localizada em `src/assets/audio/Unstoppable Force.mp3` e é carregada automaticamente quando o jogo inicia.

## 🛠️ Ferramentas de Desenvolvimento

### Linting

```bash
# Verificar problemas de linting
npm run lint

# Formatar código automaticamente
npm run format

# Executar verificação completa
npm run check
```

## 📚 Documentação

- `ARCHITECTURE.md` - Documentação da arquitetura do projeto
- `PROJECT_STRUCTURE.md` - Detalhes sobre a estrutura do projeto

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo LICENSE para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ por [Breno Santana](https://github.com/brenoASantana)**