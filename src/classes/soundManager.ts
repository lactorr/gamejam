

export class SoundManager {
  constructor() {}

  //get the sound and make it Audio
  loadSound(path, volume = 0) {
    const audio = new Audio(path);
    audio.loop = true;
    if(volume > 0) {
      audio.volume = volume;
    };
    return audio;
  }

  startSound(audio){
    audio.muted = false; // without this line it's not working although I have "muted" in HTML
    audio.play();
  }

  muteSound(audio){
    audio.muted= true;
  }

  unmuteSound(audio){
    audio.muted = false;
  }

  addVolume(audio){
    audio.volume += 0.1;
  }

  lowerVolume(audio){
    audio.volume -= 0.1;
  }



  /**/

}
