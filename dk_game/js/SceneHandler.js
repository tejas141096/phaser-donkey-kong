/**
 * @author Tejas Ved <tejas.manish.ved@gmail.com>
 */

// Scene Handler. Main File to call Scenes
// var config = {
//     // type: Phaser.AUTO,
//     width: 360,
//     height: 590,
//     state: [MainGame]
// };

// var game = new Phaser.Game(config);

var game = new Phaser.Game(800, 960, Phaser.AUTO);

game.state.add("Boot", boot);
game.state.add("Loading", loading);
game.state.add("MainMenu", MainMenu);
game.state.add("MainGame", MainGame);
game.state.start("Boot");
