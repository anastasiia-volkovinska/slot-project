import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { handleSpinClick } from 'components/buttons/handlers';

export let controls = (function () {

    let config;
    let c = createjs;
    let defaultConfig = {

    };
    let controlsAutoContainer;
    let auto;
    let spin;
    let maxBet;

    let controlsContainer = new c.Container().set({
        name: 'controlsContainer',
        x: 92,
        y: 640
    });

    function start(options) {
        config = options || defaultConfig;
    }

    function drawControlsPanel() {
        const loader = storage.read('loadResult');
        const stage = storage.read('stage');
        const mainContainer = stage.getChildByName('mainContainer');
        const controlsBG = new c.Bitmap(loader.getResult('controlsBG')).set({
            name: 'controlsBG',
            scaleX: 0.75,
            scaleY: 0.75
        });

        const lines = new c.Text('10', 'normal 16px Helvetica', '#e8b075').set({
            name: 'lines',
            x: 75,
            y: 88,
            textAlign: 'center',
            shadow: new c.Shadow('#e8b075', 0, 0, 15)
        });

        const controlsSS = loader.getResult('controlButtons');

        const controlPlusBet = new c.Sprite(controlsSS).set({
            name: 'controlPlusBet',
            x: 220,
            y: 101,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        controlPlusBet.gotoAndStop('plus');
        utils.getCenterPoint(controlPlusBet);
        controlPlusBet.on('mouseover', function () {
            controlPlusBet.gotoAndStop('plusHover');
        });
        controlPlusBet.on('mouseout', function () {
            controlPlusBet.gotoAndStop('plus');
        });
        controlPlusBet.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeBet', true);
        });

        const controlMinusBet = new c.Sprite(controlsSS).set({
            name: 'controlMinusBet',
            x: 145,
            y: 100,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        controlMinusBet.gotoAndStop('minus');
        utils.getCenterPoint(controlMinusBet);
        controlMinusBet.on('mouseover', function () {
            controlMinusBet.gotoAndStop('minusHover');
        });
        controlMinusBet.on('mouseout', function () {
            controlMinusBet.gotoAndStop('minus');
        });

        controlMinusBet.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeBet', false);
        });

        const controlPlusCoin = controlPlusBet.clone();
        controlPlusCoin.set({
            name: 'controlPlusCoin',
            x: 843,
            y: 101,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        controlPlusCoin.gotoAndStop('plus');
        utils.getCenterPoint(controlPlusCoin);
        controlPlusCoin.on('mouseover', function () {
            controlPlusCoin.gotoAndStop('plusHover');
        });
        controlPlusCoin.on('mouseout', function () {
            controlPlusCoin.gotoAndStop('plus');
        });

        controlPlusCoin.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeCoins', true);
        });

        const controlMinusCoin = controlMinusBet.clone();
        controlMinusCoin.set({
            name: 'controlMinusCoin',
            x: 752,
            y: 100,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        controlMinusCoin.gotoAndStop('minus');
        utils.getCenterPoint(controlMinusCoin);
        controlMinusCoin.on('mouseover', function () {
            controlMinusCoin.gotoAndStop('minusHover');
        });
        controlMinusCoin.on('mouseout', function () {
            controlMinusCoin.gotoAndStop('minus');
        });

        controlMinusCoin.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeCoins', false);
        });

        controlsAutoContainer = new c.Container().set({
            name: 'controlsAutoContainer',
            x: 475,
            y: 73,
            alpha: 0,
            open: false
        });

        const autoSelect = new c.Bitmap(loader.getResult('autoSelect')).set({
            name: 'autoSelect',
            scaleX: 0.75,
            scaleY: 0.75
        });
        utils.getCenterPoint(autoSelect);

        const menuAutoText = new c.Text('', 'normal 16px Helvetica', '#e8b075').set({
            textAlign: 'center',
            textBaseline: 'middle',
            shadow: new c.Shadow('#e8b075', 0, 0, 10)
        });

        const menuAutoShape = new c.Shape().set({name: 'menuAutoShape', regX: 40, regY: 20, scaleX: 0.75, scaleY: 0.75});
        menuAutoShape.graphics.beginFill('rgba(255, 255, 255, 0.4)').drawRect(0, 0, 80, 40);

        const menuAutoCircle10 = menuAutoShape.clone().set({
            name: 'menuAutoCircle10',
            alpha: 0.05
        });
        const menuAutoText10 = menuAutoText.clone().set({
            name: 'menuAutoText10',
            text: 10
        });
        const menuAutoButton10 = new c.Container().set({
            name: 'menuAutoButton10',
            amount: 10,
            x: -35,
            y: -32,
            cursor: 'pointer'
        });
        menuAutoButton10.addChild(menuAutoCircle10, menuAutoText10);
        menuAutoButton10.on('mouseover', function () {
            menuAutoCircle10.alpha = 0.5;
        });
        menuAutoButton10.on('mouseout', function () {
            menuAutoCircle10.alpha = 0.05;
        });

        const menuAutoCircle25 = menuAutoShape.clone().set({
            name: 'menuAutoCircle25',
            alpha: 0.05
        });
        const menuAutoText25 = menuAutoText.clone().set({
            text: 25,
            name: 'menuAutoText25'
        });
        const menuAutoButton25 = new c.Container().set({
            amount: 25,
            name: 'menuAutoButton25',
            x: 25,
            y: -32,
            cursor: 'pointer'
        });
        menuAutoButton25.addChild(menuAutoCircle25, menuAutoText25);
        menuAutoButton25.on('mouseover', function () {
            menuAutoCircle25.alpha = 0.5;
        });
        menuAutoButton25.on('mouseout', function () {
            menuAutoCircle25.alpha = 0.05;
        });

        const menuAutoCircle50 = menuAutoShape.clone().set({
            name: 'menuAutoCircle50',
            alpha: 0.05
        });
        const menuAutoText50 = menuAutoText.clone().set({
            text: 50,
            name: 'menuAutoText50'
        });
        const menuAutoButton50 = new c.Container().set({
            amount: 50,
            name: 'menuAutoButton50',
            x: -35,
            y: -32 + 30,
            cursor: 'pointer'
        });
        menuAutoButton50.addChild(menuAutoCircle50, menuAutoText50);
        menuAutoButton50.on('mouseover', function () {
            menuAutoCircle50.alpha = 0.5;
        });
        menuAutoButton50.on('mouseout', function () {
            menuAutoCircle50.alpha = 0.05;
        });

        const menuAutoCircle100 = menuAutoShape.clone().set({
            name: 'menuAutoCircle100',
            alpha: 0.05
        });
        const menuAutoText100 = menuAutoText.clone().set({
            text: 100,
            name: 'menuAutoText100'
        });
        const menuAutoButton100 = new c.Container().set({
            amount: 100,
            name: 'menuAutoButton100',
            x: 25,
            y: -32 + 30,
            cursor: 'pointer'
        });
        menuAutoButton100.addChild(menuAutoCircle100, menuAutoText100);
        menuAutoButton100.on('mouseover', function () {
            menuAutoCircle100.alpha = 0.5;
        });
        menuAutoButton100.on('mouseout', function () {
            menuAutoCircle100.alpha = 0.05;
        });

        const menuAutoCircle250 = menuAutoShape.clone().set({
            name: 'menuAutoCircle250',
            alpha: 0.05
        });
        const menuAutoText250 = menuAutoText.clone().set({
            text: 250,
            name: 'menuAutoText250'
        });
        const menuAutoButton250 = new c.Container().set({
            amount: 250,
            name: 'menuAutoButton250',
            x: -35,
            y: -32 + 62,
            cursor: 'pointer'
        });
        menuAutoButton250.addChild(menuAutoCircle250, menuAutoText250);
        menuAutoButton250.on('mouseover', function () {
            menuAutoCircle250.alpha = 0.5;
        });
        menuAutoButton250.on('mouseout', function () {
            menuAutoCircle250.alpha = 0.05;
        });

        const menuAutoCircle500 = menuAutoShape.clone().set({
            name: 'menuAutoCircle500',
            alpha: 0.05
        });
        const menuAutoText500 = menuAutoText.clone().set({
            text: 500,
            name: 'menuAutoText500'
        });
        const menuAutoButton500 = new c.Container().set({
            amount: 500,
            name: 'menuAutoButton500',
            x: 25,
            y: -32 + 62,
            cursor: 'pointer'
        });
        menuAutoButton500.addChild(menuAutoCircle500, menuAutoText500);
        menuAutoButton500.on('mouseover', function () {
            menuAutoCircle500.alpha = 0.5;
        });
        menuAutoButton500.on('mouseout', function () {
            menuAutoCircle500.alpha = 0.05;
        });

        controlsAutoContainer.addChild(
            autoSelect,
            menuAutoButton10,
            menuAutoButton25,
            menuAutoButton50,
            menuAutoButton100,
            menuAutoButton250,
            menuAutoButton500
        );

        menuAutoButton10.on('click', handleAutoClick);
        menuAutoButton25.on('click', handleAutoClick);
        menuAutoButton50.on('click', handleAutoClick);
        menuAutoButton100.on('click', handleAutoClick);
        menuAutoButton250.on('click', handleAutoClick);
        menuAutoButton500.on('click', handleAutoClick);

        auto = new c.Sprite(controlsSS).set({
            name: 'auto',
            x: 395,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        auto.gotoAndStop('auto');
        utils.getCenterPoint(auto);
        auto.on('mouseover', function () {
            auto.gotoAndStop('autoHover');
        });
        auto.on('mouseout', function () {
            auto.gotoAndStop('auto');
        });

        auto.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            TweenMax.to(auto, 0.4, {x: auto.x - 120});
            controlsAutoContainer.alpha = 1;
            TweenMax.to(controlsAutoContainer, 0.4, {x: controlsAutoContainer.x - 100});
            if (controlsAutoContainer.open === true) {
                TweenMax.to(auto, 0.4, {x: auto.x + 120});
                TweenMax.to(controlsAutoContainer, 0.4, {x: controlsAutoContainer.x + 100, alpha: 0});

            }
            controlsAutoContainer.open = !controlsAutoContainer.open;
        });

        maxBet = new c.Sprite(controlsSS).set({
            name: 'maxBet',
            x: 595,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        maxBet.gotoAndStop('maxBet');
        utils.getCenterPoint(maxBet);
        maxBet.on('mouseover', function () {
            maxBet.gotoAndStop('maxBetHover');
        });
        maxBet.on('mouseout', function () {
            maxBet.gotoAndStop('maxBet');
        });

        maxBet.on('click', function () {
            maxBet.gotoAndStop('maxBetOn');
            setTimeout(function () {
                maxBet.gotoAndStop('maxBet');
            }, 200);
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:maxBet', true);
        });

        spin = new c.Sprite(controlsSS).set({
            name: 'spin',
            x: 495,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        spin.gotoAndStop('spin');
        utils.getCenterPoint(spin);
        spin.on('mouseover', function () {
            spin.gotoAndStop('spinHover');
        });
        spin.on('mouseout', function () {
            spin.gotoAndStop('spin');
        });

        spin.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            // if (storage.readState('lockedMenu')) return;

            // if (storage.readState('roll') !== 'started' && spin.currentAnimation !== 'stop') {
            spin.gotoAndStop('spinOn');
            handleSpinClick();
            // }
            if (spin.currentAnimation === 'stop') {
                c.Sound.play('buttonClickSound');
                storage.changeState('autoplay', 'ended');
                events.trigger('buttons:stopAutoplay');
            }
        });

        const info = new c.Sprite(controlsSS).set({
            name: 'info',
            x: 900,
            y: 100,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        info.gotoAndStop('info');
        utils.getCenterPoint(info);
        info.on('mouseover', function () {
            info.gotoAndStop('infoHover');
        });
        info.on('mouseout', function () {
            info.gotoAndStop('info');
        });

        info.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            handleInfoClick();
        });

        controlsContainer.addChild(controlsBG, lines, controlPlusBet, controlMinusBet, controlMinusCoin, controlPlusCoin, controlsAutoContainer, spin, auto, maxBet, info);

        mainContainer.addChild(controlsContainer);
    }

    function handleAutoClick(e) {
        createjs.Sound.play('buttonClickSound');
        const that = this;
        storage.write('autoCount', that.amount);
        events.trigger('menu:startAutoplay', this.amount);
        storage.changeState('autoplay', 'started');

    }

    function handleInfoClick() {
        const loader = storage.read('loadResult');
        const stage = storage.read('stage');
        const rules = new c.Bitmap(loader.getResult('rules')).set({scaleX: 0.7, scaleY: 0.7});
        rules.on('click', function () {
            TweenMax.to(rules, 0.5, {alpha: 0, onComplete: function () {
                stage.removeChild(rules);
            }});
        });
        stage.addChild(rules);
    }

    function writeAutoplay() {
        spin.gotoAndStop('stop');
        auto.gotoAndStop('autoOff');
        // auto.gotoAndStop('autoStop');

        const autoCount = storage.read('autoCount');
        const autoText = new c.Text(autoCount, 'bold 36px Helvetica', '#231805').set({
            name: 'autoText',
            textAlign: 'center',
            textBaseline: 'middle',
            x: 403,
            y: auto.y - 3,
            shadow: new c.Shadow('#e8b075', 0, 0, 15)
        });
        TweenMax.to(auto, 0.4, {x: auto.x + 120});
        TweenMax.to(controlsAutoContainer, 0.4, {x: controlsAutoContainer.x + 100, alpha: 0, onComplete: function () {
            controlsContainer.addChild(autoText);
        }
        });
    }

    function removeAutoplay() {
        // spin.gotoAndStop('spinOut');
        auto.gotoAndStop('auto');
        controlsAutoContainer.open = false;
        const autoText = controlsContainer.getChildByName('autoText');
        controlsContainer.removeChild(autoText);
    }

    function updateAutoplay() {
        const autoCount = storage.read('autoCount');
        if (controlsContainer.getChildByName('autoText')) {
            const autoText = controlsContainer.getChildByName('autoText');
            autoText.text = autoCount;
        }
    }

    // function startRoll() {
    //     if (storage.readState('autoplay') === 'started') return;
    //     // menuButton.gotoAndStop('menuOff');
    //     auto.gotoAndStop('autoOff');
    //     betButton.gotoAndStop('betOff');
    // }

    function endRoll() {
        if (storage.readState('autoplay') === 'started') return;
        spin.gotoAndStop('spin');
        controlsAutoContainer.open = false;
        // menuButton.gotoAndStop('menuOut');
        auto.gotoAndStop('auto');
        maxBet.gotoAndStop('maxBet');
    }

    function fastRoll() {
        if (storage.readState('autoplay') === 'started') return;
        spin.gotoAndStop('spin');
    }

    return {
        start,
        drawControlsPanel,
        writeAutoplay,
        removeAutoplay,
        updateAutoplay,
        endRoll,
        fastRoll
    };
})();
