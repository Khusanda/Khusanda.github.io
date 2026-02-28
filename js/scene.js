var winSizeX;
var winSizeY;
var canPlay = true;

let arrPreloadMakanan = [];
let arrPreloadPelanggan = [];
var bubbleTeks;
var Teks;
var arrMakanan = [];
var arrDataPelanggan = [];

var tbPathKey = [];
var tbKeyChoose = [];

var freeze = true;
var canDrag = false;
var getKey = false;
var done = false;


function rgbToHexColor(r, g, b) {
    // Pastikan nilai berada dalam rentang 0-255
    r = Phaser.Math.Clamp(r, 0, 255);
    g = Phaser.Math.Clamp(g, 0, 255);
    b = Phaser.Math.Clamp(b, 0, 255);

    // Gabungkan nilai RGB ke format hex seperti 0xffffff
    return (r << 16) + (g << 8) + b;
}

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloadScene',
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin',  sceneKey: 'spine' }
                ]
            }
        });
    }

    preload() {
        // Background dari progress bar
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;

        // Gambar kotak latar
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // Teks loading
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5);

        // Teks persen
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffcc00'
            }
        }).setOrigin(0.5);

        // Event saat progress berubah
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        // Event saat file berhasil dimuat (opsional)
        this.load.on('fileprogress', (file) => {
            console.log('Loading asset: ' + file.key);
        });

        // Event saat semua selesai
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // --- Load asset di sini ---
        // SceneMenu
        this.load.image("Background", "assets/gfx/Background.png");
        this.load.image("Background1", "assets/gfx/Background1.png");
        this.load.image("Title", "assets/gfx/Title.png");
        this.load.image("ButtonPlay", "assets/gfx/ButtonPlay.png");
        // ScenePlay
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

    create() {
        // Masuk ke scene utama setelah preload
        this.scene.start('SceneMenu');
    }
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
        // this.load.image("Background", "assets/gfx/Background.png");
        // this.load.image("Background1", "assets/gfx/Background1.png");
        // this.load.image("Title", "assets/gfx/Title.png");
        // this.load.image("ButtonPlay", "assets/gfx/ButtonPlay.png");
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
        // Untuk preload asset agar bisa digunakan
        // console.log("Scene | ScenePlay | preload");
        this.load.image("Flat", "assets/gfx/Flat.png");
        this.load.image("BgWhite", "assets/gfx/BgWhite.png");
        this.load.image("Kucing", "assets/gfx/Kucing.png");
        this.load.image("PintuTutup", "assets/gfx/PintuTutup.png");
        this.load.image("PintuBuka", "assets/gfx/PintuBuka.png");
        this.load.image("PintuBuka1", "assets/gfx/PintuBuka1.png");
        this.load.image("PintuBuka2", "assets/gfx/PintuBuka2.png");
        this.load.image("Key", "assets/gfx/Key.png");
        this.load.image("Key1", "assets/gfx/Key1.png");
        this.load.image("Key2", "assets/gfx/Key2.png");
        this.load.image("Key3", "assets/gfx/Key3.png");
        this.load.image("Key4", "assets/gfx/Key4.png");
        tbPathKey.push("Key");
        tbPathKey.push("Key1");
        tbPathKey.push("Key2");
        tbPathKey.push("Key3");
        tbPathKey.push("Key4");
        // this.load.image("Etalase", "assets/gfx/Etalase.png");
        // this.load.image("PakWarung", "assets/gfx/PakWarteg.png");
        // for (let i = 1; i < 13; i++) {
        //     this.load.image("Makanan" + i, "assets/gfx/Makanan" + i + ".png");
        //     arrPreloadMakanan.push("Makanan" + i);
        // }
        // for (let i = 1; i < 10; i++) {
        //     this.load.image("Pelanggan" + i, "assets/gfx/Pelanggan" + i + ".png");
        //     arrPreloadPelanggan.push("Pelanggan" + i);
        // }
    }
    
    create () {
        console.log("Scene | ScenePlay | create");
        // winSizeX = game.config.width;
        // winSizeY = game.config.height;
        winSizeX = this.scale.width;
        winSizeY = this.scale.height;
        console.log("Scene | ScenePlay | winSizeX: ", winSizeX);
        console.log("Scene | ScenePlay | winSizeY: ", winSizeY);
        // console.log(Phaser.Math.Between(0, winSizeX));

        let layer = this.add.layer();
        let splat = this.make.image({ x: winSizeX / 2, y: winSizeY / 2, key: 'Flat' }, false);
        splat.scale = 5;//0.6;
        splat.setInteractive();
        // let splatBlur = splat.preFX.addBlur();
        // splatBlur.strength = 0; // 0 - 1
        let mask = splat.createBitmapMask();
        layer.setMask(mask);
        let rectSplat = layer.add(this.add.rectangle(splat.x, splat.y, (splat.width * 0.6) / 2 - 40, (splat.height * 0.6) / 2 - 40, rgbToHexColor(255, 0, 0)));
        rectSplat.alpha = 0;
        // rectSplat.depth = 1;

        // Membuat persegi panjang hitam seukuran layar
        // argumen: x, y, lebar, tinggi, warna, alpha (transparansi)
        let bgBlack = this.add.rectangle(winSizeX / 2, winSizeY / 2, winSizeX, winSizeY, 0x000000);
        let lblQuest = this.add.text(winSizeX / 2, winSizeY / 2, 'find the key\nand\nthe way out', { fontFamily: 'roadside', fontSize: '48px', fill: '#00ff00', align: 'center' }).setOrigin(0.5);
        var rndKey = Phaser.Math.Between(0, (tbPathKey.length - 1));
        // --- MENGGUNAKAN PHASER GRAPHICS ---
        // 1. Buat objek Graphics
        let graphics = this.add.graphics();
        // 2. Tentukan gaya isi (fillStyle)
        // argumen: warna (hex), opasitas (0-1)
        graphics.fillStyle(0xff0000, 1); // Warna merah penuh
        // 3. Tentukan gaya garis tepi (lineStyle) - Opsional
        // argumen: ketebalan, warna, opasitas
        graphics.lineStyle(4, 0xffffff, 1); // Garis tepi putih 4px
        // 4. Gambar lingkaran
        // argumen: x, y, radius (jari-jari)
        // x dan y di sini adalah titik PUSAT lingkaran
        graphics.fillCircle(winSizeX / 2, winSizeY / 2, 100); // Isi merah
        graphics.strokeCircle(winSizeX / 2, winSizeY / 2, 100); // Garis tepi putih
        let KeyClue = this.add.image(winSizeX / 2, winSizeY / 2, tbPathKey[rndKey]);
        graphics.alpha = 0;
        KeyClue.alpha = 0;
        console.log(rndKey);
        this.time.delayedCall(1500, () => {
            this.tweens.add({
                targets: lblQuest,
                alpha: 0,
                duration: 350,
                onComplete: () => {
                    this.tweens.add({
                        targets: [graphics, KeyClue],
                        alpha: 1,
                        duration: 350,
                        onComplete: () => {
                            this.time.delayedCall(1000, () => {
                                this.tweens.add({
                                    targets: [graphics, KeyClue],
                                    alpha: 0,
                                    duration: 350,
                                    onComplete: () => {
                                        this.tweens.add({
                                            targets: bgBlack,
                                            alpha: 0,
                                            duration: 500,
                                        });
                                        this.tweens.add({
                                            targets: splat,
                                            scale: 0.6,
                                            duration: 150,
                                            onComplete: () => {
                                                freeze = false;
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
        
        // // Set origin ke 0,0 agar koordinat dimulai dari pojok kiri atas
        // this.bgBlack.setOrigin(0, 0);
        // // Jika ingin membuatnya transparan (misal untuk overlay menu)
        // bg.setAlpha(0.7);
        // // Opsional: Jika ingin layer ini selalu di depan, atur Depth-nya
        // bg.setDepth(100);
        
        // this.text = this.add.text(winSizeX / 2, winSizeY / 2, 'Please set your\nphone to landscape', { fontFamily: 'roadside', fontSize: '48px', fill: '#00ff00', align: 'center' }).setOrigin(0.5);
        this.checkOriention(this.scale.orientation);

        // const pic = this.add.image(winSizeX / 2, winSizeX / 2, "WarungB");
        // // const fx = pic.preFX.addDisplacement('Kucing', -0.3, 0);
        // pic.preFX.addCircle(8, 0x2d2d2d);

        let BgWhite = layer.add(this.add.image(winSizeX / 2, winSizeY / 2, "BgWhite"));
        BgWhite.scale = 2;
        // BgWhite.alpha = 0;

        let Key = layer.add(this.add.image(winSizeX / 2, winSizeY / 2, "Key"));
        Key.setInteractive();
        tbKeyChoose.push(Key);
        for (let i = 1; i < 5; i++) {
            let KeyChoose = layer.add(this.add.image(winSizeX / 2, winSizeY / 2, "Key" + i));
            KeyChoose.x = Phaser.Math.Between(KeyChoose.width / 2, winSizeX - KeyChoose.width / 2);
            KeyChoose.y = Phaser.Math.Between(KeyChoose.height / 2, winSizeY - KeyChoose.width / 2);
            tbKeyChoose.push(KeyChoose);
        }
        
        let PintuTutup = layer.add(this.add.image(winSizeX, winSizeY, "PintuTutup"));
        // let PintuBuka = layer.add(this.add.image(winSizeX, winSizeY, "PintuBuka"));
        let PintuBuka1 = layer.add(this.add.image(winSizeX, winSizeY, "PintuBuka1"));
        let PintuBuka2 = layer.add(this.add.image(winSizeX, winSizeY, "PintuBuka2"));
        PintuTutup.setInteractive();
        // PintuBuka.setVisible(false);
        PintuBuka1.setVisible(false);
        PintuBuka2.setVisible(false);
        const tbPosPintu = [
            { x: PintuTutup.width / 2 - 5, y: PintuTutup.height / 2 },
            { x: PintuTutup.width / 2 - 5, y: winSizeY - PintuTutup.height / 2 },
            { x: winSizeX - PintuTutup.width / 2 + 5, y: PintuTutup.height / 2 },
            { x: winSizeX - PintuTutup.width / 2 + 5, y: winSizeY - PintuTutup.height / 2 },
        ];
        const rndIdPos = Phaser.Math.Between(0, (tbPosPintu.length - 1));
        PintuTutup.x = tbPosPintu[rndIdPos].x;
        PintuTutup.y = tbPosPintu[rndIdPos].y;
        // PintuBuka.x = PintuTutup.x;
        // PintuBuka.y = PintuTutup.y;
        PintuBuka1.x = PintuTutup.x;
        PintuBuka1.y = PintuTutup.y;
        PintuBuka2.x = PintuTutup.x;
        PintuBuka2.y = PintuTutup.y;
        Key.x = Phaser.Math.Between(Key.width / 2, winSizeX - Key.width / 2);
        Key.y = Phaser.Math.Between(Key.height / 2, winSizeY - Key.width / 2);
        for (let i = 0; i < tbKeyChoose.length; i++) {
            tbKeyChoose[i].tag = i;
            if (Phaser.Geom.Intersects.RectangleToRectangle(PintuTutup.getBounds(), tbKeyChoose[i].getBounds())) {
                console.log("waw");
                while ((Phaser.Geom.Intersects.RectangleToRectangle(PintuTutup.getBounds(), tbKeyChoose[i].getBounds()))) {
                    tbKeyChoose[i].x = Phaser.Math.Between(tbKeyChoose[i].width / 2, winSizeX - tbKeyChoose[i].width / 2);
                    tbKeyChoose[i].y = Phaser.Math.Between(tbKeyChoose[i].height / 2, winSizeY - tbKeyChoose[i].width / 2);
                    console.log("while");
                }
            }
        }
        PintuBuka1.depth = (PintuBuka1.x > winSizeX / 2) ? 0 : 1;
        PintuBuka2.depth = (PintuBuka1.x > winSizeX / 2) ? 1 : 0;

        // const fx = BgWhite.preFX.addVignette();
        // fx.radius = 0.2;
        // fx.radius = Phaser.Math.Clamp(fx.radius, 0, 1);
        // fx.strength = 0.5;
        
        // let camera = this.cameras.main;
        // let highlightCat = camera.postFX.addVignette(0.5, 0.5, 0.2);
        
        let Kucing = layer.add(this.add.image(winSizeX / 2, winSizeY / 2, "Kucing"));
        Kucing.setOrigin(0.5);
        Kucing.scale = 0.23;
        Kucing.setInteractive();
        Kucing.setFlipX((PintuBuka1.x < winSizeX / 2));
        Kucing.x = (PintuBuka1.x > winSizeX / 2) ? PintuBuka1.x - 50 : PintuBuka1.x + 50;
        Kucing.y = PintuBuka1.y + PintuBuka1.height / 2 - Kucing.getBounds().height / 2 - 10;
        Kucing.alpha = 0;

        this.input.on('pointerdown', (pointer) =>
        {
            if (freeze) return;

            if (!getKey) {
                for (let i = 0; i < tbKeyChoose.length; i++) {
                    if (Phaser.Geom.Intersects.RectangleToRectangle(rectSplat.getBounds(), tbKeyChoose[i].getBounds()) && rndKey == i) {
                        console.log("Scene | ScenePlay | Key.on | pointerdown | Kena KEY");
                        getKey = true;
                        tbKeyChoose[i].alpha = 0;
                        break;
                    }
                }
            }
            else if (getKey)
            {
                console.log(getKey);
                if (Phaser.Geom.Intersects.RectangleToRectangle(rectSplat.getBounds(), PintuTutup.getBounds()) && !done) {
                    console.log("Scene | ScenePlay | Move | pointermove | Kena PINTU TUTUP");
                    done = true;

                    for (let i = 0; i < tbKeyChoose.length; i++) {
                        tbKeyChoose[i].alpha = 0;
                    }

                    PintuTutup.alpha = 0;
                    PintuBuka1.setVisible(true);
                    PintuBuka2.setVisible(true);

                    Kucing.alpha = 1;
                    this.tweens.add({
                        targets: Kucing,
                        x: Kucing.flipX ? (-Kucing.getBounds().width / 2) : (winSizeX + Kucing.getBounds().width / 2),
                        duration: 1000,
                    });
                    
                    splat.x = Kucing.x;
                    splat.y = Kucing.y;

                    layer.clearMask();
                }
            }
        });
        splat.on('pointerdown', function (pointer)
        {
            if (freeze) return;

            // Klik kucing
            console.log("Scene | ScenePlay | Klik | pointerdown");
            if (done) {
                return;
            }

            canDrag = true;
        });
        this.input.on('pointermove', function (pointer)
        {
            if (freeze) return;

            // Move
            if (done) {
                return;
            }
            
            if (canDrag) {
                // console.log("Scene | ScenePlay | Move | pointermove");
                splat.x = pointer.x;
                splat.y = pointer.y;
                rectSplat.x = splat.x;
                rectSplat.y = splat.y;
            }
        })
        this.input.on('pointerup', function ()
        {
            if (freeze) return;

            // Ended or Realese Klik
            if (canDrag) {
                // console.log("Scene | ScenePlay | Ended | pointerup");
                canDrag = false;
            }
        });
    }
    
    checkOriention (orientation) {
        // winSizeX = (orientation === Phaser.Scale.LANDSCAPE) ? 1280 : 720;
        // winSizeY = (orientation === Phaser.Scale.LANDSCAPE) ? 720 : 1280;

        // 1. Ubah ukuran canvas game
        // this.scale.resize(winSizeX, winSizeY);

        // 2. Update posisi gambar Kucing agar tetap di tengah
        if (this.Kucing) {
            this.Kucing.setPosition(winSizeX / 2, winSizeY / 2);
        }

        // 3. Update background hitam
        // if (this.bgBlack) {
        //     this.bgBlack.setSize(winSizeX, winSizeY);
        //     this.bgBlack.updateDisplayOrigin();
        // }

        if (orientation === Phaser.Scale.PORTRAIT) {
            if (this.text) this.text.setVisible(true);
        }
        else if (orientation === Phaser.Scale.LANDSCAPE) {
            if (this.text) this.text.setVisible(false);
        }
    }

    update () {

    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'main',
        // width: 1024,
        // height: 768
        // width: 720, // Lebar dasar yang cukup untuk potret (misalnya, resolusi HD vertikal)
        // height: 1280, // Tinggi dasar yang cukup untuk potret
        width: 0, // Lebar dasar yang cukup untuk potret (misalnya, resolusi HD vertikal)
        height: 0, // Tinggi dasar yang cukup untuk potret
    },
    backgroundColor: '#000000ff',
    // scene: [PreloadScene, SceneMenu, ScenePlay],
    scene: [ScenePlay],
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

