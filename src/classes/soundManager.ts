import music_loop_synth  from '../assets/sounds/loop_synth.mp3';
import music_loop_metal  from '../assets/sounds/loop_metal.mp3';
import constants from '../constants';

const audio = new AudioContext();

function loadSound(path, volume) {
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

const musicSynth = loadSound(music_loop_synth, 0.5);
const musicMetal = loadSound(music_loop_metal, 0.5);

export class SoundManager {
  private musicStarted: boolean = false;

  startMusic() {
    if(!this.musicStarted){
      this.startSound(musicSynth.source);
      this.startSound(musicMetal.source);
      this.musicStarted = true;
    }
  }

  startSound(audio){
    audio.start();
  }

  muteSound(audio){
    audio.muted= true;
  }

  unmuteSound(audio){
    audio.muted = false;
  }

  pauseSound(audio){
    audio.pause = true;
  }

  restartSound(audio) {
    audio.currentTime = 0;
  }

  resumeSound(audio){
    audio.suspend().then();
  }

  updateMusicRatio(ratio){
    let convertedRatio = (ratio+5)/10;
    musicSynth.gainNode.gain.setTargetAtTime(Math.max(0,Math.min(1,convertedRatio * constants.MUSIC_VOL)), audio.currentTime, 0.015);
    musicMetal.gainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, (1 - convertedRatio) * constants.MUSIC_VOL)), audio.currentTime, 0.015);
  }
}
