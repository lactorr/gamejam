import music_loop_synth  from '../assets/sounds/loop_synth.mp3';
import music_loop_metal  from '../assets/sounds/loop_metal.mp3';
import constants from '../constants';

function loadSound(path, volume) {
  const audio = path;
  const aCtx = new AudioContext();
  let source = aCtx.createBufferSource();
  let buf;
  fetch(audio) // can be XHR as well
    .then(resp => resp.arrayBuffer())
    .then(buf => aCtx.decodeAudioData(buf)) // can be callback as well
    .then(decoded => {
      source.buffer = buf = decoded;
      source.loop = true;
      source.connect(aCtx.destination);
    //  check.disabled = false;
    });
    /*check.onchange = e => {
      if (check.checked) {
        source.start(0); // start our bufferSource
      } else {
        source.stop(0); // this destroys the buffer source
        source = aCtx.createBufferSource(); // so we need to create a new one
        source.buffer = buf;
        source.loop = true;
        source.connect(aCtx.destination);
      }
    };*/
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
    audio.loop = true;
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
