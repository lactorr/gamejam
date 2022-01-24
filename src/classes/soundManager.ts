

import music_loop_synth  from '../assets/sounds/music_loop_synth.mp3';
import music_loop_metal  from '../assets/sounds/music_loop_metal.mp3';

function loadSound(path) {
  const audio = new Audio(path, volume);
  audio.loop = true;
  audio.volume = volume; //default
  return audio;
}

export class SoundManager {
  let gameSounds= [
    loadSound(music_loop_synth, 0.5),
    loadSound(music_loop_metal, 0.3)
  ];

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

  /*addVolume(audio){
    audio.volume += 0.1;
  }

  lowerVolume(audio){
    audio.volume -= 0.1;
  }*/

  updateMusicRatio(ratio){
    //based on ratio number we get in the range [-5,5] -> calc volume in range [0,1]
  }
}
