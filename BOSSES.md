# 🦾 Sistema de Bosses - Entre no Balabirinto

## 📋 Visão Geral

O sistema de bosses permite que inimigos especiais e poderosos apareçam a cada 3 waves (`BOSS_SPAWN_WAVE`). Cada boss possui:

- **4 Tipos únicos** com habilidades especiais diferentes
- **Sistema de fases** para progressão de dificuldade
- **Ataques especiais** dinâmicos baseados no tipo
- **Higher rewards** para derrotar bosses
- **Renderização visual** diferenciada com aura pulsante

---

## 🎯 Tipos de Boss

### 1. **Titã** (Titan)
- **Cor**: Vermelho `#FF4444`
- **Vida**: 100 HP
- **Dano**: 20
- **Ataque Especial**: **Shockwave** - Dispara balas em círculo ao redor dele (8 projéteis)
- **Score**: 500 pontos por boss derrotado
- **Resistência**: Alta (80%)

```typescript
titan: {
  name: "Titã",
  color: "#FF4444",
  health: 100,
  damage: 20,
  knockbackResistance: 0.8,
  maxPhase: 2,
  scoreReward: 500,
  specialAttack: "shockwave"
}
```

### 2. **Vórtice** (Vortex)
- **Cor**: Azul Ciano `#00CCFF`
- **Vida**: 80 HP
- **Dano**: 18
- **Ataque Especial**: **Spiral** - Dispara balas em padrão espiral rotativo (12 projéteis)
- **Score**: 450 pontos por boss derrotado
- **Resistência**: Alta (70%)

```typescript
vortex: {
  name: "Vórtice",
  color: "#00CCFF",
  health: 80,
  damage: 18,
  knockbackResistance: 0.7,
  maxPhase: 2,
  scoreReward: 450,
  specialAttack: "spiral"
}
```

### 3. **Inferno** (Inferno)
- **Cor**: Laranja `#FF6B00`
- **Vida**: 70 HP
- **Dano**: 25 (MAIOR DANO!)
- **Ataque Especial**: **Fireball** - Dispara 3 bolas de fogo grandes em leque
- **Score**: 400 pontos por boss derrotado
- **Resistência**: Média (60%)

```typescript
inferno: {
  name: "Inferno",
  color: "#FF6B00",
  health: 70,
  damage: 25,
  knockbackResistance: 0.6,
  maxPhase: 3,
  scoreReward: 400,
  specialAttack: "fireball"
}
```

### 4. **Sombra** (Shadow)
- **Cor**: Roxo `#AA00FF`
- **Vida**: 90 HP
- **Dano**: 22
- **Ataque Especial**: **Teleport** - Se teleporta para 3 locais diferentes e dispara de cada um
- **Score**: 480 pontos por boss derrotado
- **Resistência**: Alta (75%)

```typescript
shadow: {
  name: "Sombra",
  color: "#AA00FF",
  health: 90,
  damage: 22,
  knockbackResistance: 0.75,
  maxPhase: 2,
  scoreReward: 480,
  specialAttack: "teleport"
}
```

---

## 🎮 Mecânicas de Boss

### Spawn de Boss

- Bosses aparecem automaticamente a cada **3 waves** (Wave 3, 6, 9, etc.)
- Apenas **UM boss** por wave
- Aparece no **centro do topo** da tela
- A wave só avança após o boss ser derrotado

### Movimento

- Boss se move em direção ao jogador a **70% da velocidade normal**
- Velocidade reduzida para permitir gameplay mais justo

### Ataques Especiais

- Boss ataca a cada **4 segundos** (`BOSS_SPECIAL_COOLDOWN`)
- Cada tipo de ataque tem um padrão único
- Ataques são **automáticos** e não requerem interação

### Colisões

- **Balas do jogador**: Causam 10 dano por tiro ao boss
- **Contato direto**: Boss causa dano contínuo ao jogador (respeitando cooldown)
- **Boss vs Inimigos**: Não interagem entre si

### Recompensa

Ao derrotar um boss:
- **Score Major**: `bossConfig.scoreReward × wave`
- **Garantia de 2 armas**: Sempre dropam 2 power-ups
- **Partículas**: Explosão visual grande com 50+ partículas

---

## 🔧 Configurações

### Constantes em `game/constants.ts`

```typescript
export const BOSS_SPAWN_WAVE = 3;              // Boss a cada 3 waves
export const BOSS_WIDTH = 60;                   // Tamanho do boss
export const BOSS_HEIGHT = 60;
export const BOSS_SPEED = 100;                  // Velocidade base
export const BOSS_CHARGE_TIME = 2;              // Tempo de preparação
export const BOSS_SPECIAL_COOLDOWN = 4;         // Cooldown entre ataques

export const BOSS_CONFIGS = {                   // Configuração de cada tipo
  // ... tipos definidos acima
}
```

---

## 📊 Renderização Visual

### Elementos Visuais

