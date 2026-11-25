const SOUND_URLS = {
  click: "/assets/sounds/click.ogg",
  winCounter: "/assets/sounds/winCounter.ogg",
  win: "/assets/sounds/win.ogg",
} as const;

type SoundKey = keyof typeof SOUND_URLS;

class SoundManager {
  private context: AudioContext | null = null;
  private readonly buffers = new Map<SoundKey, AudioBuffer>();
  private preloadPromise: Promise<void> | null = null;
  private masterGain: GainNode | null = null;
  private loopingSource: AudioBufferSourceNode | null = null;
  private volume = 10;
  private isUnlocked = false;

  private getContext(): AudioContext {
    if (this.context) return this.context;

    const audioWindow = window as Window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioContextConstructor =
      window.AudioContext ?? audioWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      throw new Error("Web Audio is not supported by this browser.");
    }

    this.context = new AudioContextConstructor();
    return this.context;
  }

  unlock(): void {
    try {
      const context = this.getContext();
      if (context.state === "suspended") {
        void context.resume().catch((error: unknown) => {
          console.error("Unable to resume the audio context.", error);
        });
      }

      if (this.isUnlocked) return;

      const silentBuffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(context.destination);
      source.start();
      this.isUnlocked = true;
    } catch (error) {
      console.error("Unable to unlock audio playback.", error);
    }
  }

  preload(): Promise<void> {
    const soundKeys = Object.keys(SOUND_URLS) as SoundKey[];
    if (soundKeys.every((key) => this.buffers.has(key))) {
      return Promise.resolve();
    }
    if (this.preloadPromise) return this.preloadPromise;

    this.preloadPromise = Promise.all(
      soundKeys.map(async (key) => {
        try {
          const context = this.getContext();
          const response = await fetch(SOUND_URLS[key]);
          if (!response.ok) {
            throw new Error(
              `Request failed with status ${response.status} ${response.statusText}`,
            );
          }
          this.buffers.set(
            key,
            await context.decodeAudioData(await response.arrayBuffer()),
          );
        } catch (error) {
          console.error(`Failed to preload sound "${key}".`, error);
        }
      }),
    )
      .then(() => undefined)
      .finally(() => {
        this.preloadPromise = null;
      });

    return this.preloadPromise;
  }

  setVolume(volume: number): void {
    this.volume = Math.min(10, Math.max(0, Math.round(volume)));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume / 10;
    }
  }

  play(key: SoundKey): void {
    try {
      const buffer = this.buffers.get(key);
      if (!buffer) {
        console.warn(`Sound "${key}" is not preloaded yet.`);
        return;
      }

      const context = this.getContext();
      if (context.state === "suspended" || !this.isUnlocked) {
        console.warn(`Sound "${key}" cannot play before audio is unlocked.`);
        return;
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.getMasterGain(context));
      source.start();
    } catch (error) {
      console.error(`Unable to play sound "${key}".`, error);
    }
  }

  playLoop(): void {
    try {
      const buffer = this.buffers.get("winCounter");
      if (!buffer) {
        console.warn('Sound "winCounter" is not preloaded yet.');
        return;
      }

      const context = this.getContext();
      if (context.state === "suspended" || !this.isUnlocked) {
        console.warn('Sound "winCounter" cannot play before audio is unlocked.');
        return;
      }

      this.stopLoop();
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(this.getMasterGain(context));
      source.start();
      this.loopingSource = source;
    } catch (error) {
      console.error('Unable to loop sound "winCounter".', error);
    }
  }

  stopLoop(): void {
    if (!this.loopingSource) return;

    this.loopingSource.stop();
    this.loopingSource.disconnect();
    this.loopingSource = null;
  }

  private getMasterGain(context: AudioContext): GainNode {
    if (this.masterGain) return this.masterGain;

    this.masterGain = context.createGain();
    this.masterGain.gain.value = this.volume / 10;
    this.masterGain.connect(context.destination);
    return this.masterGain;
  }
}

export const soundManager = new SoundManager();
