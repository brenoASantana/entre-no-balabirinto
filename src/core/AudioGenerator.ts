/**
 * Gerador de música procedural para o jogo
 * Cria uma batida agitada usando Web Audio API
 * Sem dependências externas - tudo é síntese de áudio
 */

export class AudioGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  /**
   * Inicializa o contexto de áudio
   */
  private initAudioContext(): void {
    if (!this.audioContext) {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.audioContext = audioContext;

      // Master volume
      this.masterGain = audioContext.createGain();
      this.masterGain.gain.value = 0.3; // 30% volume
      this.masterGain.connect(audioContext.destination);
    }
  }

  /**
   * Para todo áudio em reprodução
   */
  private stopAllOscillators(): void {
    for (const osc of this.oscillators) {
      try {
        osc.stop();
      } catch (e) {
        // Oscilador já foi parado
      }
    }
    this.oscillators = [];
    this.gainNodes = [];
  }

  /**
   * Toca uma nota musical
   */
  private playNote(
    frequency: number,
    duration: number,
    startTime: number
  ): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.frequency.value = frequency;
    osc.type = "square"; // Som retangular para efeito chippy/8-bit

    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);
    gain.gain.setValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);

    this.oscillators.push(osc);
    this.gainNodes.push(gain);
  }

  /**
   * Toca acordes (múltiplas notas simultaneamente)
   */
  private playChord(
    frequencies: number[],
    duration: number,
    startTime: number
  ): void {
    for (const freq of frequencies) {
      this.playNote(freq, duration, startTime);
    }
  }

  /**
   * Inicia a música de fundo em loop
   */
  play(): void {
    this.initAudioContext();

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Notas em Hz (frequências)
    const C4 = 262;
    const D4 = 294;
    const E4 = 330;
    const F4 = 349;
    const G4 = 392;
    const A4 = 440;
    const B4 = 494;
    const C5 = 523;

    // Loop a música a cada 4 segundos
    const loopDuration = 4;
    const startTime = this.audioContext!.currentTime;

    const playLoop = (loopCount: number) => {
      const loopStartTime = startTime + loopCount * loopDuration;

      if (!this.isPlaying) return;

      // Padrão rítmico agitado (kick+snare pattern)
      const beatDuration = 0.25; // 16th notes em 4/4

      // Batida base (baixa frequência) - kick drum
      this.playNote(60, 0.1, loopStartTime); // Sub bass
      this.playNote(120, 0.15, loopStartTime + beatDuration * 2);
      this.playNote(60, 0.1, loopStartTime + beatDuration * 4);
      this.playNote(120, 0.15, loopStartTime + beatDuration * 6);
      this.playNote(60, 0.1, loopStartTime + beatDuration * 8);
      this.playNote(90, 0.12, loopStartTime + beatDuration * 10);

      // Melodia agitada principal
      this.playNote(E4, beatDuration * 1.5, loopStartTime);
      this.playNote(G4, beatDuration, loopStartTime + beatDuration * 1.5);
      this.playNote(B4, beatDuration * 1.5, loopStartTime + beatDuration * 2.5);
      this.playNote(A4, beatDuration, loopStartTime + beatDuration * 4);
      this.playNote(G4, beatDuration * 1.5, loopStartTime + beatDuration * 5);
      this.playNote(E4, beatDuration, loopStartTime + beatDuration * 6.5);
      this.playNote(F4, beatDuration * 1.5, loopStartTime + beatDuration * 7.5);
      this.playNote(D4, beatDuration, loopStartTime + beatDuration * 9);

      // Counter-melody harmônica
      this.playNote(C4, beatDuration * 2, loopStartTime + beatDuration * 1);
      this.playNote(E4, beatDuration * 2, loopStartTime + beatDuration * 3);
      this.playNote(G4, beatDuration * 2, loopStartTime + beatDuration * 5);
      this.playNote(F4, beatDuration * 2, loopStartTime + beatDuration * 7);

      // Próximo loop
      if (this.isPlaying) {
        setTimeout(() => playLoop(loopCount + 1), loopDuration * 1000 - 100);
      }
    };

    playLoop(0);
  }

  /**
   * Para a música
   */
  stop(): void {
    this.isPlaying = false;
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
    gain.gain.exponentialRampToValueAtTime(0, now + duration);

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
      gain.gain.exponentialRampToValueAtTime(0, now + delay + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    }
  }

  /**
   * Define o volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
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
