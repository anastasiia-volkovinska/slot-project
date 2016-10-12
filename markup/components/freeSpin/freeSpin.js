import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { balance } from 'components/balance/balance';
import { parameters } from 'components/balance/parameters';
import { roll } from 'components/roll/roll';
import { drawFreeSpinsBG,
        drawTableContainer,
        drawMultiContainer} from 'components/freeSpin/drawFSbg';

// /* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable no-use-before-define */
export let config;
export let freeSpin = (function () {
    const c = createjs;
    let stage;
    let currentFreeSpins;
    let fsWheels;
    let fsStartData;
    let fsTotalWin;
    let counter = 0;

    const defaultConfig = {
        currentMulti: 2,
        currentLevel: 0,
        currentCount: 15,
        currentWinCoins: 0,
        currentWinCents: 0
    };

    let mainContainer;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function changeMultiplier(multi) {

        let fsMultiContainer;
        if (storage.read('device') === 'mobile') {
            fsMultiContainer = stage.getChildByName('fsMultiContainer');
        }

        if (storage.read('device') === 'desktop') {
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            fsMultiContainer = controlsContainerFS.getChildByName('fsMultiContainer');
        }
        const fsMulti4 = fsMultiContainer.getChildByName('fsMulti4');
        const fsMulti6 = fsMultiContainer.getChildByName('fsMulti6');
        const fsMulti8 = fsMultiContainer.getChildByName('fsMulti8');
        const bottle4 = fsMultiContainer.getChildByName('bottle4');
        const bottle6 = fsMultiContainer.getChildByName('bottle6');
        const bottle8 = fsMultiContainer.getChildByName('bottle8');
        const shadow4 = fsMultiContainer.getChildByName('shadow4');
        const shadow6 = fsMultiContainer.getChildByName('shadow6');
        const shadow8 = fsMultiContainer.getChildByName('shadow8');

        console.log('multi', multi);
        if (multi == 4) {
            showPritsel(bottle4, shadow4);
            bottle4.on('animationend', function () {
                fsMulti4.visible = true;
                bottle4.gotoAndStop(14);
            });
        } else if (multi == 6) {
            showPritsel(bottle6, shadow6);
            bottle6.on('animationend', function () {
                fsMulti6.visible = true;
                bottle6.gotoAndStop(14);
            });
        } else if (multi == 8) {
            showPritsel(bottle8, shadow8);
            bottle8.on('animationend', function () {
                fsMulti8.visible = true;
                bottle8.gotoAndStop(14);
            });
        }
    }

    function addSomeBangs(bottle) {
        const loader = storage.read('loadResult');
        let fsMultiContainer;
        if (storage.read('device') === 'mobile') {
            fsMultiContainer = stage.getChildByName('fsMultiContainer');
        }

        if (storage.read('device') === 'desktop') {
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            fsMultiContainer = controlsContainerFS.getChildByName('fsMultiContainer');
        }
        let x = bottle.x;
        let y = bottle.y;
        const bang = new c.Sprite(loader.getResult('addedElements'), 'bangBottle').set({
            name: 'bang',
            scaleX: 0.3,
            scaleY: 0.3
        });
        utils.getCenterPoint(bang);
        for (let i = 0; i < 5; i++) {
            let newBang = bang.clone();
            newBang.x = x + Math.random() * 30;
            newBang.y = y + Math.random() * 30;
            newBang.skewY = Math.random() * 180;
            fsMultiContainer.addChild(newBang);
            newBang.play();
            // console.log('newBang', newBang);
            // console.log('fsMultiContainer', fsMultiContainer);
            newBang.on('animationend', function () {
                fsMultiContainer.removeChild(newBang);
            });
        }
    }

    function rotateFSGun(count) {
        // console.log('i am in rotateFSGun');
        let main = storage.read('stage').getChildByName('mainContainer');
        // console.log('mainContainer', main);
        let fsTableContainer;
        if (storage.read('device') === 'mobile') {
            fsTableContainer = stage.getChildByName('fsTableContainer');
        }
        if (storage.read('device') === 'desktop') {
            const controlsContainerFS = main.getChildByName('controlsContainerFS');
            fsTableContainer = controlsContainerFS.getChildByName('fsTableContainer');
        }
        const baraban = fsTableContainer.getChildByName('baraban');


        if (count) {
            console.error('count is:', count);
            counter = count % 6;
            baraban.gotoAndStop('b' + counter);
        } else {
            counter++;
        }
        console.warn('counter', counter);

        const bullet = fsTableContainer.getChildByName('bullet');
        bullet.gotoAndPlay('11-w');
        bullet.on('animationend', function () {
            bullet.gotoAndStop(199);
            baraban.gotoAndStop('barRoll');
            utils.getCenterPoint(baraban);
            setTimeout( function () {
                baraban.gotoAndStop('b' + counter);
                console.warn('baraban', baraban.currentFrame);
                if (counter === 6) {
                    baraban.gotoAndStop('b6');
                    let scaleX;
                    let scaleY;
                    if (storage.read('device') === 'mobile') {
                        scaleX = 0.3;
                        scaleY = 0.3;
                    }
                    if (storage.read('device') === 'desktop') {
                        scaleX = 0.25;
                        scaleY = 0.25;
                    }
                    TweenMax.fromTo(baraban, 0.6, {scaleX: 0.6, scaleY: 0.6}, { scaleX: scaleX, scaleY: scaleY, ease: Bounce.easeOut});

                    baraban.gotoAndStop('b0');
                    // console.warn('barabanFrame', baraban.currentFrame);
                    counter = 0;
                }
            }, 500);
        });
    }

    function showPritsel(bottle, shadow) {
        console.log('pritsel added!');
        const loader = storage.read('loadResult');
        const pritsel = new createjs.Bitmap(loader.getResult('pritsel')).set({
            x: utils.width / 2,
            y: utils.height / 2
        });
        utils.getCenterPoint(pritsel);
        if (stage.getChildByName('transitionContainer')) {
            stage.addChildAt(pritsel, stage.getChildIndex(stage.getChildByName('transitionContainer')));
        } else {
            stage.addChild(pritsel);
        }


        let tl = new TimelineMax();
        let x0 = pritsel.x;
        let y0 = pritsel.y;
        let x1;
        let y1;
        let x2;
        let y2;
        let fsMultiContainer;
        if (storage.read('device') === 'mobile') {
            x1 = 600;
            y1 = 100;
            x2 = bottle.x;
            y2 = bottle.y;
        }

        if (storage.read('device') === 'desktop') {
            x1 = 600;
            y1 = 500;
            x2 = bottle.x + 30;
            y2 = bottle.y + 500;
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            fsMultiContainer = controlsContainerFS.getChildByName('fsMultiContainer');
        }

        tl.fromTo(pritsel, 0.4, {scaleX: 0.6, scaleY: 0.6}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut});
        tl.to(pritsel, 0.4, {scaleX: 0.2, scaleY: 0.2,
            bezier: {type: 'soft', values: [ {x: x0, y: y0}, {x: 600, y: 100}, {x: x2, y: y2} ], autoRotate: false},
            ease: Power1.easeOut,
            onComplete: function () {
                pritsel.x = x0;
                pritsel.y = y0;
                stage.removeChild(pritsel);
                createjs.Sound.play('vistrelAllSound', {duration: 1000});
                addSomeBangs(bottle);
                createjs.Sound.play('stekloSound');
                createjs.Sound.play('stekloSound');
                bottle.gotoAndPlay('bottle');
                // console.warn('mainContainer', mainContainer);
                // console.warn('fsMultiContainer', fsMultiContainer);
                // console.warn('shadow', shadow);
                if (storage.read('device') === 'desktop') {
                    fsMultiContainer.removeChild(shadow);
                }
            }
        });
    }

    function initFreeSpins(data) {
        console.warn('i init freeSpin');
        const buttonsContainer = stage.getChildByName('buttonsContainer');
        buttonsContainer.visible = false;
        fsTotalWin = 0;
        if (storage.read('device') === 'mobile') {
            events.trigger('menu:changeSide', 'center');
        }
        drawFreeSpinsBG();

    }

    function transitionFreeSpins(data) {
        createjs.Sound.stop('ambientSound');
        createjs.Sound.play('startPerehodSound', {loop: -1});
        fsStartData = data;
        if (data) {
            config.currentLevel = data.level;
            config.currentMulti = data.multi;
            config.currentCount = data.count;
            config.currentWinCoins = data.currentWinCoins;
            config.currentWinCents = data.currentWinCents;
        } else {
            config.currentLevel = 0;
            config.currentMulti = 2;
            config.currentCount = 15;
            config.currentWinCoins = 0;
            config.currentWinCents = 0;
        }
        const loader = storage.read('loadResult');
        stage = storage.read('stage');

        let transitionContainer = new createjs.Container().set({
            name: 'transitionContainer'
        });
        let transitionBG = new createjs.Bitmap(loader.getResult('preloaderBG')).set({
            name: 'transitionBG',
            alpha: 0
        });
        let transitionBGSky = new createjs.Bitmap(loader.getResult('mainBGSky')).set({
            name: 'transitionBGSky'
        });

        const transitionLuchi = new c.Bitmap(loader.getResult('luchi'));
        transitionLuchi.set({
            name: 'transitionLuchi',
            x: utils.width / 2,
            y: utils.height / 2 + 150,
            scaleX: 0.6,
            scaleY: 0.6
        });
        utils.getCenterPoint(transitionLuchi);
        const tl = new TimelineMax({repeat: -1, yoyo: true});
        tl.to(transitionLuchi, 30, {rotation: 360, alpha: 0.1, ease: Power1.easeInOut});

        let transitionFSText = new createjs.Bitmap(loader.getResult('freeSpins')).set({
            name: 'transitionFSText',
            x: (1280 - 825 * 0.7) / 2,
            y: 50,
            scaleX: 0.7,
            scaleY: 0.7
        });
        let transitionWinText = new createjs.BitmapText(config.currentCount + '', loader.getResult('addedElements')).set({
            name: 'transitionWinText',
            scaleX: 0.1,
            scaleY: 0.1,
            alpha: 0
        });
        console.log('config.currentCount', config.currentCount);
        let bounds = transitionWinText.getBounds();
        transitionWinText.x = 1280 - bounds.width * 0.7 >> 1;
        transitionWinText.y = (720 - bounds.height * 0.7 >> 1) - 50;

        let transitionButton = new createjs.Bitmap(loader.getResult('play')).set({
            name: 'transitionButton',
            y: 575,
            scaleX: 0.7,
            scaleY: 0.7,
            cursor: 'pointer'
        });
        utils.getCenterPoint(transitionButton);
        utils.setInCenterOf(transitionButton, utils.width);

        let lines = [];
        const line = new c.Bitmap(loader.getResult('fonLine')).set({
            name: 'line',
            x: 350
        });
        let amount = Math.random() * 5 + 2;
        for (let i = 0; i < amount; i++) {
            let newLine = line.clone();
            newLine.x = Math.random() * 1280;
            newLine.alpha = Math.random();
            lines.push(newLine);
        }
        moveLine(lines);

        const line2 = new c.Bitmap(loader.getResult('fonLine')).set({
            name: 'line2',
            x: 0,
            alpha: 0.6
        });
        TweenMax.to(line2, 30, {x: 1280, repeat: -1});

        transitionContainer.on('click', function () {
            createjs.Sound.stop('startPerehodSound');
            createjs.Sound.play('fsAmbientSound', {loop: -1});
            setTimeout(function () {
                events.trigger('startFreeSpin');
            }, 1000);
            createjs.Tween.get(transitionContainer)
                .to({alpha: 0}, 500);
        }, transitionContainer, true);

        transitionContainer.addChild(transitionBGSky, transitionLuchi, transitionBG, transitionWinText, transitionFSText, transitionButton, line2);
        lines.forEach((line) => {
            transitionContainer.addChild(line);
        });
        stage.addChild(transitionContainer);
        let tl2 = new TimelineMax();
        tl2.to(transitionBG, 0.4, {alpha: 1})
            .call(function () {
                events.trigger('drawFreeSpins', fsStartData);
            })
            .from(transitionFSText, 0.4, {y: 900, alpha: 0}, '-=0.2')
            .to(transitionWinText, 0.4, {scaleX: 0.7, scaleY: 0.7, alpha: 1}, '-=0.2')
            .from(transitionButton, 0.4, {alpha: 0}, '-=0.2');
    }

    function countFreeSpins(number) {
        if (!number) return;
        let fsTableContainer;
        if (storage.read('device') === 'mobile') {
            fsTableContainer = stage.getChildByName('fsTableContainer');
        }

        if (storage.read('device') === 'desktop') {
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            fsTableContainer = controlsContainerFS.getChildByName('fsTableContainer');
        }
        const fsTotalCountText = fsTableContainer.getChildByName('fsTotalCountText');
        fsTotalCountText.text = number + '';

        const countBounds = fsTotalCountText.getBounds();
        console.log('I must change fsCount', number);
    }

    function showTotalFreeSpins(num) {
        console.warn('plus 3 added!');
        const loader = storage.read('loadResult');
        let fsTableContainer;
        let fsTotalCountBG;
        if (storage.read('device') === 'mobile') {
            fsTableContainer = stage.getChildByName('fsTableContainer');
            fsTotalCountBG = fsTableContainer.getChildByName('fsTotalCountBG');
        }

        if (storage.read('device') === 'desktop') {
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            fsTableContainer = controlsContainerFS.getChildByName('fsTableContainer');
            fsTotalCountBG = fsTableContainer.getChildByName('fsTotalCountBG');
        }

        const fsPlusContainer = new createjs.Container().set({
            name: 'fsPlusContainer'
        });
        const ss = loader.getResult('addedElements');
        const fsPlusText = new createjs.BitmapText('+3', loader.getResult('addedElements')).set({
            x: utils.width / 2,
            y: utils.height / 2 - 150
        });
        utils.getCenterPoint(fsPlusText);
        fsPlusContainer.addChild(fsPlusText);
        stage.addChild(fsPlusContainer);
        let tl = new TimelineMax();
        let x0 = fsPlusText.x;
        let y0 = fsPlusText.y;
        let x1;
        let y1;
        let x2;
        let y2;
        if (storage.read('device') === 'mobile') {
            x1 = 300;
            y1 = 100;
            x2 = 85;
            y2 = 515;
        }

        if (storage.read('device') === 'desktop') {
            x1 = x0 + 100;
            y1 = y0;
            x2 = 620;
            y2 = 615;
        }
        tl.fromTo(fsPlusText, 0.4, {scaleX: 0.6, scaleY: 0.6}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut});
        tl.to(fsPlusText, 0.6, {scaleX: 0.2, scaleY: 0.2,
            bezier: {type: 'soft', values: [ {x: x0, y: y0}, {x: x1, y: y1}, {x: x2, y: y2} ], autoRotate: false},
            ease: Power1.easeOut,
            onComplete: function () {
                fsPlusText.x = x0;
                fsPlusText.y = y0;
                stage.removeChild(fsPlusContainer);
                fsTotalCountBG.gotoAndPlay('bang');
                fsTotalCountBG.on('animationend', function () {
                    // debugger;
                    fsTotalCountBG.gotoAndStop(15);
                    // console.warn('I add +3:', num);
                    // countFreeSpins(num);
                });
            }
        });
    }

    function countTotalWin(data) {
        if (data.Mode === 'fsBonus') {
            const balanceContainer = stage.getChildByName('balanceContainer');
            const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
            const totalWinSum = balanceTextContainer.getChildByName('totalWinSum');
            const totalWinText = balanceTextContainer.getChildByName('totalWinText');
            totalWinSum.text = +totalWinSum.text + data.TotalWinCoins;
            fsTotalWin = totalWinSum.text;
            if (storage.read('device') == 'mobile') {
                totalWinSum.x = totalWinText.x + 20 + totalWinText.getMeasuredWidth() / 2 + totalWinSum.getMeasuredWidth() / 2;
            }
            balanceContainer.updateCache();

            // count win
            if (storage.read('device') === 'desktop') {
                const win = storage.read('rollResponse').TotalWinCoins;
                mainContainer = stage.getChildByName('mainContainer');
                const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
                const winText = controlsContainerFS.getChildByName('winText');
                winText.text = +win;
            }
        }
    }

    function startFreeSpin() {
        roll.startRoll();
    }

    function stopFreeSpins() {
        storage.changeState('lockedMenu', false);
        const bgContainer = stage.getChildByName('bgContainer');
        mainContainer = stage.getChildByName('mainContainer');
        if (storage.read('device') === 'mobile') {
            const buttonsContainer = stage.getChildByName('buttonsContainer');
            buttonsContainer.visible = true;
        }
        config.currentMulti = defaultConfig.currentMulti;
        config.currentCount = defaultConfig.currentCount;
        counter = 0;

        const fsMachineBG = mainContainer.getChildByName('fsMachineBG');
        const fsBG = bgContainer.getChildByName('fsBG');

        const balanceContainer = stage.getChildByName('balanceContainer');
        const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
        const coinsSum = balanceTextContainer.getChildByName('coinsSum');
        const betSum = balanceTextContainer.getChildByName('betSum');
        const betValue = balanceTextContainer.getChildByName('betValue');
        const coinsValue = balanceTextContainer.getChildByName('coinsValue');
        const coinsSumText = balanceTextContainer.getChildByName('coinsSumText');
        const betSumText = balanceTextContainer.getChildByName('betSumText');
        const totalWinText = balanceTextContainer.getChildByName('totalWinText');
        const totalWinSum = balanceTextContainer.getChildByName('totalWinSum');
        balanceTextContainer.removeChild(totalWinText, totalWinSum);
        if (storage.read('device') === 'mobile') {
            betSum.visible = coinsSum.visible = betSumText.visible = coinsSumText.visible = true;
            stage.removeChild(stage.getChildByName('fsTableContainer'));
            stage.removeChild(stage.getChildByName('fsMultiContainer'));
        }
        if (storage.read('device') === 'desktop') {
            coinsSum.set(parameters.desktop.coinsSum);
            betSum.set(parameters.desktop.betSum);
            betValue.set(parameters.desktop.betValue);
            coinsValue.set(parameters.desktop.coinsValue);
            mainContainer = stage.getChildByName('mainContainer');
            const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');
            // controlsContainerFS.removeChild(controlsContainerFS.getChildByName('fsTableContainer'));
            // controlsContainerFS.removeChild(controlsContainerFS.getChildByName('fsMultiContainer'));
            mainContainer.removeChild(controlsContainerFS);
            const controlsContainer = mainContainer.getChildByName('controlsContainer');
            controlsContainer.visible = true;
        }
        balanceContainer.updateCache();

        bgContainer.removeChild(fsBG);
        mainContainer.removeChild(fsMachineBG);
        bgContainer.uncache();
        mainContainer.uncache();
        if (storage.read('device') === 'mobile') {
            storage.changeState('side', 'left');
            events.trigger('menu:changeSide', 'left');
        }
    }

    function finishFreeSpins() {
        mainContainer = stage.getChildByName('mainContainer');
        const response = storage.read('freeRollResponse');
        storage.read('currentBalance').coinsCash = ((+storage.read('currentBalance').coinsCash * 100 + +storage.read('currentBalance').winCash * 100) / 100).toFixed(2);
        storage.read('currentBalance').coinsSum = +storage.read('currentBalance').coinsSum + response.CoinsWinCounter + response.TotalWinCoins;
        balance.updateBalance();

        createjs.Sound.stop('fsAmbientSound');
        createjs.Sound.play('finishPerehodSound', {loop: -1});
        let loader = storage.read('loadResult');
        let finishContainer = new createjs.Container().set({
            name: 'finishContainer',
            alpha: 0
        });
        let finishBG = new createjs.Bitmap(loader.getResult('preloaderBG')).set({
            name: 'finishBG'
        });
        let finishBGSky = new createjs.Bitmap(loader.getResult('mainBGSky')).set({
            name: 'transitionBGSky'
        });
        const darkness = new c.Shape();
        darkness.graphics.beginFill('rgba(0, 0, 0, 0.3)').drawRect(0, 0, utils.width, utils.height);

        let finishText;
        if (config.currentMulti !== 8) {
            finishText = new createjs.Bitmap(loader.getResult('totalWin'));
        } else {
            finishText = new createjs.Bitmap(loader.getResult('bigWin'));
        }

        finishText.set({
            name: 'finishText',
            y: 120,
            scaleX: 0.7,
            scaleY: 0.7
        });
        utils.getCenterPoint(finishText);
        utils.setInCenterOf(finishText, utils.width);

        const finishLuchi = new c.Bitmap(loader.getResult('luchi'));
        finishLuchi.set({
            name: 'finishLuchi',
            x: utils.width / 2,
            y: utils.height / 2 + 150,
            scaleX: 0.6,
            scaleY: 0.6
        });
        utils.getCenterPoint(finishLuchi);
        const tl = new TimelineMax({repeat: -1, yoyo: true});
        tl.to(finishLuchi, 30, {rotation: 360, alpha: 0.1, ease: Power1.easeInOut});

        let finishWinText = new createjs.BitmapText(fsTotalWin + '', loader.getResult('addedElements')).set({
            x: 1280 / 2,
            y: 720 / 2 - 20, // magic numbers
            scaleX: 0.7,
            scaleY: 0.7
        });
        let bounds = finishWinText.getBounds();
        finishWinText.regX = bounds.width / 2;
        finishWinText.regY = bounds.height / 2;
        let finishButton = new createjs.Bitmap(loader.getResult('continue')).set({
            name: 'finishButton',
            y: 580,
            scaleX: 0.7,
            scaleY: 0.7,
            cursor: 'pointer'
        });
        utils.getCenterPoint(finishButton);
        utils.setInCenterOf(finishButton, utils.width);

        let lines = [];
        const line = new c.Bitmap(loader.getResult('fonLine')).set({
            name: 'line',
            x: 350
        });
        let amount = Math.random() * 5 + 2;
        for (let i = 0; i < amount; i++) {
            let newLine = line.clone();
            newLine.x = Math.random() * 1280;
            newLine.alpha = Math.random();
            lines.push(newLine);
        }
        moveLine(lines);

        const line2 = new c.Bitmap(loader.getResult('fonLine')).set({
            name: 'line2',
            x: 0,
            alpha: 0.6
        });
        TweenMax.to(line2, 30, {x: 1280, repeat: -1});

        finishContainer.addChild(finishBGSky, finishLuchi, finishBG, darkness, finishText, finishWinText, finishButton);
        lines.forEach((line) => {
            finishContainer.addChild(line);
        });

        createjs.Tween.get(finishContainer)
            .to({alpha: 1}, 500)
            .call(function () {
                events.trigger('stopFreeSpins');
            });
        finishButton.on('click', function () {

            createjs.Sound.stop('finishPerehodSound');
            createjs.Sound.play('ambientSound', {loop: -1});
            createjs.Tween.get(finishContainer)
                .to({alpha: 0}, 500)
                .call(function () {
                    stage.removeChild(finishContainer);
                    const bgContainer = stage.getChildByName('bgContainer');
                    const fsBG = bgContainer.getChildByName('fsBG');
                    stage.removeChild(fsBG);
                    const mainBG = bgContainer.getChildByName('mainBG');
                    mainBG.alpha = 1;
                });
        });
        stage.addChild(finishContainer);
    }

    function moveLine(lines) {
        TweenMax.staggerTo(lines, 0.05, {x: '+= 3', repeat: 6, yoyo: true,
            ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false}),

            onComplete: function () {
                lines.forEach((line) => {
                    line.x = Math.round(Math.random() * 1280);
                    line.alpha = Math.random();
                });
                moveLine(lines);
            }
        });
    }

    function countMoney(response) {
        storage.read('currentBalance').winCash = ((response.CentsWinCounter + response.TotalWinCents) / 100).toFixed(2);
        balance.updateBalance();
    }

    function checkState(state) {
        if (state === 'roll' && storage.readState(state) === 'ended') {
            if (storage.readState('mode') === 'fsBonus') {
                countTotalWin(storage.read('rollResponse'));
                // countFreeSpins(storage.read('freeRollResponse').TotalFreeSpins);
                countMoney(storage.read('freeRollResponse'));
            }
        }
        if (state === 'roll' && storage.readState(state) === 'started') {
            if (storage.readState('mode') === 'fsBonus') {
                countFreeSpins(+storage.read('rollResponse').TotalFreeSpins - 1);
                console.warn('TotalFreeSpins', storage.read('rollResponse').TotalFreeSpins);
            }
        }
        if (state === 'fsMulti') {
            console.warn('storage multi', storage.readState(state));
            if (config.currentMulti != storage.readState(state)) {
                setTimeout( function () {
                    changeMultiplier(storage.readState(state));
                    config.currentMulti = storage.readState(state);
                }, 2000);
            }
        }
    }


    events.on('fs:rotateGun', rotateFSGun);
    events.on('fs:changeMultiplier', changeMultiplier);
    events.on('initFreeSpins', transitionFreeSpins);
    events.on('drawFreeSpins', initFreeSpins);
    events.on('stopFreeSpins', stopFreeSpins);
    events.on('finishFreeSpins', finishFreeSpins);
    events.on('startFreeSpin', startFreeSpin);
    events.on('spinEnd', countTotalWin);
    events.on('changeState', checkState);
    return {
        start,
        initFreeSpins,
        stopFreeSpins,
        startFreeSpin,
        drawFreeSpinsBG,
        changeMultiplier,
        showTotalFreeSpins,
        rotateFSGun
    };
})();
