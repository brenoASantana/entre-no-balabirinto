/**
 * Gerenciador de Sprites
 * Carrega e renderiza imagens para o jogo
 */

export interface SpriteAsset {
  name: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  loaded: boolean;
}

export class SpriteManager {
  private static instance: SpriteManager;
  private sprites: Map<string, SpriteAsset> = new Map();
  private loadingPromises: Map<string, Promise<SpriteAsset>> = new Map();

  private constructor() {}

  static getInstance(): SpriteManager {
    if (!SpriteManager.instance) {
      SpriteManager.instance = new SpriteManager();
    }
    return SpriteManager.instance;
  }

  /**
   * Carrega uma sprite de forma assíncrona
   */
  async loadSprite(name: string, path: string): Promise<SpriteAsset> {
    // Se já está carregando, retorna a promise existente
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    // Se já foi carregada, retorna
    if (this.sprites.has(name)) {
      return this.sprites.get(name)!;
    }

    // Cria nova promise de carregamento
    const loadPromise = new Promise<SpriteAsset>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const asset: SpriteAsset = {
          name,
          image: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true,
        };
        this.sprites.set(name, asset);
        this.loadingPromises.delete(name);
        resolve(asset);
      };

      img.onerror = () => {
        console.error(`Failed to load sprite: ${name} from ${path}`);
        this.loadingPromises.delete(name);
        reject(new Error(`Failed to load sprite: ${name}`));
      };

      img.src = path;
    });

    this.loadingPromises.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * Carrega múltiplas sprites em paralelo
   */
  async loadSprites(
    sprites: Array<{ name: string; path: string }>
  ): Promise<SpriteAsset[]> {
    const promises = sprites.map((s) => this.loadSprite(s.name, s.path));
    return Promise.all(promises);
  }

  /**
   * Obtém uma sprite já carregada
   */
  getSprite(name: string): SpriteAsset | null {
    return this.sprites.get(name) ?? null;
  }

  /**
   * Verifica se uma sprite está carregada
   */
  isLoaded(name: string): boolean {
    const sprite = this.sprites.get(name);
    return sprite?.loaded ?? false;
  }

  /**
   * Renderiza uma sprite no canvas
   */
  drawSprite(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
    width?: number,
    height?: number,
    rotation: number = 0
  ): void {
    const sprite = this.getSprite(name);
    if (!sprite || !sprite.loaded) {
      return;
    }

    const w = width ?? sprite.width;
    const h = height ?? sprite.height;

    if (rotation !== 0) {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(rotation);
      ctx.drawImage(sprite.image, -w / 2, -h / 2, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(sprite.image, x, y, w, h);
    }
  }

  /**
   * Renderiza uma sprite com opacidade
   */
  drawSpriteWithAlpha(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    alpha: number = 1,
    rotation: number = 0
  ): void {
    const sprite = this.getSprite(name);
    if (!sprite || !sprite.loaded) {
      return;
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    if (rotation !== 0) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation);
      ctx.drawImage(sprite.image, -width / 2, -height / 2, width, height);
    } else {
      ctx.drawImage(sprite.image, x, y, width, height);
    }

    ctx.restore();
  }

  /**
   * Renderiza uma sprite como tile (repeating pattern)
   */
  drawSpriteTiled(
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    tileWidth: number,
    tileHeight: number
  ): void {
    const sprite = this.getSprite(name);
    if (!sprite || !sprite.loaded) {
      return;
    }

    for (let ty = y; ty < y + height; ty += tileHeight) {
      for (let tx = x; tx < x + width; tx += tileWidth) {
        const drawWidth = Math.min(tileWidth, x + width - tx);
        const drawHeight = Math.min(tileHeight, y + height - ty);
        ctx.drawImage(
          sprite.image,
          0,
          0,
          sprite.width,
          sprite.height,
          tx,
          ty,
          drawWidth,
          drawHeight
        );
      }
    }
  }

  /**
   * Limpa todas as sprites carregadas
   */
  clear(): void {
    this.sprites.clear();
    this.loadingPromises.clear();
  }
}
