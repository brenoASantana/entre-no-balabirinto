# Gungeon Game

Este é um projeto de jogo estilo "Enter the Gungeon" desenvolvido com React, TypeScript e Vite. O jogo apresenta uma mecânica de movimentação do jogador e um indicador de mira que rotaciona em direção ao mouse.

## Estrutura do Projeto

A estrutura do projeto é a seguinte:

```
gungeon-game
├── src
│   ├── main.tsx          # Ponto de entrada da aplicação
│   ├── App.tsx           # Componente principal da aplicação
│   ├── components         # Componentes do jogo
│   │   ├── GameCanvas.tsx # Componente do canvas do jogo
│   │   ├── Player.tsx     # Componente do jogador
│   │   └── Crosshair.tsx  # Componente do indicador de mira
│   ├── hooks              # Hooks personalizados
│   │   ├── usePlayerMovement.ts # Hook para movimentação do jogador
│   │   ├── useMouse.ts    # Hook para captura da posição do mouse
│   │   └── useGameLoop.ts # Hook para o loop do jogo
│   ├── types              # Tipos e interfaces do jogo
│   │   ├── game.ts        # Definições de tipos relacionadas ao jogo
│   │   └── index.ts       # Exportação de tipos
│   ├── utils              # Funções utilitárias
│   │   ├── math.ts        # Funções matemáticas
│   │   └── constants.ts    # Constantes do jogo
│   └── styles             # Estilos CSS
│       └── App.css        # Estilos da aplicação
├── index.html             # Template HTML da aplicação
├── package.json           # Configuração do npm
├── tsconfig.json          # Configuração do TypeScript
├── vite.config.ts         # Configuração do Vite
└── README.md              # Documentação do projeto
```

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```
npm install
```

## Execução

Para iniciar o servidor de desenvolvimento, utilize o comando:

```
npm run dev
```

O jogo estará disponível em `http://localhost:3000`.

## Controles

- **W**: Mover para cima
- **A**: Mover para a esquerda
- **S**: Mover para baixo
- **D**: Mover para a direita
- **Mouse**: O indicador de mira rotaciona em direção à posição do mouse.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Para isso, faça um fork do repositório e envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.