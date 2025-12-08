# Entre no Balabirinto

Este é um projeto de jogo estilo "Enter the Gungeon" desenvolvido com **React**, **TypeScript** e **Vite**. O jogo apresenta uma mecânica de movimentação do jogador, renderização com Canvas 2D e um indicador de mira que rotaciona em direção ao mouse.

## 🎮 Características

- ✨ Renderização com Canvas 2D API
- 🎯 Sistema de mira inteligente seguindo o mouse
- ⌨️ Sistema de movimentação com teclado (WASD)
- 🎨 Interface responsiva
- 📱 Suporte a diferentes resoluções
- 🔧 Configuração com Biome para linting e formatação

## 📦 Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **Biome** - Linter e formatter
- **CSS3** - Estilização

## 📁 Estrutura do Projeto

```
entre-no-balabirinto
├── src
│   ├── main.tsx                    # Ponto de entrada da aplicação
│   ├── App.tsx                     # Componente principal
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
│   ├── ui/                         # Componentes de UI
│   ├── utils/                      # Utilitários
│   ├── assets/                     # Imagens e áudio
│   └── styles/                     # Estilos CSS
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
| **Mouse** | Rotaciona a mira na direção do cursor |

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