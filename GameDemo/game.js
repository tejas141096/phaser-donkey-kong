var config=
{
    type: Phaser.AUTO,
    width: 800,
    height: 960,
	scale: 
	{
    	autoCenter: Phaser.Scale.CENTER_BOTH
  	},
    physics: 
    {
        default: 'arcade',
        arcade:
        {
            gravity: {y:600},
            debug: false
        }
    },
    scene:
    {
        preload: preload,
        create : create,
        update : update
    }
};

var game = new Phaser.Game(config);

var platforms;
var player;
var cursors;
var stars;
var score=0;
var scoreText;
var bombs;
function preload()
{
    this.load.image('sky','assets/sky.png');
    this.load.image('ground','assets/platform.png');
    this.load.image('star','assets/star.png');
    this.load.image('bomb','assets/bomb.png');
    this.load.spritesheet('dude','assets/dude.png',{frameWidth: 32, frameHeight: 48});
}

function create()
{
    //game.plugins.add(Phaser.Plugin.ArcadeSlopes);

    this.add.image(400,300,'sky').setScale(2.5);
    platforms=this.physics.add.staticGroup();
    platforms.create(400,960,'ground').setScale(2).refreshBody();

    var plat1 = platforms.create(100,200,'ground');
    plat1.setScale(2,1).refreshBody();

    var plat2=platforms.create(600,350,'ground');
    plat2.setScale(2,1).refreshBody();

    var plat3=platforms.create(100,500,'ground');
    plat3.setScale(2,1).refreshBody();

    var plat4=platforms.create(600,650,'ground');
    plat4.setScale(2,1).refreshBody();

    var plat5=platforms.create(100,800,'ground');
    plat5.setScale(2,1).refreshBody();


    player=this.physics.add.sprite(100,850,'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create
    (
        {
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude',{start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        }
    );
    this.anims.create
    (
        {
            key: "turn",
            frames: [{key: 'dude' ,frame: 4}],
            frameRate: 20
        }
    );
    this.anims.create
    (
        {
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        }
    );
    this.physics.add.collider(player,platforms);

    cursors=this.input.keyboard.createCursorKeys();

    scoreText=this.add.text(16,16,'score: 0', {fontSize: '32px',fill: '#000'});

    bombs=this.physics.add.group();
    this.physics.add.collider(bombs,platforms);
    this.physics.add.collider(player,bombs,hitBomb,null,this);

    this.time.addEvent({ delay: 2000, callback: spawnBomb, callbackScope: this, loop: true });
}
function update()
{
    if(cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left',true);
    }
    else if(cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right',true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if(cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
	if(cursors.space.isDown)
	{
		spawnBomb();
	}
}
function spawnBomb()
{
    console.log(Phaser.Time.time);
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(0, 100, 'bomb');
    bomb.setBounce(0.9);
    bomb.setCollideWorldBounds(true);
    //bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.setVelocity(200,20);
}
function destroyBomb(bomb)
{
    bomb.destroy();
}
function hitBomb(player,bomb)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    scoreText.setText('Game Over');
}