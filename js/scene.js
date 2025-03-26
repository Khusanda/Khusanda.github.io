var winSizeX;
var winSizeY;

var spnBoy;
var objMusuh;
var layerBlank;
var BtnPlay;
var alert;
var BGM;
var gameOver = false;
var state = "Opening";
var jump = false;

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
        this.load.audio("BGM", "assets/sfx/BGM.mp3");

        this.load.image("BG", "assets/gfx/Angkasa.jpg");
        this.load.image("Ufo", "assets/gfx/Ufo.png");
        this.load.image("ButtonPlay", "assets/gfx/ButtonPlay.png");

        this.load.setPath('assets/spine/');
        this.load.spine("spineBoy", "spineboy/spineboy.json", "spineboy/spineboy.atlas");
        this.load.spine("spineAlien", "alien/alien.json", "alien/alien.atlas");
    }

    create ()
    {
        winSizeX = game.config.width;
        winSizeY = game.config.height;

        BGM = this.sound.add("BGM", { loop: true });
        // BGM.play();
        
        // Membuat objek Graphics
        const graphics = this.add.graphics();

        // Membuat rectangle sebagai layer warna
        const colorLayer = this.add.rectangle(winSizeX / 2, winSizeY / 2, winSizeX, winSizeY, 0x000000, 0.5);
        colorLayer.setOrigin(0.5, 0.5);  // Menyusun rectangle di tengah layar
        colorLayer.setDepth(99);
        layerBlank = colorLayer;
        let ButtonPlay = this.add.image(winSizeX / 2, winSizeY / 2, "ButtonPlay");
        ButtonPlay.setScale(0.5);
        ButtonPlay.setDepth(99);
        BtnPlay = ButtonPlay;
        // let BG = this.add.image(winSizeX / 2, winSizeY / 2, "BG");

        spnBoy = this.add.spine(winSizeX / 2, winSizeY, 'spineBoy', 'idle', true);
        let szSpnBoy = spnBoy.getBounds();
        //  console.log(szSpnBoy.size);  // Pastikan objek sudah ter-render dengan benar
        spnBoy.setScale(0.3);
        spnBoy.setDepth(1);

         let bounds = spnBoy.getBounds();
        //  console.log(bounds);  // Pastikan objek sudah ter-render dengan benar
        //  console.log(bounds.size);  // Pastikan objek sudah ter-render dengan benar
        //  console.log(bounds.size.x);  // Pastikan objek sudah ter-render dengan benar
        spnBoy.x = bounds.size.x / 2 + 40;
        // spnBoy.setInteractive();
        // //  Toggle to view the hit area
        // this.input.enableDebug(spnBoy, 0xff00ff);
        this.physics.add.existing(spnBoy);
        // spnBoy.body.setOffset(0, 50);
        // spnBoy.body.setVelocity(100, 200);
        // spnBoy.body.setBounce(1, 1);
        spnBoy.body.setCollideWorldBounds(true);
        // Mengecilkan area fisika dari spnBoy        
        spnBoy.body.setSize(szSpnBoy.size.x - 200, szSpnBoy.size.y - 100); // Mengubah ukuran body fisika menjadi 40x60 (mengurangi area fisika)
        
        // // Pastikan objek masih bisa bergerak
        // spnBoy.body.setOffset(10, 10); // Menyesuaikan offset untuk penempatan ulang pusat objek fisika jika diperlukan
        

        // Mengatur warna garis
        graphics.lineStyle(10, 0x000000, 1);  // Ketebalan garis = 4px, warna merah (0xff0000), opasitas = 1
        // Menggambar garis dari titik (x1, y1) ke titik (x2, y2)
        graphics.beginPath();
        graphics.moveTo(0, spnBoy.y);  // Titik awal (x1, y1)
        graphics.lineTo(winSizeX, spnBoy.y);  // Titik akhir (x2, y2)
        graphics.strokePath();      // Menggambar garis

        
        let thiz = this;
        let szObjMusuh;
        function createMusuh() {
            let randMusuh  = Phaser.Math.Between(1, 2);
            // randMusuh = 1;
            if (randMusuh == 1) {
                let sprUfo = thiz.add.image(winSizeX + 100, winSizeY - bounds.size.y / 2, "Ufo");
                sprUfo.setScale(0.6);
                objMusuh = sprUfo;
                objMusuh.setName("Ufo");
                szObjMusuh = objMusuh.getBounds();
                
                thiz.tweens.add({
                    targets: sprUfo,
                    x: -sprUfo.getBounds().width / 2,
                    duration: Phaser.Math.Between(1800, 2800),
                    delay: Phaser.Math.Between(1000, 4000),
                    onComplete: () => {
                        sprUfo.destroy();
                        createMusuh();
                    },
                });
            }
            else {
                let spnAlien = thiz.add.spine(winSizeX / 2, winSizeY, "spineAlien", "run", true);
                szObjMusuh = spnAlien.getBounds();
                spnAlien.setScale(-0.3, 0.3);
                let szAlien = spnAlien.getBounds().size;
                spnAlien.x = winSizeX + szAlien.x;
                objMusuh = spnAlien;
                objMusuh.setName("Alien");

                thiz.tweens.add({
                    targets: spnAlien,
                    x: -szAlien.x / 2,
                    duration: Phaser.Math.Between(1800, 2800),
                    delay: Phaser.Math.Between(1000, 4000),
                    onComplete: () => {
                        spnAlien.destroy();
                        createMusuh();
                    },
                });
            }

            if (objMusuh) {
                let szWidth = szObjMusuh.width; 
                let szHeight = szObjMusuh.height;
                if (objMusuh.name == "Alien") {
                    szWidth = szObjMusuh.size.x; 
                    szHeight = szObjMusuh.size.y;
                } 
                // console.log(szObjMusuh);
                // console.log(szWidth);
                // console.log(szHeight);
                
                
                thiz.physics.add.existing(objMusuh);
                objMusuh.body.setSize(szWidth, szHeight);
                if (objMusuh.name == "Alien") {
                    objMusuh.body.setOffset(szWidth, 0); // Menyesuaikan offset untuk penempatan ulang pusat objek fisika jika diperlukan
                }
                // objMusuh.body.setOffset(0, 50);
                // objMusuh.body.setVelocity(100, 200);
                // objMusuh.body.setBounce(1, 1);
                // objMusuh.body.setCollideWorldBounds(true);
            }
        }
        // createMusuh();
        
        //posY = 400
        let text1 = this.add.text(winSizeX / 2, 0, 'BUKBER ALERT!').setFontFamily('Arial Black').setFontSize(64).setColor('#ffffff');
        text1.setFontStyle("bold");
        text1.y = text1.getBounds().height;
        text1.setOrigin(0.5, 0.5);
        // text1.setBackgroundColor('#ff0000')
        text1.setStroke('#ff0000', 16)
        text1.y = -400;
        text1.setPadding(16);
        alert = text1;

        // Simple Sentence with punctuation.
        const str1 = 'اٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ';
        const str2 = 'اوَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ';
        let salam = this.add.text(winSizeX / 2, 200, str1, { fontFamily: 'Arial', fontSize: 32, color: '#000000', rtl: true });
        let salam2 = this.add.text(winSizeX / 2, 200, str1, { fontFamily: 'Arial', fontSize: 32, color: '#000000', rtl: true });
        salam.setOrigin(0.5, 0.5);
        salam2.setOrigin(0.5, 0.5);

        let mukadimah = this.make.text({
            x: winSizeX / 2,
            y: 240,
            // text: 'Dalam rangka mempererat tali silaturahmi di bulan suci Ramadhan, kami bermaksud mengundang Saudara/i untuk menghadiri acara buka puasa bersama yang akan diselenggarakan pada:',
            // text: 'Bulan Ramadhan udah tiba, yuk kita manfaatin momen ini buat silaturahmi bareng! Untuk itu, kami mau ngajakin kalian buat ikut acara buka puasa bersama:',
            text: 'Ramadhan itu tentang kebersamaan, kehangatan, dan berbagi kebahagiaan! 🥰 Karena itu, kami ngajak kamu buat gabung di acara Buka Puasa Bersama yang pastinya bakal seru banget!',
            origin: { x: 0.5, y: 0 },
            style: {
                font: 'bold 18px Arial',
                fill: 'black',
                wordWrap: { width: winSizeX - 200 }
            }
        });

        let isi = this.make.text({
            x: mukadimah.x - mukadimah.getBounds().width / 2,
            y: mukadimah.y + mukadimah.getBounds().height + 20,
            text: '📅 Hari/Tanggal : Sabtu, 29 Maret 2025\n⏰ Waktu : 17.00 WIB-Selesai\n🏠 Tempat : Rumah masing-masing',
            origin: { x: 0, y: 0 },
            style: {
                font: 'bold 18px Arial',
                fill: 'black',
                wordWrap: { width: winSizeX - 200 }
            }
        });

        let akhir = this.make.text({
            x: mukadimah.x - mukadimah.getBounds().width / 2,
            y: isi.y + isi.getBounds().height + 20,
            text: 'Diharapkan membawa uang masing-masing sebanyak mungkin untuk membayar makanan ya guys ya. Sekian, love you all ❤️❤️❤️',
            origin: { x: 0, y: 0 },
            style: {
                font: 'bold 18px Arial',
                fill: 'black',
                wordWrap: { width: winSizeX - 200 }
            }
        });

        salam2.y = akhir.y + akhir.getBounds().height + 40;

        salam.setAlpha(0);
        mukadimah.setAlpha(0);
        isi.setAlpha(0);
        akhir.setAlpha(0);
        salam2.setAlpha(0);

        salam.setScale(0.5);
        mukadimah.setScale(0.5);
        isi.setScale(0.5);
        akhir.setScale(0.5);
        salam2.setScale(0.5);

        // untuk play awal
        ButtonPlay.setInteractive();
        // ButtonPlay.on('pointerdown', function ()
        // {

        // });

        ButtonPlay.on('pointerover', function (event)
        {
            ButtonPlay.setScale(0.45);
            ButtonPlay.setTint(0x808080);
        });
        
        ButtonPlay.on('pointerout', function (event)
        {
            ButtonPlay.setScale(0.5);
            ButtonPlay.clearTint();  // Menghapus tint dan kembali ke warna asli
        });

        ButtonPlay.on('pointerup', () =>
        {
            if (state == "Opening") {
                if (BGM && !BGM.isPlaying) {
                    BGM.play();
                }
                state = "Play";
                ButtonPlay.disableInteractive();
                ButtonPlay.clearTint();  // Menghapus tint dan kembali ke warna asli
                this.tweens.add({
                    targets: colorLayer,
                    y: colorLayer.y - winSizeY,
                    duration: 400,
                });
                this.tweens.chain({
                    targets: ButtonPlay,
                    tweens: [
                        {
                            scale: 0.55,
                            duration: 200,
                            ease: "back",
                        },
                        {
                            scale: 0,
                            angle: 360,
                            duration: 200,
                            ease: "back.in",
                        }
                    ],
                    onComplete: () => {
                        spnBoy.state.setAnimation(0, "run", true);
                        createMusuh();
                    }
                });
                this.time.delayedCall(200, () => {
                    this.tweens.add({
                        targets: text1,
                        y: 100,
                        delay: 200,
                        ease: "back.out",
                        onComplete: () => {
                            this.tweens.chain({
                                targets: text1,
                                tweens: [
                                    {
                                        scale: 1.2,
                                        duration: 800,
                                        ease: "sine.inout",
                                    },
                                    {
                                        scale: 1,
                                        duration: 800,
                                        ease: "sine.inout",
                                    }
                                ],
                                repeat: -1
                            });
                        }
                    });

                    this.tweens.add({
                        targets: salam,
                        alpha: 1,
                        scale: 1,
                        duration: 200,
                        delay: 900,
                        ease: "back.out",
                    });

                    this.tweens.add({
                        targets: mukadimah,
                        alpha: 1,
                        scale: 1,
                        duration: 200,
                        delay: 900 + 400,
                        ease: "back.out",
                    });

                    this.tweens.add({
                        targets: isi,
                        alpha: 1,
                        scale: 1,
                        duration: 200,
                        delay: 900 + 400 + 400,
                        ease: "back.out",
                    });

                    this.tweens.add({
                        targets: akhir,
                        alpha: 1,
                        scale: 1,
                        duration: 200,
                        delay: 900 + 400 + 400 + 400,
                        ease: "back.out",
                    });

                    this.tweens.add({
                        targets: salam2,
                        alpha: 1,
                        scale: 1,
                        duration: 200,
                        delay: 900 + 400 + 400 + 400 + 400,
                        ease: "back.out",
                    });
                });
            }
        });

        // untuk klik
        this.input.on('pointerdown', () =>
        {
            if (gameOver || state == "Opening") {
                return;
            }
            if (spnBoy && jump == false) {
                spnBoy.state.setAnimation(0, "jump", false);
                // spnBoy.state.addAnimation(0, "run", true);
                if (objMusuh) {
                    let szWidth = szObjMusuh.width; 
                    let szHeight = szObjMusuh.height;
                    if (objMusuh.name == "Alien") {
                        szWidth = szObjMusuh.size.x; 
                        szHeight = szObjMusuh.size.y;
                    }
                    // jump = true;
                    this.time.delayedCall(300, () => {
                        // console.log("delay");
                        jump = true;
                    });
                    this.tweens.add({
                        targets: spnBoy,
                        y: spnBoy.y - (180 + 80),
                        duration: 600,
                        yoyo: true,
                        repeat: 0,
                        ease: "sine.inout",
                        onComplete: () => {
                            jump = false;
                            spnBoy.state.setAnimation(0, "run", true);
                        }
                    });
                }
            }
        });
    }

    update () {
        if (spnBoy && objMusuh) {
            this.physics.add.collider(spnBoy, objMusuh, function () {
                if (gameOver == false && jump == false) {
                    // console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
                    gameOver = true;
                    spnBoy.state.setAnimation(0, "death", false);
                    this.tweens.killTweensOf(spnBoy);
                    this.tweens.add({
                        targets: spnBoy,
                        y: winSizeY,
                        duration: 400,
                        ease: "sine.in"
                    });
                    this.tweens.killTweensOf(objMusuh);
                    if (objMusuh.name == "Alien") {
                        objMusuh.state.setAnimation(0, "death", false);
                    }

                    this.time.delayedCall(2000, () => {
                        if (layerBlank && BtnPlay) {
                            this.tweens.add({
                                targets: layerBlank,
                                y: layerBlank.y + winSizeY,
                                duration: 400,
                            });
                            
                            this.tweens.chain({
                                targets: BtnPlay,
                                tweens: [
                                    {
                                        scale: 0.5,
                                        angle: 360,
                                        duration: 300,
                                        ease: "back.in",
                                    },
                                    {
                                        // scale: 0,
                                        // angle: 360,
                                        // duration: 200,
                                        // ease: "back.in",
                                    }
                                ],
                                onComplete: () => {
                                    state = "Opening"
                                    if (BGM && BGM.isPlaying) {
                                        BGM.stop();
                                    }
                                    gameOver = false;
                                    jump = false;
                                    if (alert) {
                                        alert.setScale(1)
                                        this.tweens.killTweensOf(alert);
                                    }
                                    objMusuh.destroy();
                                    // spnBoy.state.setAnimation(0, "run", true);
                                    // createMusuh();
                                    BtnPlay.setInteractive();
                                }
                            });
                        }
                    });
                }
            }, null, this);
        }
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

