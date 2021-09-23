/**
 * @author Tejas Ved <tejas.manish.ved@gmail.com>
 */

// Game Code
// this game will use a 2d game engine

var MainGame = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // enabeling phisics engine on global setting
        this.game.physics.startSystem(Phaser.Physics.ARCADE); // adding phaser physics
        this.game.physics.arcade.gravity.y = 1000; // adding gravity 1000 can be changed around

        // enable curser keys by accessing the phaser keyboard functions
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //set game boundaries. This can be larger than the viewable area
        //this.game.world.setBounds(0, 0/* from top left*/, 360/* x*/, 700/* y*/)
        this.game.world.setBounds(0, 0 /* from top left*/ , 800 /* x*/ , 10000 /* y*/ )
        // create a constant variable that can be adjusted for all code that uses it here

        this.RUNNING_SPEED = 350;
        this.JUMPING_SPEED = 550;
    },

    preload: function () {
        // Load the game assets here before the game will start
        this.load.image('actionButton', 'assets/images/actionButton.png');
        this.load.image('arrowButton', 'assets/images/arrowButton.png');
        this.load.image('barrel', 'assets/images/barrel.png');
        this.load.image('stair', 'assets/images/Stair.png');
        this.load.image('rope', 'assets/images/rope.png');
        this.load.image('hook', 'assets/images/hook.png');
        this.load.image('treasure', 'assets/images/treasure.png');
        this.load.image('background', 'assets/images/background.png');
        this.load.image('ground', 'assets/images/G1.png');
        this.load.image('platform2', 'assets/images/G2.png');
        this.load.image('platform3', 'assets/images/G3.png');
        this.load.image('platform4', 'assets/images/G4.png');
        this.load.image('platform5', 'assets/images/G5.png');
        this.load.image('platform6', 'assets/images/G6.png');
        this.load.image('platform7', 'assets/images/G7.png');
        this.load.image('platform8', 'assets/images/G8.png');
        this.load.image('platform9', 'assets/images/G9.png');
        this.load.image('platform10', 'assets/images/G10.png');
        this.load.image('platform11', 'assets/images/G11.png');
        this.load.image('platform12', 'assets/images/G12.png');
        this.load.image('water', 'assets/images/Water_2.png');

        this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);
        this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 69, 90, 26);
        this.load.spritesheet('goal', 'assets/images/goal_spritesheet.png', 95, 96, 5);
        this.load.spritesheet('heart', 'assets/images/heart_spritesheet.png', 74, 96, 4);
        // this.load.image('pc', 'assets/images/G6.png');

        this.load.text('level', 'assets/data/level.json');

        this.load.spritesheet('hammer', 'assets/images/hammer_spritesheet.png', 23, 30, 3);
        // this.load.tilemap('tilemap', 'assets/data/kongtest.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function () {

        this.background = this.add.sprite(0, 0, 'background');
        this.background.scale.setTo(2.5, 2.5);

        //parse the json file holding level values that can be changed externally - this data is now stored in levelData variable
        this.levelData = JSON.parse(this.game.cache.getText('level'));

        // Level design data in level.json file
        //creating 2d world with adding platform sprites and ground
        this.ground = this.add.sprite(this.levelData.ground.x, this.levelData.ground.y, 'ground');
        this.ground.scale.setTo(0.95, 1);
        this.game.physics.arcade.enable(this.ground); // enable physics for this object
        this.ground.body.allowGravity = false; // not allow gravity for this object
        this.ground.body.immovable = true; // not allowing object to move if pushed or hit

        // Then create a group of platforms
        this.platforms = this.add.group();
        this.platforms.enableBody = true; // enable physics for group

        var i = 2;
        this.levelData.platformData.forEach(function (element) {
            this.platforms.create(element.x, element.y, 'platform' + i);
            i++;
        }, this);
        this.platforms.create(-700, 2600, 'platform7');
        this.platforms.create(-750, 2300, 'platform9');
        this.platforms.create(600, 1900, 'platform9');
        this.platforms.setAll('body.immovable', true); // set phisics for platform group
        this.platforms.setAll('body.allowGravity', false);

        // Then create a group of stairs
        this.stairs = this.add.group();
        this.stairs.enableBody = true;
        this.levelData.stairData.forEach(function (element) {
            this.stairs.create(element.x, element.y, 'stair').scale.setTo(element.scaleX, element.scaleY);
        }, this);
        this.stairs.setAll('body.immovable', true);
        this.stairs.setAll('body.allowGravity', false);

        // adding fires to the platform as bad guys
        this.fires = this.add.group();
        this.fires.enableBody = true;

        this.levelData.fireData.forEach(function (element) {
            fire = this.fires.create(element.x, element.y, 'fire');
            fire.animations.add('fire', [0, 1], 10, true);
            fire.play('fire');
            fire.scale.setTo(2.5, 2.5);
        }, this);
        this.fires.setAll('body.allowGravity', false);

        // create the goal here which is to make it to the gorrila

        this.treasure = this.add.sprite(this.levelData.goal.x - 100, this.levelData.goal.y, 'treasure');
        this.game.physics.arcade.enable(this.treasure);
        this.treasure.body.allowGravity = false;
        this.treasure.scale.setTo(0.5, 0.5);

        this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y - 100, 'goal');
        this.game.physics.arcade.enable(this.goal);
        this.goal.body.allowGravity = false;
        this.goal.animations.add('throw', [0, 1, 2, 3, 4], 6, true);
        this.goal.play('throw');
        this.goal.scale.setTo(2, 2);

        this.heart = this.add.sprite(this.levelData.goal.x - 70, this.levelData.goal.y, 'heart');
        this.game.physics.arcade.enable(this.heart);
        this.heart.body.allowGravity = false;
        this.heart.animations.add('beats', [0, 1, 2, 3], 6, true);
        this.heart.play('beats');
        this.heart.scale.setTo(0.5, 0.5);


        //adding player with animation
        this.player = this.add.sprite(this.levelData.playerStart.x /* this is from the level.json file*/ , this.levelData.playerStart.y, 'player', 3);
        this.player.anchor.setTo(0.5);
        this.player.animations.add('walking', [2, 3, 4, 5], 6, true);
        this.player.animations.add('idle', [0, 1], 3, true);
        this.player.animations.add('climb', [10, 16], 6, true);

        this.game.physics.arcade.enable(this.player);
        this.player.customParams = {}; // adding default empty custom params for now

        //set default player state
        this.player.customParams.isHoldHammer = false;
        this.player.customParams.isFacingLeft = false;
        this.player.customParams.isFacingRight = true;
        this.player.customParams.currentHammer = 0;
        this.player.customParams.ropeCount = 0;
        this.player.customParams.sentHook = false;
        this.player.customParams.needMove = false;
        this.player.customParams.health = 100;

        //set hook
        this.hook = this.add.sprite(this.player.x, this.player.y, 'hook');
        this.hook.visible = false;
        this.hook.anchor.setTo(0, 1);
        this.game.physics.arcade.enable(this.hook);
        this.hook.body.enable = false;
        this.hook.body.allowGravity = false;
        this.hook.targetPositionY = 0;

        //set hammer with animation
        //hammer's cout are three
        this.hammer1 = this.add.sprite(this.levelData.hammer1.x, this.levelData.hammer1.y, 'hammer');
        this.hammer1.animations.add('hammer');
        this.hammer1.anchor.setTo(0, 0.5);
        this.game.physics.arcade.enable(this.hammer1);
        this.hammer1.body.allowGravity = false;
        this.hammer1.frame = 1;
        this.hammer1.scale.setTo(3.5, 3.5);

        this.hammer2 = this.add.sprite(this.levelData.hammer2.x, this.levelData.hammer2.y, 'hammer');
        this.hammer2.animations.add('hammer');
        this.hammer2.anchor.setTo(0, 0.5);
        this.game.physics.arcade.enable(this.hammer2);
        this.hammer2.body.allowGravity = false;
        this.hammer2.frame = 1;
        this.hammer2.scale.setTo(3, 3);

        this.hammer3 = this.add.sprite(this.levelData.hammer3.x, this.levelData.hammer3.y, 'hammer');
        this.hammer3.animations.add('hammer');
        this.hammer3.anchor.setTo(0, 0.5);
        this.game.physics.arcade.enable(this.hammer3);
        this.hammer3.body.allowGravity = false;
        this.hammer3.frame = 1;
        this.hammer3.scale.setTo(3, 3);

        //set rope for player to pick
        this.ropes = this.add.group();
        this.ropes.enableBody = true;

        this.levelData.ropeData.forEach(function (element) {
            rope = this.ropes.create(element.x, element.y, 'rope');
            rope.scale.setTo(0.3, 0.3);
        }, this);
        this.ropes.setAll('body.allowGravity', false);

        // adding camera follow
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);
        this.game.camera.deadzone = new Phaser.Rectangle(400, 480, 800, 10);
        this.game.camera.setSize(800, 480);

        // adding custom onscreen control
        // this.createOnscreenControls();

        // implement a group of barrels

        this.barrels = this.add.group();
        this.barrels.enableBody = true;

        //create a loop for barrels to roll down the map
        this.createBarrel(); // initial barrel created before the 5 second counter loop starts
        this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this);

        // Water Creation
        this.water = this.add.sprite(this.levelData.ground.x, this.levelData.ground.y + 200, 'water');
        this.water.scale.x = 1.5;
        this.water.scale.y = 2;
        this.water.alpha = 0.75;
        // this.water.scale.setTo(, );
        // this.game.physics.arcade.enable(this.water);

        var tween = this.add.tween(this.water);

        tween.to({
            y: this.levelData.ground.y - 10000
        }, this.levelData.waterSpeed, Phaser.Easing.Exponential.Out, true, 0);

    },

    update: function () {
        //overlap detection with player and stair
        this.DetectStairOverlap();
        // always use collision detection in the update method to ensure it is checked all the time and not jsut once
        // collision detection with player and ground
        if (!(this.player.customParams.isOnStair &&
                (this.cursors.up.isDown ||
                    game.input.keyboard.isDown(Phaser.Keyboard.DOWN)))) {
            this.game.physics.arcade.collide(this.player, this.ground);
            this.game.physics.arcade.collide(this.player, this.platforms);
        }

        // collision detection with barrel and ground
        this.game.physics.arcade.collide(this.barrels, this.ground);
        this.game.physics.arcade.collide(this.barrels, this.platforms);

        if (this.player.customParams.isHoldHammer) {
            //collision detection with hammer and barrel
            this.game.physics.arcade.overlap(this.hammer1, this.barrels, this.KillBarrel);
            this.game.physics.arcade.overlap(this.hammer2, this.barrels, this.KillBarrel);
            this.game.physics.arcade.overlap(this.hammer3, this.barrels, this.KillBarrel);
        } else {
            //collision detection with hammer and barrel in order to pick hammer
            if (this.game.physics.arcade.overlap(this.player, this.hammer1, this.PickUpHammer)) {
                this.player.customParams.currentHammer = 1;
            }
            if (this.game.physics.arcade.overlap(this.player, this.hammer2, this.PickUpHammer)) {
                this.player.customParams.currentHammer = 2;
            }
            if (this.game.physics.arcade.overlap(this.player, this.hammer3, this.PickUpHammer)) {
                this.player.customParams.currentHammer = 3;
            }
        }

        // collision detection with player and fire
        this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
        // collision detection with player and barrel
        this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);
        // check water level and compare with player height
        if (this.water.y - this.player.y < -30) {
            this.killPlayerWater();
        }

        //collision detection with player and rope
        this.game.physics.arcade.overlap(this.player, this.ropes, this.PickRope);
        this.game.debug.text("rope count: " + this.player.customParams.ropeCount, 500, 50);
        this.game.debug.text('Player Health: ' + this.player.customParams.health, 50, 50);

        //collision detection with player and goal
        this.game.physics.arcade.overlap(this.player, this.goal, this.win);

        // listen for key control of player. setting velocity to 0 so that the player object doesn't continue int he same direction and reverts back to a velocity of zero when the cursor key is nnot pressed anymore
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
            this.player.body.velocity.x = -this.RUNNING_SPEED;
            this.player.scale.setTo(-1, 1); // setting scale or direction of player back
            this.player.play('walking'); // player animation
            this.player.customParams.isFacingRight = false; //set facing state
            this.player.customParams.isFacingLeft = true;
            this.hammer1.visible = true;
            this.hammer2.visible = true;
            this.hammer3.visible = true;
        } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
            this.player.body.velocity.x = this.RUNNING_SPEED;
            this.player.scale.setTo(1, 1); // set sprite to flip over to the other side x axis
            this.player.play('walking');
            this.player.customParams.isFacingRight = true; //set facing state
            this.player.customParams.isFacingLeft = false;
            this.hammer1.visible = true;
            this.hammer2.visible = true;
            this.hammer3.visible = true;
        } else if (this.cursors.up.isDown && this.player.customParams.isOnStair) {
            this.player.body.velocity.y = -this.RUNNING_SPEED;
            this.player.play('climb');
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.player.customParams.isOnStair) {
            this.player.body.velocity.y = this.RUNNING_SPEED;
            this.player.play('climb');
        } else {
            this.player.play('idle');
            if (this.player.customParams.currentHammer == 1) {
                this.hammer1.visible = false;
            } else if (this.player.customParams.currentHammer == 2) {
                this.hammer2.visible = false;
            } else if (this.player.customParams.currentHammer == 3) {
                this.hammer3.visible = false;
            } else {
                this.hammer1.visible = true;
                this.hammer2.visible = true;
                this.hammer3.visible = true;
            }
        }

        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.set(1, 0);
        // for jumping this is on the y axis. to ensure jumping doesn't happen without the character being on the ground you add the touching.down value as part of the argument
        if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.JUMPING_SPEED;
            this.player.customParams.mustJump = false;
        }


        this.hook.position.setTo(this.player.x, this.player.y);
        //if player has rope and press SPACEBAR, sent the hook
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.player.customParams.ropeCount > 0) {
            this.player.sentHook = true;
            this.hook.body.enable = true;
            this.hook.body.allowGravity = false;
        }
        //if player release SPACEBAR, CANCEL sent hook
        if (this.player.sentHook == true && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.hook.scale.setTo(1, 1);
            this.hook.body.height = 1;
            this.hook.body.width = 2;
            this.hook.position.setTo(this.player.x, this.player.y);
            this.player.sentHook = false;
            this.hook.body.enable = false;
            this.hook.body.position.setTo(this.player.x, this.player.y);
            this.hook.visible = false;
        }

        //send the hook while player is pressing SPACEBAR
        if (this.player.sentHook == true) {
            this.hook.visible = true;
            this.hook.scale.setTo(1, this.hook.scale.y * 1.08);
        }

        //if the hook reach platform, change player's position to there.
        if (this.game.physics.arcade.overlap(this.hook, this.platforms, this.MovePlayer)) {
            this.player.customParams.needMove = true;
            this.hook.body.height = 1;
            this.hook.body.width = 2;
            this.hook.body.enable = false;
            this.hook.scale.setTo(1, 1);
            this.player.sentHook = false;
            this.hook.visible = false;
        }
        if (this.player.customParams.needMove == true) {
            this.player.y -= 20;
            if (this.player.y < this.hook.targetPositionY - 50) {
                this.player.customParams.needMove = false;
                this.player.customParams.ropeCount--;
                this.hook.position.setTo(this.player.x, this.player.y);
                this.hook.body.position.setTo(this.player.x, this.player.y);
            }
        }

        if (this.player.customParams.isHoldHammer) {
            //make hammer follow player
            if (this.player.customParams.isFacingLeft) {
                if (this.player.customParams.currentHammer == 1) {
                    this.hammer1.body.x = this.player.body.x - 30;
                    this.hammer1.body.y = this.player.body.y - 5;
                    this.hammer1.anchor.setTo(0, 0.5);
                    this.hammer1.scale.setTo(3, 3);
                } else if (this.player.customParams.currentHammer == 2) {
                    this.hammer2.body.x = this.player.body.x - 30;
                    this.hammer2.body.y = this.player.body.y - 5;
                    this.hammer2.anchor.setTo(0, 0.5);
                    this.hammer2.scale.setTo(3, 3);
                } else if (this.player.customParams.currentHammer == 3) {
                    this.hammer3.body.x = this.player.body.x - 30;
                    this.hammer3.body.y = this.player.body.y - 5;
                    this.hammer3.anchor.setTo(0, 0.5);
                    this.hammer3.scale.setTo(3, 3);
                }
            }
            if (this.player.customParams.isFacingRight) {
                if (this.player.customParams.currentHammer == 1) {
                    this.hammer1.body.x = this.player.body.x + 30;
                    this.hammer1.body.y = this.player.body.y - 5;
                    this.hammer1.anchor.setTo(0.5, 0.5);
                    this.hammer1.scale.setTo(-3, 3);
                } else if (this.player.customParams.currentHammer == 2) {
                    this.hammer2.body.x = this.player.body.x + 30;
                    this.hammer2.body.y = this.player.body.y - 5;
                    this.hammer2.anchor.setTo(0.5, 0.5);
                    this.hammer2.scale.setTo(-3, 3);
                } else if (this.player.customParams.currentHammer == 3) {
                    this.hammer3.body.x = this.player.body.x + 30;
                    this.hammer3.body.y = this.player.body.y - 5;
                    this.hammer3.anchor.setTo(0.5, 0.5);
                    this.hammer3.scale.setTo(-3, 3);
                }
            }
        }

        // to kill each barrel element that reaches the bottom
        this.barrels.forEach(function (element) {
            if (element.x < 10 && element.y > 4200) {
                element.kill();
            }
        }, this);
    },

    // add the controls as sprites that will function as buttons
    createOnscreenControls: function () {

        this.leftArrow = this.add.button(20, 900, 'arrowButton');
        this.rightArrow = this.add.button(150, 900, 'arrowButton');
        this.actionButton = this.add.button(580, 900, 'actionButton');
        this.leftArrow.alpha = 0.5;
        this.rightArrow.alpha = 0.5;
        this.actionButton.alpha = 0.5;

        //set buttons fixed to camera so they do not go off teh map

        this.leftArrow.fixedToCamera = true;
        this.rightArrow.fixedToCamera = true;
        this.actionButton.fixedToCamera = true;
        // listen for events fo the action buttons here

        // jumping
        this.actionButton.events.onInputDown.add(function () {
            this.player.customParams.mustJump = true;
        }, this);

        this.actionButton.events.onInputUp.add(function () {
            this.player.customParams.mustJump = false;
        }, this);
        // Moving left

        this.leftArrow.events.onInputDown.add(function () {
            this.player.customParams.isMovingLeft = true;
        }, this);

        this.leftArrow.events.onInputUp.add(function () {
            this.player.customParams.isMovingLeft = false;
        }, this);

        // Moving right

        this.rightArrow.events.onInputDown.add(function () {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputUp.add(function () {
            this.player.customParams.isMovingRight = false;
        }, this);
    },

    //detect if player is on stair
    DetectStairOverlap: function () {
        var temp = false;
        this.stairs.forEach(function (element) {
            if (this.game.physics.arcade.overlap(this.player, element)) {
                temp = true;
            }
        }, this);
        this.player.customParams.isOnStair = temp;
    },

    MovePlayer: function (hook, platforms) {
        hook.targetPositionY = platforms.y;
    },

    KillBarrel: function (hammer, barrels) {
        console.log('kill barrel');
        barrels.kill();
    },

    PickUpHammer: function (player, hammer) {
        player.customParams.isHoldHammer = true;
        hammer.animations.play('hammer', 10, true);
        //kill the hammer in 10s
        game.time.events.add(Phaser.Timer.SECOND * 10, function () {
            hammer.kill();
            player.customParams.isHoldHammer = false;
        }, game);
        //when the kill time is close, let the hammer flash 
        game.time.events.add(Phaser.Timer.SECOND * 6, function () {
            game.time.events.loop(Phaser.Timer.SECOND, function () {
                hammer.tint = 0xff3300;
                game.time.events.add(Phaser.Timer.SECOND / 5, function () {
                    hammer.tint = 0xffffff;
                })
            })
        }, game);
    },

    PickRope: function (player, rope) {
        rope.kill();
        player.customParams.ropeCount++;
    },

    // our kill player function
    killPlayerWater: function () {
        console.log('drown!');
        game.state.start('MainGame');
    },

    killPlayer: function (player, fire) {
        console.log('ouch!');
        fire.kill();
        player.customParams.health -= 10;
        if (player.customParams.health <= 0)
            game.state.start('MainGame');
    },

    // our win function
    win: function (player, goal) {
        alert('we have a winner!');
        game.state.start('MainGame');
    },

    createBarrel: function () {
        var barrel = this.barrels.getFirstExists(false); // get first dead barrel object

        if (!barrel) { // if dead barrel isn't there make new barrel
            if (this.player.y > 3300) {
                barrel = this.barrels.create(20, 2800, 'barrel');
            } else {
                barrel = this.barrels.create(20, 0, 'barrel'); // if no barrel present then create it
            }
        }
        // set out of bounds collide to stop barrels from going off screen
        barrel.body.collideWorldBounds = true;
        barrel.body.bounce.set(1, 0);
        barrel.scale.setTo(1, 1);
        if (this.player.y > 3300) {
            barrel.reset(20, 2800);
        } else {
            barrel.reset(this.levelData.goal.x, this.levelData.goal.y);
        }
        barrel.body.velocity.x = this.levelData.barrelSpeed;
    },

    render: function () {
        game.debug.body(this.water);
        game.debug.body(this.player);
    }
};

//initiate the Phaser Framework
//var game = new Phaser.Game(360, 592, Phaser.AUTO);
// var game=new Phaser.Game(800,960,Phaser.AUTO);

// game.state.add('MainGame', MainGame);
// game.state.start('MainGame');