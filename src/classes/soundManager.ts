

export class SoundManager {
  constructor() {}
  //[{}, {}]

  //upd when groundPos change in the game
  // default : 0 start music if no music is started
  /*updateSoundChange(groundPosition){

  }*/

  //get the sound and make it Audio
  loadSound(path) {
    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = 0.8;
    console.log(audio);
    return audio;
  }

  playSound(audioName){
    console.log(audioName);
  }

}
