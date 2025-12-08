/**
 * Gerador de áudio para o jogo
 * Carrega música de fundo do arquivo MP3 e cria efeitos sonoros com Web Audio API
 */

import backgroundMusicUrl from "../assets/audio/Unstoppable Force.mp3";

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private backgroundAudioElement: HTMLAudioElement | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  /**
   * Inicializa o contexto de áudio
   */
  private initAudioContext(): void {
    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      this.audioContext = audioContext;

      // Master volume
      this.masterGain = audioContext.createGain();
      this.masterGain.gain.value = 0.3; // 30% volume
      this.masterGain.connect(audioContext.destination);
    }
  }

  /**
   * Inicializa o elemento de áudio para a música de fundo
   */
  private initBackgroundAudio(): void {
    if (!this.backgroundAudioElement) {
      const audio = new Audio();
      audio.src = backgroundMusicUrl;
      audio.loop = true;
      audio.volume = 0.5;
      this.backgroundAudioElement = audio;
    }
  }

  /**
   * Para todo áudio em reprodução
   */
  private stopAllOscillators(): void {
    for (const osc of this.oscillators) {
      try {
        osc.stop();
      } catch {
        // Oscilador já foi parado
      }
    }
    this.oscillators = [];
    this.gainNodes = [];
  }

  /**
   * Inicia a música de fundo em loop
   */
  play(): void {
    this.initAudioContext();
    this.initBackgroundAudio();

    if (!this.backgroundAudioElement) return;

    if (this.isPlaying) {
      // Se já está tocando, apenas certifique-se de que continua tocando
      if (this.backgroundAudioElement.paused) {
        this.backgroundAudioElement.play();
      }
      return;
    }

    this.isPlaying = true;

    // Inicia a reprodução da música de fundo
    this.backgroundAudioElement.play().catch(() => {
      // O autoplay pode estar desabilitado, a música será iniciada na primeira interação
    });
  }

  /**
   * Para a música
   */
  stop(): void {
    this.isPlaying = false;
    if (this.backgroundAudioElement) {
      this.backgroundAudioElement.pause();
      this.backgroundAudioElement.currentTime = 0;
    }
    this.stopAllOscillators();
  }

  /**
   * Toca efeito sonoro de tiro
   */
  playShootSound(): void {
    this.initAudioContext();

    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const duration = 0.05;

    // Efeito de tiro - frequência descendente
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + duration);
    osc.type = "sawtooth";

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca efeito sonoro de hit/dano
   */
  playHitSound(): void {
    this.initAudioContext();

    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const duration = 0.1;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    osc.type = "square";

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca efeito sonoro de enemy death
   */
  playDeathSound(): void {
    this.initAudioContext();

    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Descida rápida de pitch
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.05;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.frequency.setValueAtTime(400 - i * 100, now + delay);
      osc.frequency.exponentialRampToValueAtTime(50, now + delay + 0.1);
      osc.type = "triangle";

      gain.gain.setValueAtTime(0.15, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    }
  }

  /**
   * Som de explosão/morte de inimigo (com boom profundo)
   */
  playEnemyDeathSound(): void {
    this.initAudioContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Boom grave (20Hz)
    const boomOsc = this.audioContext.createOscillator();
    const boomGain = this.audioContext.createGain();
    boomOsc.type = "sine";
    boomOsc.frequency.setValueAtTime(40, now);
    boomOsc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
    boomGain.gain.setValueAtTime(0.4, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    boomOsc.connect(boomGain);
    boomGain.connect(this.masterGain);

    // Som médio de explosão (crispy)
    const midOsc = this.audioContext.createOscillator();
    const midGain = this.audioContext.createGain();
    midOsc.type = "square";
    midOsc.frequency.setValueAtTime(250, now);
    midOsc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
    midGain.gain.setValueAtTime(0.3, now);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    midOsc.connect(midGain);
    midGain.connect(this.masterGain);

    boomOsc.start(now);
    boomOsc.stop(now + 0.3);
    midOsc.start(now);
    midOsc.stop(now + 0.2);
  }

  /**
   * Som de dano de contato/colisão (efeito menor)
   */
  playContactDamageSound(): void {
    this.initAudioContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Som de impacto rápido
    const impactOsc = this.audioContext.createOscillator();
    const impactGain = this.audioContext.createGain();
    impactOsc.type = "sine";
    impactOsc.frequency.setValueAtTime(150, now);
    impactOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    impactGain.gain.setValueAtTime(0.25, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    impactOsc.connect(impactGain);
    impactGain.connect(this.masterGain);

    impactOsc.start(now);
    impactOsc.stop(now + 0.1);
  }

  /**
   * Som de game over (efeito sinistro)
   */
  playGameOverSound(): void {
    this.initAudioContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Descida sinistro
    const failOsc = this.audioContext.createOscillator();
    const failGain = this.audioContext.createGain();
    failOsc.type = "sine";
    failOsc.frequency.setValueAtTime(400, now);
    failOsc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
    failGain.gain.setValueAtTime(0.3, now);
    failGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    failOsc.connect(failGain);
    failGain.connect(this.masterGain);

    failOsc.start(now);
    failOsc.stop(now + 0.5);
  }

  /**
   * Som de aviso baixo (quando vida está baixa)
   */
  playLowHealthWarning(): void {
    this.initAudioContext();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;

    // Bip repetido
    for (let i = 0; i < 2; i++) {
      const warnOsc = this.audioContext.createOscillator();
      const warnGain = this.audioContext.createGain();
      warnOsc.type = "sine";
      warnOsc.frequency.value = 800;
      warnGain.gain.setValueAtTime(0.2, now + i * 0.15);
      warnGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.1);
      warnOsc.connect(warnGain);
      warnGain.connect(this.masterGain);

      warnOsc.start(now + i * 0.15);
      warnOsc.stop(now + i * 0.15 + 0.1);
    }
  }

  /**
   * Define o volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
    if (this.backgroundAudioElement) {
      this.backgroundAudioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Obtém o volume atual
   */
  getVolume(): number {
    return this.masterGain?.gain.value ?? 0;
  }
}

// Singleton instance
let audioGeneratorInstance: AudioGenerator | null = null;

export function getAudioGenerator(): AudioGenerator {
  if (!audioGeneratorInstance) {
    audioGeneratorInstance = new AudioGenerator();
  }
  return audioGeneratorInstance;
}