1. **Aura Pulsante**: Efeito de brilho animado ao redor do boss
2. **Borda Brilhante**: Linha grossa na cor do boss
3. **Corpo Gradiente**: Preenchimento com gradiente da cor do boss
4. **Nome**: Exibido acima do boss com cor correspondente
5. **Barra de Saúde**: Grande barra acima do boss
   - Verde: > 50% vida
   - Amarelo: 25-50% vida
   - Vermelho: < 25% vida
6. **HP Numérico**: `Atual/Máximo` na barra de saúde

### CSS/Canvas

A renderização é feita integralmente em **Canvas 2D**:
- Sem sprites (renderização procedural)
- Efeitos animados em tempo real
- Otimizado para performance

---

## 🧪 Como Testar Bosses

### Teste Rápido (Cheat)

1. Abra o console do navegador (`F12`)
2. No arquivo `GameEngine.ts`, localize `BOSS_SPAWN_WAVE = 3`
3. Mude para `BOSS_SPAWN_WAVE = 1` para boss aparecer toda wave
4. Rebuild: `npm run build` ou `npm run dev`

### Teste Normal

1. Inicie o jogo com `npm run dev`
2. Clique em **"▶ JOGAR"**
3. Mate todos os inimigos da **Wave 1 e 2**
4. **Wave 3**: Boss debe aparecer automaticamente
5. O boss será selecionado **aleatoriamente** entre os 4 tipos

### Teste Completo

- **Wave 3**: Primeiro boss aparece
- **Wave 6**: Segundo boss aparece
- **Wave 9**: Terceiro boss aparece
- Continuar conforme quiser

---

## 📈 Progressão de Dificuldade

```
Wave 1-2:   Inimigos normais (baixa dificuldade)
Wave 3:     Primeiro Boss + Inimigos
Wave 4-5:   Inimigos (dificuldade aumentada)
Wave 6:     Segundo Boss + Inimigos
Wave 7-8:   Inimigos (dificuldade aumentada)
Wave 9:     Terceiro Boss + Inimigos
...
```

**Score Multiplier**: Aumenta conforme progride
- `baseScore × wave²` para inimigos normais
- `bossScore × wave` para bosses

---

## 🚀 Otimizações e Boas Práticas

### Performance

- Bosses reutilizam o mesmo sistema de colisão que inimigos
- Renderização em Canvas otimizada
- IDs únicos para cada boss (`boss-0`, `boss-1`, etc.)

### Código

- Tipos TypeScript completos
- Padrão Singleton para `GameEngine`
- Métodos privados: `spawnBoss()` e `bossBossSpecialAttack()`
- Configurações hardcoded em `constants.ts`

### Escalabilidade

Fácil adicionar novos tipos de boss:
1. Adicione novo tipo em `game/types.ts` (BossType)
2. Adicione configuração em `game/constants.ts` (BOSS_CONFIGS[newType])
3. Implemente lógica de ataque em `bossBossSpecialAttack()` switch
4. Adicione renderização em `GameCanvas.tsx`

---

## 🔮 Features Futuras

- [ ] Boss inteligência artificial (padrões de movimento avançados)
- [ ] Sistema de fases (mudança de comportamento ao perder vida)
- [ ] Boss customizados por wave
- [ ] Ataque especial mais complexos (redes, padrões matemáticos)
- [ ] Checkpoint/Save system
- [ ] Multiplayer co-op contra bosses

---

## 🛠️ Debugging

### Verificar Boss no Console

```javascript
// No console do navegador
const engine = window.gameEngine;
const state = engine.getGameState();
console.log(state.bosses);  // Ver lista de bosses
```

### Verificar Spawn Manual

```typescript
// No GameEngine.ts, adicione após a linha 440
if (this.gameState.wave === 3 && this.gameState.enemies.length === 0) {
  console.log("Boss deveria spawnar agora");
}
```

---

## 📝 Arquivo de Tipos

Localização: [src/game/types.ts](../game/types.ts)

```typescript
export type BossType = "titan" | "vortex" | "inferno" | "shadow";

export interface Boss extends Enemy {
  type: BossType;
  phase: number;
  maxPhase: number;
  chargeTime: number;
  maxChargeTime: number;
  specialAttackCooldown: number;
  maxSpecialAttackCooldown: number;
  isBoss: true;
}
```

---

## 📈 Estatísticas

| Métrica | Valor |
|---------|-------|
| Tipos de Boss | 4 |
| HP Mínimo | 70 (Inferno) |
| HP Máximo | 100 (Titã) |
| Dano Mínimo | 18 (Vórtice) |
| Dano Máximo | 25 (Inferno) |
| Cooldown de Ataque | 4 segundos |
| Score Mínimo | 400 pontos |
| Score Máximo | 500 pontos |
| Chance de Arma | 100% (2 garante) |

---

**Desenvolvido com ❤️ para Entre no Balabirinto**
