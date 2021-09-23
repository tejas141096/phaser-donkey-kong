var EndGameWin = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },

    preload: function () {
        // win img
        this.load.image('win', 'assets/images/win.png');
        //text
        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    },

    create: function () {
        this.winImg = this.add.sprite(90, 320, 'win');
        this.winImg.alpha = 0;

        bmpText = game.add.bitmapText(160, 750, 'carrier_command', 'Insert Credits !!', 24);
    },

    update: function () {
        this.add.tween(this.winImg).to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
}

var EndGameLose = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },

    preload: function () {
        // lose img
        this.load.image('lose', 'assets/images/lose.png');
        // text
        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

    },

    create: function () {
        this.loseImg = this.add.sprite(90, 320, 'lose');
        this.loseImg.alpha = 0;

        bmpText = game.add.bitmapText(160, 750, 'carrier_command', 'Insert Credits !!', 24);

    },

    update: function () {
        this.add.tween(this.loseImg).to({
            alpha: 1
        }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
}