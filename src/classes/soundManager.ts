

import music_loop_synth  from '../assets/sounds/music_loop_synth.mp3';
import music_loop_metal  from '../assets/sounds/music_loop_metal.mp3';
import constants from '../constants';

function loadSound(path, volume) {
  const audio = new Audio(path);
  audio.loop = true;
  audio.volume = volume; //default
  return audio;
}

export class SoundManager {
  gameSounds= {
    'musicSynth': loadSound(music_loop_synth, 0.5),
    'musicMetal': loadSound(music_loop_metal, 0.3)
  };

  constructor() {
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

  resumeSound(audio){
    audio.pause = false;
  }
  updateMusicRatio(ratio){
    let convertedRatio = (ratio+5)/10;
    this.gameSounds.musicSynth.volume = Math.max(0,Math.min(1,convertedRatio * constants.MUSIC_VOL));
    this.gameSounds.musicMetal.volume = Math.max(0, Math.min(1, (1 - convertedRatio) * constants.MUSIC_VOL));
  }
}
