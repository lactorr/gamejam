import music_loop_synth from '../assets/sounds/miaou_Synth_boucle.mp3';
import music_loop_metal from '../assets/sounds/miaou_metal_boucle.mp3';
import sound_ronron from '../assets/sounds/ronron.mp3';
import constants from '../constants';

const audio = new AudioContext();

function loadSound(path) {
  const gainNode = audio.createGain();
  let source = audio.createBufferSource();
  let buf;
  fetch(path)
    .then(resp => resp.arrayBuffer())
    .then(buf => audio.decodeAudioData(buf))
    .then(decoded => {
      source.buffer = buf = decoded;
      source.loop = true;
      source.connect(gainNode);
      gainNode.gain.setValueAtTime(0, audio.currentTime);
      gainNode.connect(audio.destination);
    });
    return {source, gainNode};
}

const musicSynth = loadSound(music_loop_synth);
const musicMetal = loadSound(music_loop_metal);
const ronron = loadSound(sound_ronron);

class SoundManager {
  private musicStarted: boolean = false;
  private ronronStarted: boolean = false;

  startMusic() {
    if(!this.musicStarted) {
      setTimeout(() => {
        this.startSound(musicSynth.source);
        this.startSound(musicMetal.source);
      }, 100)
      this.musicStarted = true;
    }
  }

  startSound(audio) {
    audio.start();
  }

  startRonron() {
    ronron.gainNode.gain.setTargetAtTime(constants.RONRON_VOL, audio.currentTime, 0.015);
    musicSynth.gainNode.gain.setTargetAtTime(0, audio.currentTime, 1.0);
    musicMetal.gainNode.gain.setTargetAtTime(0, audio.currentTime, 1.0);
    if(!this.ronronStarted) {
      setTimeout(() => {
        this.startSound(ronron.source);
      }, 50);
      this.ronronStarted = true;
    }
  }

  stopRonron() {
    if(this.ronronStarted) {
      ronron.gainNode.gain.setTargetAtTime(0, audio.currentTime, 0.015);
    }
  }

  pauseSound(audio) {
    audio.pause = true;
  }

  updateMusicRatio(ratio) {
    let convertedRatio = (ratio+5)/10;
    ronron.gainNode.gain.setTargetAtTime(0, audio.currentTime, 0.015);
    musicSynth.gainNode.gain.setTargetAtTime(Math.max(0,Math.min(1,convertedRatio * constants.MUSIC_SYNTH_VOL)), audio.currentTime, 0.015);
    musicMetal.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, (1 - convertedRatio) * constants.MUSIC_METAL_VOL)), audio.currentTime, 0.015);
  }
}

const soundManager = new SoundManager();

export { soundManager };
