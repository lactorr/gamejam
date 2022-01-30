const TILE_SIZE = 16;
const Constants = {
    GAME_WIDTH: 1366,
    GAME_HEIGHT: 768,

    GAMEAREA_WIDTH: 832,
    GAMEAREA_HEIGHT: 500,

    TILE_SIZE,
    ROOM_W: 29*TILE_SIZE,
    ROOM_H: 19*TILE_SIZE,
    SIDEBAR_W: 20,

    Z_HUD_DEBUG: 25,
    Z_HUD: 20,
    Z_ABOVE_PLAYER: 15, // TODO find better name for Z_ABOVE_PLAYER
    Z_ENNEMY: 11,
    Z_PLAYER: 10,
    Z_BORDERS: 5,
    Z_BACKGROUND: 0,

    MOB_VELOCITY: 100,
    BLOCKW : 60,
    BLOCKH : 50,
    SWITCH_SIZE : 30,
    GROUND_SPEED : 0.003,
    JUMP_VELOCITY : 250,
    PLAYER_GRAVITY : 500,
    PLAYER_XVELOCITY : 100,
    JUMP_ANGLE_OFFSET: 0.2,
    JUMP_ANGLE_MAX: 0.5,
    JUMP_ANGLE_STEPS: 50,
    PARALLAX: 0.7,
    MUSIC_VOL : 0.8,

    TIMER : 4000000, //temps pour réaliser le niveau, en ms
}

export default Constants;
