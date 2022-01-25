import * as Phaser from 'phaser';

export type CustomBox = {
  x : number;
  y : number;
  width : number;
  height : number;
};

export type CustomHitBox = {
  T: CustomBox;
  B : CustomBox;
  L : CustomBox;
  R : CustomBox;
};

export type CustomHitBoxResponse = {
  collide: boolean;
  T: boolean;
  B: boolean;
  L: boolean;
  R: boolean;
};

/**
  Return a group of 4 boxes that can be customized to be pieces of the normal hitbox
*/
export function getCustomHitBox(b: Phaser.GameObjects.Image, g: number, t: number): CustomHitBox {
  //let subbox: CustomHitBox;
  let gg = g * 2;
  return {
    T :{x: b.x + g, y: b.y, width : b.width - gg, height : t},
    B :{x: b.x + g, y: b.y + b.height - t, width: b.width - gg, height: t},
    L :{x: b.x, y: b.y + g, width: t, height: b.height - gg},
    R :{x: b.x + b.width - t, y: b.y + g, width: t, height: b.height - gg}
  };
};

export function collideHitBox(r1:any, r2:any):boolean {
  return ((r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height &&
        r1.height + r1.y > r2.y));
}

export function customHitBoxCollide(b1:any, b2:any, g: number, t: number):CustomHitBoxResponse {
  //let response:CustomHitBoxResponse
  let response:CustomHitBoxResponse
  let targets = [];
  let subBoxes = getCustomHitBox(b1, g, t);
  var collide = collideHitBox(b1, b2);
  response={collide: false, T:false, B:false, L:false, R:false};
  if(collide===true)
    for (let S in subBoxes)
      targets[S]=collideHitBox(subBoxes[S], b2);
  return {collide:collide, T:targets["T"], B:targets["B"], L:targets["L"], R:targets["R"],};
}
