import music_loop_synth  from '../assets/sounds/music_loop_synth.mp3';
import music_loop_metal  from '../assets/sounds/music_loop_metal.mp3';
import constants from '../constants';

function loadSound(path, volume) {
  const audio = new Audio(path);
  audio.loop = true;
  audio.volume = volume; //default
  return audio;
}

const musicSynth = loadSound(music_loop_synth, 0.5);
const musicMetal = loadSound(music_loop_metal, 0.5);

export class SoundManager {
  startMusic() {
    this.startSound(musicMetal);
    this.startSound(musicSynth);
  }

  startSound(audio){
    audio.muted = false;
    audio.play();
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
    audio.pause = false;
  }

  updateMusicRatio(ratio){
    let convertedRatio = (ratio+5)/10;
    musicSynth.volume = Math.max(0,Math.min(1,convertedRatio * constants.MUSIC_VOL));
    musicMetal.volume = Math.max(0, Math.min(1, (1 - convertedRatio) * constants.MUSIC_VOL));
  }
}
