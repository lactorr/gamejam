const TILE_SIZE = 16;
const Constants = {
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

    PLAYER_VELOCITY: 120,
    MOB_VELOCITY: 100,
}

export default Constants;
