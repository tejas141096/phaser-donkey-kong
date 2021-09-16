/**
 * @author Tejas Ved <tejas.manish.ved@gmail.com>
 */

// Scene Handler. Main File to call Scenes
const Phaser = require("./phaser");

var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 590,
    scene: [MainGame]
};

var game = new Phaser.Game(config);