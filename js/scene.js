var winSizeX;
var winSizeY;
var canPlay = true;

let arrPreloadMakanan = [];
let arrPreloadPelanggan = [];
var bubbleTeks;
var Teks;
var arrMakanan = [];

function rgbToHexColor(r, g, b) {
    // Pastikan nilai berada dalam rentang 0-255
    r = Phaser.Math.Clamp(r, 0, 255);
    g = Phaser.Math.Clamp(g, 0, 255);
    b = Phaser.Math.Clamp(b, 0, 255);

    // Gabungkan nilai RGB ke format hex seperti 0xffffff
    return (r << 16) + (g << 8) + b;
}

class SceneMenu extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: "SceneMenu",
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
        // Background.scale = 0.85;

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
        BtnPlay.on("pointerup", (pointer, object) => {
            this.scene.start("ScenePlay");
        });
    }

    update () {
        
    }
}

class ScenePlay extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: "ScenePlay",
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin',  sceneKey: 'spine' }
                ]
            }
        });
    }

    preload () {
        console.log("Scene | ScenePlay | preload");
        this.load.image("Warung", "assets/gfx/Warung.png");
        this.load.image("WarungB", "assets/gfx/WarungB.png");
        this.load.image("Etalase", "assets/gfx/Etalase.png");
        this.load.image("PakWarung", "assets/gfx/PakWarteg.png");
        for (let i = 1; i < 13; i++) {
            this.load.image("Makanan" + i, "assets/gfx/Makanan" + i + ".png");
            arrPreloadMakanan.push("Makanan" + i);
        }
        for (let i = 1; i < 10; i++) {
            this.load.image("Pelanggan" + i, "assets/gfx/Pelanggan" + i + ".png");
            arrPreloadPelanggan.push("Pelanggan" + i);
        }
    }
    
    create () {
        console.log("Scene | ScenePlay | create");
        winSizeX = game.config.width;
        winSizeY = game.config.height;
        
        let Warung = this.add.image(winSizeX / 2, winSizeY / 2, "Warung");
        let WarungB = this.add.image(winSizeX / 2, winSizeY / 2, "WarungB");
        Warung.scale = 0.85;
        WarungB.scale = 0.85;

        let Etalase = this.add.image(winSizeX / 2, winSizeY + Warung.getBounds().height / 2, "Etalase");
        Etalase.scale = 0.85;
        if (!canPlay) {
            Etalase.y = winSizeY / 2;
        }

        let countLytMkn = 0;
        let posX = winSizeX / 2 - 200;
        let posY = 400;
        for (let i = 0; i < arrPreloadMakanan.length; i++) {
            if (i % 3 == 0) {
                posY = 400 + 140 * countLytMkn;                    
                countLytMkn++;
            }
            if (i == 1 || i == 4 || i == 7 || i == 10) {
                posX = winSizeX / 2;
            } else if (i == 2 || i == 5 || i == 8 || i == 11) {
                posX = winSizeX / 2 + 200;
            } else {
                posX = winSizeX / 2 - 200;
            }
            const mkn = this.add.image(posX, posY, arrPreloadMakanan[i]).setScale(0.35);
            if (canPlay) {
                mkn.alpha = 0;
                mkn.scale = 0.1;
            }
            // mkn.setInteractive({ draggable: true });
            arrMakanan.push(mkn);
        }

        const animShowMakanan = () => {
            for (let i = 0; i < arrMakanan.length; i++) {
                this.tweens.add({
                    targets: arrMakanan[i],
                    alpha: 1,
                    scaleX: 0.3,
                    ease: "Elastic.easeInOut",
                    duration: 250,
                    delay: 35 * i,
                    onUpdate: () => {
                        this.tweens.add({
                            targets: arrMakanan[i],
                            scale: 0.35,
                            ease: "Sine.easeInOut",
                            duration: 150,
                        });
                    },
                    onComplete: () => {
                        if (i == arrMakanan.length - 1) {
                            createPelanggan(Phaser.Math.Between(1, arrPreloadPelanggan.length));
                        }
                    }
                });
            }
        };

        // Create pelanggan
        const createPelanggan = (randId) => {
            let pelanggan = this.add.image(winSizeX / 2, winSizeY / 2, "Pelanggan" + randId);
            pelanggan.setScale(0.7);
            pelanggan.setPosition(winSizeX - pelanggan.getBounds().width / 2, winSizeY - pelanggan.getBounds().height / 2);
            pelanggan.alpha = 0;
            this.tweens.add({
                targets: pelanggan,
                alpha: 1,
                duration: 200,
                ease: "Sine.easeSineOut"
            });
        };

        // Belum dipakai
        // this.input.on('dragstart', function (pointer, gameObject) {

        //     //  This will bring the selected gameObject to the top of the list
        //     this.children.bringToTop(gameObject);

        // }, this);

        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        //     gameObject.x = dragX;
        //     gameObject.y = dragY;

        // });

        if (canPlay) {
            // Karakter
            let charaPak = this.add.image(winSizeX / 2 - 200, winSizeY / 2 + 400, "PakWarung");
    
            // Anim Bapak masuk warung
            const animPak = this.tweens.chain({
                targets: charaPak,
                tweens: [
                    {
                        duration: 300,
                        y: charaPak.y - 50,
                        scale: 0.9,
                        onComplete: () => {
                            let textBuble = this.createSpeechBubble(charaPak.x + 50, charaPak.y - charaPak.getBounds().height / 2 - 50, 200, 100, 'Ayo Main!!!', true);
                        }
                    }
                ]
            });
    
            // Ganti gameplay
            this.time.delayedCall(1500, () => {
                this.tweens.add({
                    targets: [bubbleTeks, Teks],
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                    this.tweens.add({
                        targets: charaPak,
                        scale: 0.8,
                        y: charaPak.y - 50,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            this.tweens.add({
                                targets: WarungB,
                                alpha: 0,
                                duration: 500,
                                onComplete: () => {
                                    this.tweens.add({
                                        targets: Warung,
                                        y: Warung.y - Warung.getBounds().height,
                                        ease: "Sine.easeOut"
                                    });
                                    this.tweens.add({
                                        targets: Etalase,
                                        y: Etalase.y - Etalase.getBounds().height,
                                        ease: "Sine.easeOut",
                                        onComplete: () => {
                                            animShowMakanan();
                                        }
                                    });
                                }
                            });
                        }
                    });
                    }
                });
            });
        }
    }

    update () {

    }

    rgbToHex(r, g, b) {
        return (
            '#' +
            r.toString(16).padStart(2, '0') +
            g.toString(16).padStart(2, '0') +
            b.toString(16).padStart(2, '0')
        );
    }

    returnBuble(x, y, width, height)
    {        
        const bubbleWidth = width;
        const bubbleHeight = height;
        const bubblePadding = 10;
        const arrowHeight = bubbleHeight / 4;

        const bubble = this.add.graphics({ x: x, y: y });

        //  Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        const point1X = Math.floor(bubbleWidth / 7);
        const point1Y = bubbleHeight;
        const point2X = Math.floor((bubbleWidth / 7) * 2);
        const point2Y = bubbleHeight;
        const point3X = Math.floor(bubbleWidth / 7);
        const point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        bubble.lineStyle(4, 0x222222, 0.5);
        bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        bubble.lineStyle(2, 0x565656, 1);
        bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        return bubble;
    }

    returnText(quote, bubble, bubblePadding, bubbleWidth, bubbleHeight )
    {        
        const content = this.add.text(0, 0, quote, { fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
        content.setStroke(this.rgbToHex(41, 83, 51), 16).setShadow(2, 2, '#333333', 2, true, true);

        const b = content.getBounds();

        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

        return content;
    }

    createSpeechBubble (x, y, width, height, quote, anim)
    {
        // this.text3 = this.add.text(100, 400, 'The', { fontFamily: 'Arial Black', fontSize: 74, color: '#c51b7d' });
        // this.text3.setStroke('#de77ae', 16).setShadow(2, 2, '#333333', 2, true, true);

        const bubbleWidth = width;
        const bubbleHeight = height;
        const bubblePadding = 10;
        // const arrowHeight = bubbleHeight / 4;

        // const bubble = this.add.graphics({ x: x, y: y });
        const bubble = this.returnBuble(x, y, width, height);

        // //  Bubble shadow
        // bubble.fillStyle(0x222222, 0.5);
        // bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        // //  Bubble color
        // bubble.fillStyle(0xffffff, 1);

        // //  Bubble outline line style
        // bubble.lineStyle(4, 0x565656, 1);

        // //  Bubble shape and outline
        // bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        // bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        // //  Calculate arrow coordinates
        // const point1X = Math.floor(bubbleWidth / 7);
        // const point1Y = bubbleHeight;
        // const point2X = Math.floor((bubbleWidth / 7) * 2);
        // const point2Y = bubbleHeight;
        // const point3X = Math.floor(bubbleWidth / 7);
        // const point3Y = Math.floor(bubbleHeight + arrowHeight);

        // //  Bubble arrow shadow
        // bubble.lineStyle(4, 0x222222, 0.5);
        // bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        // //  Bubble arrow fill
        // bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        // bubble.lineStyle(2, 0x565656, 1);
        // bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        // bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        const content = this.returnText(quote, bubble, bubblePadding, bubbleWidth, bubbleHeight);
        // const content = this.add.text(0, 0, quote, { fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
        // content.setStroke(this.rgbToHex(41, 83, 51), 16).setShadow(2, 2, '#333333', 2, true, true);

        // const b = content.getBounds();

        // content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));

        if (anim) {
            bubbleTeks = bubble;
            Teks = content;

            bubble.alpha = 0;
            content.alpha = 0;

            this.tweens.add({
                targets: bubble,
                alpha: 1,
                duration: 200,
                onUpdate: () => {
                    this.tweens.add({
                        targets: bubble,
                        y: bubble.y - 10,
                        duration: 150,
                        yoyo: true,
                        onComplete: () => {
                            this.tweens.add({
                                targets: content,
                                y: content.y - 5,
                                alpha: 1,
                                duration: 250
                            });
                        }
                    });
                }
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'main',
        // width: 1024,
        // height: 768
        width: 720, // Lebar dasar yang cukup untuk potret (misalnya, resolusi HD vertikal)
        height: 1280, // Tinggi dasar yang cukup untuk potret
    },
    backgroundColor: '#ffffff',
    scene: [SceneMenu, ScenePlay],
    // scene: [ScenePlay],
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

