import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { balance } from 'components/balance/balance';
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

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function changeMultiplier(multi) {

        const fsMultiContainer = stage.getChildByName('fsMultiContainer');
        const fsMulti4 = fsMultiContainer.getChildByName('fsMulti4');
        const fsMulti6 = fsMultiContainer.getChildByName('fsMulti6');
        const fsMulti8 = fsMultiContainer.getChildByName('fsMulti8');
        const bottle4 = fsMultiContainer.getChildByName('bottle4');
        const bottle6 = fsMultiContainer.getChildByName('bottle6');
        const bottle8 = fsMultiContainer.getChildByName('bottle8');

        console.log('multi', multi);
        if (multi == 4) {
            showPritsel(bottle4);
            bottle4.on('animationend', function () {
                fsMulti4.visible = true;
                bottle4.gotoAndStop(14);
            });
        } else if (multi == 6) {
            showPritsel(bottle6);
            bottle6.on('animationend', function () {
                fsMulti6.visible = true;
                bottle6.gotoAndStop(14);
            });
        } else if (multi == 8) {
            showPritsel(bottle8);
            bottle8.on('animationend', function () {
                fsMulti8.visible = true;
                bottle8.gotoAndStop(14);
            });
        }
    }

    function addSomeBangs(bottle) {
        const loader = storage.read('loadResult');
        const fsMultiContainer = stage.getChildByName('fsMultiContainer');
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
            console.log('newBang', newBang);
            console.log('fsMultiContainer', fsMultiContainer);
            newBang.on('animationend', function () {
                fsMultiContainer.removeChild(newBang);
            });
        }
    }

    function rotateFSGun() {
        console.log('i am in rotateFSGun');
        counter++;
        console.warn('counter', counter);

        const fsTableContainer = stage.getChildByName('fsTableContainer');
        const baraban = fsTableContainer.getChildByName('baraban');
        const bullet = fsTableContainer.getChildByName('bullet');
        bullet.gotoAndPlay('11-w');
        bullet.on('animationend', function () {
            bullet.gotoAndStop(199);
            baraban.gotoAndStop(16);
            utils.getCenterPoint(baraban);
            setTimeout( function () {
                baraban.gotoAndStop(1 + counter);
                if (counter > 6) {
                    // showPritsel();
                    TweenMax.fromTo(baraban, 0.4, {scaleX: 0.6, scaleY: 0.6}, { scaleX: 0.3, scaleY: 0.3, ease: Bounce.easeOut});
                    baraban.gotoAndStop(1);
                    counter = 0;
                }
            }, 500);
        });
    }

    function showPritsel(bottle) {
        console.log('pritsel added!');
        const loader = storage.read('loadResult');
        const pritsel = new createjs.Bitmap(loader.getResult('pritsel')).set({
            x: utils.width / 2,
            y: utils.height / 2
        });
        utils.getCenterPoint(pritsel);
        stage.addChild(pritsel);

        let tl = new TimelineMax();
        let x0 = pritsel.x;
        let y0 = pritsel.y;

        tl.fromTo(pritsel, 0.4, {scaleX: 0.6, scaleY: 0.6}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut});
        tl.to(pritsel, 0.4, {scaleX: 0.2, scaleY: 0.2,
            bezier: {type: 'soft', values: [ {x: x0, y: y0}, {x: 600, y: 100}, {x: bottle.x, y: bottle.y} ], autoRotate: false},
            ease: Power1.easeOut,
            onComplete: function () {
                pritsel.x = x0;
                pritsel.y = y0;
                stage.removeChild(pritsel);
                addSomeBangs(bottle);
                bottle.gotoAndPlay('bottle');
            }
        });
    }

    function initFreeSpins(data) {
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
            config.currentLevel = data.level - 1;
            config.currentMulti = data.multi;
            config.currentCount = data.count;
            config.currentWinCoins = data.currentWinCoins;
            config.currentWinCents = data.currentWinCents;
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
            scaleY: 0.7
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
        const fsTableContainer = stage.getChildByName('fsTableContainer');
        const fsTotalCountText = fsTableContainer.getChildByName('fsTotalCountText');
        fsTotalCountText.text = number + '';
        const countBounds = fsTotalCountText.getBounds();
        console.log('I must change fsCount', number);
    }

    function startFreeSpin() {
        roll.startRoll();
    }

    function stopFreeSpins() {
        storage.changeState('lockedMenu', false);
        const bgContainer = stage.getChildByName('bgContainer');
        const mainContainer = stage.getChildByName('mainContainer');
        const buttonsContainer = stage.getChildByName('buttonsContainer');
        buttonsContainer.visible = true;
        config.currentMulti = defaultConfig.currentMulti;
        config.currentCount = defaultConfig.currentCount;
        counter = 0;

        const fsMachineBG = mainContainer.getChildByName('fsMachineBG');
        const fsBG = bgContainer.getChildByName('fsBG');

        const balanceContainer = stage.getChildByName('balanceContainer');
        const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
        const coinsSum = balanceTextContainer.getChildByName('coinsSum');
        const betSum = balanceTextContainer.getChildByName('betSum');
        const coinsSumText = balanceTextContainer.getChildByName('coinsSumText');
        const betSumText = balanceTextContainer.getChildByName('betSumText');
        const totalWinText = balanceTextContainer.getChildByName('totalWinText');
        const totalWinSum = balanceTextContainer.getChildByName('totalWinSum');
        betSum.visible = coinsSum.visible = betSumText.visible = coinsSumText.visible = true;
        balanceTextContainer.removeChild(totalWinText, totalWinSum);
        balanceContainer.updateCache();
        stage.removeChild(stage.getChildByName('fsTableContainer'));
        stage.removeChild(stage.getChildByName('fsMultiContainer'));

        bgContainer.removeChild(fsBG);
        mainContainer.removeChild(fsMachineBG);
        bgContainer.uncache();
        mainContainer.uncache();
        storage.changeState('side', 'left');
        events.trigger('menu:changeSide', 'left');

    }

    function countTotalWin(data) {
        if (data.Mode === 'fsBonus') {
            const balanceContainer = stage.getChildByName('balanceContainer');
            const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
            const totalWinSum = balanceTextContainer.getChildByName('totalWinSum');
            const totalWinText = balanceTextContainer.getChildByName('totalWinText');
            totalWinSum.text = +totalWinSum.text + data.TotalWinCoins;
            fsTotalWin = totalWinSum.text;
            totalWinSum.x = totalWinText.x + 20 + totalWinText.getMeasuredWidth() / 2 + totalWinSum.getMeasuredWidth() / 2;
            balanceContainer.updateCache();
        }
    }

    function finishFreeSpins() {
        const mainContainer = stage.getChildByName('mainContainer');
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
            scaleY: 0.7
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
            mainContainer.removeChild(mainContainer.getChildByName('controlsContainerFS'));
            const controlsContainer = mainContainer.getChildByName('controlsContainer');
            controlsContainer.visisble = true;

            createjs.Sound.stop('finishPerehodSound');
            createjs.Sound.play('ambientSound', {loop: -1});
            createjs.Tween.get(finishContainer)
                .to({alpha: 0}, 500)
                .call(function () {
                    stage.removeChild(finishContainer);
                    const bgContainer = stage.getChildByName('bgContainer');
                    const mainBG = bgContainer.getChildByName('mainBG');
                    mainBG.alpha = 1;
                    const fsBG = bgContainer.getChildByName('fsBG');
                    stage.removeChild(fsBG);
                });
        });
        stage.addChild(finishContainer);
    }

    function showTotalFreeSpins(num) {
        console.warn('plus 3 added!');
        const loader = storage.read('loadResult');

        const fsTableContainer = stage.getChildByName('fsTableContainer');
        const fsTotalCountBG = fsTableContainer.getChildByName('fsTotalCountBG');

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
        tl.fromTo(fsPlusText, 0.6, {scaleX: 0.6, scaleY: 0.6}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut});
        tl.to(fsPlusText, 1, {scaleX: 0.2, scaleY: 0.2,
            bezier: {type: 'soft', values: [ {x: x0, y: y0}, {x: 300, y: 100}, {x: 85, y: 515} ], autoRotate: false},
            ease: Power1.easeOut,
            onComplete: function () {
                fsPlusText.x = x0;
                fsPlusText.y = y0;
                stage.removeChild(fsPlusContainer);
                fsTotalCountBG.gotoAndPlay('bang');
                fsTotalCountBG.on('animationend', function () {
                    fsTotalCountBG.gotoAndStop(15);
                });
            }
        });
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
                countFreeSpins(storage.read('freeRollResponse').TotalFreeSpins);
                countMoney(storage.read('freeRollResponse'));
            }
        }
        if (state === 'roll' && storage.readState(state) === 'started') {
            if (storage.readState('mode') === 'fsBonus') {
                countTotalWin(storage.read('rollResponse').TotalFreeSpins - 1);
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
