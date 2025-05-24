var winSizeX;
var winSizeY;

function rgbToHexColor(r, g, b) {
    // Pastikan nilai berada dalam rentang 0-255
    r = Phaser.Math.Clamp(r, 0, 255);
    g = Phaser.Math.Clamp(g, 0, 255);
    b = Phaser.Math.Clamp(b, 0, 255);

    // Gabungkan nilai RGB ke format hex seperti 0xffffff
    return (r << 16) + (g << 8) + b;
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: "scene",
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin',  sceneKey: 'spine' }
                ]
            }
        });
    }

    preload ()
    {
        this.load.image("Background", "assets/gfx/Background.png");
        this.load.image("Background1", "assets/gfx/Background1.png");
        this.load.image("Title", "assets/gfx/Title.png");
        this.load.image("ButtonPlay", "assets/gfx/ButtonPlay.png");
    }

    create ()
    {
        winSizeX = game.config.width;
        winSizeY = game.config.height;

        let Background = this.add.image(winSizeX / 2, winSizeY / 2, "Background1");
        Background.scale = 0.85;

        let sprTitle = this.add.sprite(winSizeX / 2, winSizeY / 2 - 200, "Title");
        sprTitle.scale = 0.5;

        let BtnPlay = this.add.sprite(winSizeX / 2, winSizeY / 2 + 200, "ButtonPlay");
        BtnPlay.scale = 0.16;
        BtnPlay.setInteractive();

        // touch event
        BtnPlay.on("pointerover", (pointer, object) => {
            BtnPlay.setTint(rgbToHexColor(120, 120, 120));
        });
        BtnPlay.on("pointerout", (pointer, object) => {
            BtnPlay.setTint(rgbToHexColor(255, 255, 255));
        });
    }

    update () {
        
    }
}

const config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'main',
        width: 1024,
        height: 768
    },
    backgroundColor: '#ffffff',
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    plugins: {
		scene: [
			{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
		]
	}
};

const game = new Phaser.Game(config);

