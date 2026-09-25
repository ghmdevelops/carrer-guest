export const GRAVITY = 2400
export const JUMP_VELOCITY = 900
// Menor impulso possivel ao soltar a tecla. Garante altura suficiente para
// sempre alcancar a base do bloco (BLOCK_BOTTOM - PLAYER_H).
export const MIN_JUMP_VELOCITY = 760
export const MOVE_SPEED = 290
export const MAX_FALL_SPEED = 1700
export const BUMP_VELOCITY = -280

export const COYOTE_TIME = 0.1
export const JUMP_BUFFER = 0.13

export const SPRITE_SCALE = 4
export const SPRITE_COLS = 16
export const SPRITE_ROWS = 18
export const SPRITE_W = SPRITE_COLS * SPRITE_SCALE
export const SPRITE_H = SPRITE_ROWS * SPRITE_SCALE

export const PLAYER_W = 40
export const PLAYER_H = SPRITE_H
export const PLAYER_START_X = 90

export const GROUND_H = 104
export const BLOCK_SIZE = 64
export const BLOCK_BOTTOM = 168
export const BLOCK_EDGE_INSET = 8

export const COIN_SIZE = 28
export const COIN_PICK_RADIUS = 40

export const BUG_SCALE = 4
export const BUG_COLS = 12
export const BUG_ROWS = 10
export const BUG_SPRITE_W = BUG_COLS * BUG_SCALE
export const BUG_SPRITE_H = BUG_ROWS * BUG_SCALE
export const BUG_W = 40
export const BUG_H = BUG_SPRITE_H
export const BUG_SPEED = 72
// Margem vertical para decidir entre pisar no bug e levar o esbarrao.
export const STOMP_TOLERANCE = 16
export const STOMP_BOUNCE = 640
export const HURT_KNOCKBACK_X = 300
export const HURT_KNOCKBACK_Y = 430
export const INVULN_TIME = 1.3

export const DINO_SCALE = 4
export const DINO_COLS = 18
export const DINO_ROWS = 14
export const DINO_SPRITE_W = DINO_COLS * DINO_SCALE
export const DINO_SPRITE_H = DINO_ROWS * DINO_SCALE
// Altura em que o jogador senta nas costas do dino (linha do dorso do sprite).
export const DINO_RIDE_OFFSET = 32
export const MOUNTED_H = DINO_RIDE_OFFSET + PLAYER_H
export const MOUNTED_JUMP_MULT = 1.16
export const MOUNTED_SPEED_MULT = 1.18

// Giro no ar: mata bugs por qualquer lado e planeia a queda.
export const SPIN_TIME = 0.5
export const SPIN_FALL_SPEED = -170
export const SPIN_TURNS = 720

export const POWERUP_SIZE = 34
export const POWERUP_POP_VELOCITY = 430
export const COFFEE_DURATION = 9
export const COFFEE_SPEED_MULT = 1.5

export const HIT_STOP = 0.07
export const SHAKE_TIME = 0.26
export const SHAKE_MAGNITUDE = 9

export const FIRST_BLOCK_X = 460
export const BLOCK_SPACING = 680
export const LEVEL_TAIL = 560
export const FLAG_OFFSET = 380

export const CAMERA_ANCHOR = 0.34
export const CAMERA_LERP = 9
