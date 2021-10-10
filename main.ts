namespace SpriteKind {
    export const assassin = SpriteKind.create()
}
// Assassins.
sprites.onCreated(SpriteKind.Enemy, function (sprite) {
    animation.loopFrames2(
    sprite,
    assets.animation`assassin left`,
    500,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    animation.loopFrames2(
    sprite,
    assets.animation`assassin right`,
    125,
    characterAnimations.rule(Predicate.MovingRight)
    )
    sprite.follow(Shang_Chi, 30)
    sprite.ay = 500
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    sprites.gravity_jump(Shang_Chi)
    music.knock.play()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`pit`, function (sprite, location) {
    game.over(false, effects.blizzard)
})
// Beam up sound effect for the special powers.
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    projectile = sprites.createProjectileFromSprite(assets.image`power kick`, Shang_Chi, 50, 50)
    projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
    projectile.lifespan = 100
    animation.runImageAnimation(
    Shang_Chi,
    assets.animation`sc kick`,
    125,
    false
    )
    music.beamUp.play()
})
// Game Over Win
scene.onOverlapTile(SpriteKind.Player, assets.tile`door0`, function (sprite, location) {
    scene.setBackgroundImage(assets.image`background2`)
    tiles.setTilemap(tilemap`Level3`)
    animation.runMovementAnimation(
    Shang_Chi,
    animation.animationPresets(animation.flyToCenter),
    2000,
    false
    )
    game.level_num(3)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(Shang_Chi), CollisionDirection.Bottom), true)
    tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(Shang_Chi), CollisionDirection.Bottom), assets.tile`energy`)
    music.zapped.play()
})
// Copy of the old enemy to assassin.
scene.onHitWall(SpriteKind.assassin, function (sprite, location) {
    sprites.wall_jump(sprite)
})
// New assassin interacts with 
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.assassin, function (sprite, otherSprite) {
    tiles.placeOnRandomTile(otherSprite, assets.tile`rubble`)
    info.changeLifeBy(-1)
    info.changeScoreBy(-1)
    animation.runImageAnimation(
    Shang_Chi,
    assets.animation`sc damage`,
    150,
    false
    )
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    sprites.wall_jump(sprite)
})
// Game Over Win
scene.onOverlapTile(SpriteKind.Player, assets.tile`door2`, function (sprite, location) {
    game.over(true)
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    tiles.placeOnRandomTile(otherSprite, assets.tile`rubble`)
    info.changeLifeBy(-1)
    animation.runImageAnimation(
    Shang_Chi,
    assets.animation`sc damage`,
    150,
    false
    )
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`ring`, function (sprite, location) {
    music.baDing.stop()
    tiles.setTileAt(location, assets.tile`transparency16`)
    info.changeScoreBy(1)
})
// The projectiles will need to interact with the new assassin too
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.assassin, function (sprite, otherSprite) {
    sprite.destroy(effects.spray, 500)
    otherSprite.destroy(effects.spray, 500)
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`boulder`, function (sprite, location) {
    tiles.setWallAt(location, false)
    tiles.setTileAt(location, assets.tile`transparency16`)
})
// 1. When old assassins get destroyed = new sprite L2 Assassin
sprites.onDestroyed(SpriteKind.Enemy, function (sprite) {
    // 2. Set new sprite
    level_2_assassin = sprites.create(img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.assassin)
    tiles.placeOnRandomTile(level_2_assassin, assets.tile`boulder`)
    // 3. From Character. Animate with frames for left and right.
    characterAnimations.runFrames(
    level_2_assassin,
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f f . . . . . 
        . . . . f 2 f e e e e f f . . . 
        . . . f 2 2 2 f e e e e f f . . 
        . . . f e e e e f f e e e f . . 
        . . f e 2 2 2 2 e e f f f f . . 
        . . f 2 e f f f f 2 2 2 e f . . 
        . . f f f e e e f f f f f f f . 
        . . f e e 4 4 f b e 4 4 e f f . 
        . . f f e d d f 1 4 d 4 e e f . 
        . f d d f d d d d 4 e e e f . . 
        . f b b f e e e 4 e e f . . . . 
        . f b b e d d 4 2 2 2 f . . . . 
        . . f b e d d e 4 4 4 f f . . . 
        . . . f f e e f f f f f f . . . 
        . . . . f f f . . . f f . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f f . . . . . 
        . . . . f 2 f e e e e f f . . . 
        . . . f 2 2 2 f e e e e f f . . 
        . . . f e e e e f f e e e f . . 
        . . f e 2 2 2 2 e e f f f f . . 
        . . f 2 e f f f f 2 2 2 e f . . 
        . . f f f e e e f f f f f f f . 
        . . f e e 4 4 f b e 4 4 e f f . 
        . . . f e d d f 1 4 d 4 e e f . 
        . . . . f d d d e e e e e f . . 
        . . . . f e 4 e d d 4 f . . . . 
        . . . . f 2 2 e d d e f . . . . 
        . . . f f 5 5 f e e f f f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . f f f . . . f f . . . . 
        `,img`
        . . . . . f f f f f f . . . . . 
        . . . . f 2 f e e e e f f . . . 
        . . . f 2 2 2 f e e e e f f . . 
        . . . f e e e e f f e e e f . . 
        . . f e 2 2 2 2 e e f f f f . . 
        . . f 2 e f f f f 2 2 2 e f . . 
        . . f f f e e e f f f f f f f . 
        . . f e e 4 4 f b e 4 4 e f f . 
        . . f f e d d f 1 4 d 4 e e f . 
        . f d d f d d d d 4 e e e f . . 
        . f b b f e e e 4 e e f f . . . 
        . f b b e d d 4 2 2 2 f . . . . 
        . . f b e d d e 2 2 2 e . . . . 
        . . . f f e e f 4 4 4 f . . . . 
        . . . . . f f f f f f . . . . . 
        . . . . . . . f f f . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f f f f . . . . . . 
        . . . f 2 f e e e e f f . . . . 
        . . f 2 2 2 f e e e e f f . . . 
        . . f e e e e f f e e e f . . . 
        . f e 2 2 2 2 e e f f f f . . . 
        . f 2 e f f f f 2 2 2 e f . . . 
        . f f f e e e f f f f f f f . . 
        . f e e 4 4 f b e 4 4 e f f . . 
        . . f e d d f 1 4 d 4 e e f . . 
        . . . f d d d e e e e e f . . . 
        . . . f e 4 e d d 4 f . . . . . 
        . . . f 2 2 e d d e f . . . . . 
        . . f f 5 5 f e e f f f . . . . 
        . . f f f f f f f f f f . . . . 
        . . . f f f . . . f f . . . . . 
        `],
    500,
    characterAnimations.rule(Predicate.MovingLeft)
    )
    characterAnimations.loopFrames(
    level_2_assassin,
    [img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f f . . . . . 
        . . . f f e e e e f 2 f . . . . 
        . . f f e e e e f 2 2 2 f . . . 
        . . f e e e f f e e e e f . . . 
        . . f f f f e e 2 2 2 2 e f . . 
        . . f e 2 2 2 f f f f e 2 f . . 
        . f f f f f f f e e e f f f . . 
        . f f e 4 4 e b f 4 4 e e f . . 
        . f e e 4 d 4 1 f d d e f . . . 
        . . f e e e e e d d d f . . . . 
        . . . . f 4 d d e 4 e f . . . . 
        . . . . f e d d e 2 2 f . . . . 
        . . . f f f e e f 5 5 f f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . f f . . . f f f . . . . 
        `,img`
        . . . . . f f f f f f . . . . . 
        . . . f f e e e e f 2 f . . . . 
        . . f f e e e e f 2 2 2 f . . . 
        . . f e e e f f e e e e f . . . 
        . . f f f f e e 2 2 2 2 e f . . 
        . . f e 2 2 2 f f f f e 2 f . . 
        . f f f f f f f e e e f f f . . 
        . f f e 4 4 e b f 4 4 e e f . . 
        . f e e 4 d 4 1 f d d e f f . . 
        . . f e e e 4 d d d d f d d f . 
        . . . f f e e 4 e e e f b b f . 
        . . . . f 2 2 2 4 d d e b b f . 
        . . . . e 2 2 2 e d d e b f . . 
        . . . . f 4 4 4 f e e f f . . . 
        . . . . . f f f f f f . . . . . 
        . . . . . . f f f . . . . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f f . . . . . 
        . . . f f e e e e f 2 f . . . . 
        . . f f e e e e f 2 2 2 f . . . 
        . . f e e e f f e e e e f . . . 
        . . f f f f e e 2 2 2 2 e f . . 
        . . f e 2 2 2 f f f f e 2 f . . 
        . f f f f f f f e e e f f f . . 
        . f f e 4 4 e b f 4 4 e e f . . 
        . f e e 4 d 4 1 f d d e f . . . 
        . . f e e e e e d d d f . . . . 
        . . . . f 4 d d e 4 e f . . . . 
        . . . . f e d d e 2 2 f . . . . 
        . . . f f f e e f 5 5 f f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . f f . . . f f f . . . . 
        `,img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f f f f . . . . . 
        . . . f f e e e e f 2 f . . . . 
        . . f f e e e e f 2 2 2 f . . . 
        . . f e e e f f e e e e f . . . 
        . . f f f f e e 2 2 2 2 e f . . 
        . . f e 2 2 2 f f f f e 2 f . . 
        . f f f f f f f e e e f f f . . 
        . f f e 4 4 e b f 4 4 e e f . . 
        . f e e 4 d 4 1 f d d e f f . . 
        . . f e e e 4 d d d d f d d f . 
        . . . . f e e 4 e e e f b b f . 
        . . . . f 2 2 2 4 d d e b b f . 
        . . . f f 4 4 4 e d d e b f . . 
        . . . f f f f f f e e f f . . . 
        . . . . f f . . . f f f . . . . 
        `],
    500,
    characterAnimations.rule(Predicate.MovingRight)
    )
    // Change speed.
    level_2_assassin.follow(Shang_Chi, 40)
    // Keep acceleration
    sprite.ay = 500
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy()
})
// Game Over Win
scene.onOverlapTile(SpriteKind.Player, assets.tile`door1`, function (sprite, location) {
    scene.setBackgroundImage(assets.image`background2`)
    tiles.setTilemap(tilemap`level2`)
    music.magicWand.play()
    animation.runMovementAnimation(
    Shang_Chi,
    animation.animationPresets(animation.flyToCenter),
    2000,
    false
    )
    game.level_num(2)
    level_2_assassin = sprites.create(img`
        . f f f . f f f f . f f f . 
        f f f f f c c c c f f f f f 
        f f f f b c c c c b f f f f 
        f f f c 3 c c c c 3 c f f f 
        . f 3 3 c c c c c c 3 3 f . 
        . f c c c c 4 4 c c c c f . 
        . f f c c 4 4 4 4 c c f f . 
        . f f f b f 4 4 f b f f f . 
        . f f 4 1 f d d f 1 4 f f . 
        . . f f d d d d d d f f . . 
        . . e f e 4 4 4 4 e f e . . 
        . e 4 f b 3 3 3 3 b f 4 e . 
        . 4 d f 3 3 3 3 3 3 c d 4 . 
        . 4 4 f 6 6 6 6 6 6 f 4 4 . 
        . . . . f f f f f f . . . . 
        . . . . f f . . f f . . . . 
        `, SpriteKind.Enemy)
    level_2_assassin.follow(Shang_Chi, 10)
    sprites.wall_jump(level_2_assassin)
    level_2_assassin.setPosition(0, 0)
})
// Shang Chi
let level_2_assassin: Sprite = null
let projectile: Sprite = null
let Shang_Chi: Sprite = null
scene.setBackgroundImage(assets.image`background1`)
tiles.setTilemap(tilemap`level1`)
Shang_Chi = sprites.create(assets.image`Shang-Chi`, SpriteKind.Player)
sprites.add_profile(Choice.shang)
controller.moveSprite(Shang_Chi, 100, 0)
Shang_Chi.ay = 500
scene.cameraFollowSprite(Shang_Chi)
animation.loopFrames2(
Shang_Chi,
assets.animation`sc walk right`,
100,
characterAnimations.rule(Predicate.MovingRight)
)
animation.loopFrames2(
Shang_Chi,
assets.animation`sc walk left`,
100,
characterAnimations.rule(Predicate.MovingLeft)
)
animation.loopFrames2(
Shang_Chi,
assets.animation`sc jump`,
125,
characterAnimations.rule(Predicate.MovingUp)
)
tiles.createSpritesOnTiles(assets.tile`rubble`, SpriteKind.Enemy)
forever(function () {
    music.playMelody("A F E F D G E F ", 130)
    music.playMelody("E B C5 A B G A F ", 130)
    music.playMelody("C5 A B G A F G E ", 130)
    music.playMelody("C5 G B A F A C5 B ", 130)
})
