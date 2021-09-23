var boot = {
    init: function () {},

    preload: function () {
        game.load.image("loading", "assets/sprites/loading.png");
        game.load.image("logo", "assets/sprites/logo.png");
    },

    create: function () {
        game.state.start("Loading");
    }
};


var music;
var video;

var loading = {
    init: function () {},

    preload: function () {
        var loadingBar = game.add.sprite(320, 560, "loading");
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        var logo = game.add.sprite(320, 480, "logo").anchor.setTo(0.5);
        this.load.audio("music", "assets/sounds/music.wav");
    },

    create: function () {
        game.state.start("MainMenu");
    }
}

var MainMenu = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },

    preload: function () {
        game.load.video("startMenuVideo", "assets/videos/Startmenu.mp4");
        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    },

    create: function () {
        // video
        video = game.add.video("startMenuVideo");
        video.addToWorld(0, 0, 0, 0, 1, 1);

        // text
        bmpText = game.add.bitmapText(160, 500, 'carrier_command', 'Insert Credits !!', 24);

        // music
        music = game.add.audio("music", 1, true);
        music.play("", 0, 1, true);
    },

    update: function () {
        this.game.input.onDown.addOnce(() => {
            this.game.sound.context.resume();
            video.play(true);
            bmpText.inputEnabled = true;
        });

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            game.state.start("MainGame");
    }
};