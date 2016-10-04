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
            scaleY: 0.75
        });
        controlPlusBet.gotoAndStop(6);
        utils.getCenterPoint(controlPlusBet);
        controlPlusBet.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeBet', true);
        });

        const controlMinusBet = new c.Sprite(controlsSS).set({
            name: 'controlMinusBet',
            x: 145,
            y: 100,
            scaleX: 0.75,
            scaleY: 0.75
        });
        controlMinusBet.gotoAndStop(7);
        utils.getCenterPoint(controlMinusBet);
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
            scaleY: 0.75
        });
        controlPlusCoin.gotoAndStop(6);
        utils.getCenterPoint(controlPlusCoin);
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
            scaleY: 0.75
        });
        controlMinusCoin.gotoAndStop(7);
        utils.getCenterPoint(controlMinusCoin);
        controlMinusCoin.on('click', function () {
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:changeCoins', false);
        });

        controlsAutoContainer = new c.Container().set({
            name: 'controlsAutoContainer',
            x: 480,
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
            shadow: new c.Shadow('#e8b075', 0, 0, 15)
        });

        const menuAutoShape = new c.Shape().set({name: 'menuAutoShape', regX: 40, regY: 20});
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
            y: -32
        });
        menuAutoButton10.addChild(menuAutoCircle10, menuAutoText10);

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
            y: -32
        });
        menuAutoButton25.addChild(menuAutoCircle25, menuAutoText25);

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
            y: -32 + 30
        });
        menuAutoButton50.addChild(menuAutoCircle50, menuAutoText50);

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
            y: -32 + 30
        });
        menuAutoButton100.addChild(menuAutoCircle100, menuAutoText100);

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
            y: -32 + 62
        });
        menuAutoButton250.addChild(menuAutoCircle250, menuAutoText250);

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
            y: -32 + 62
        });
        menuAutoButton500.addChild(menuAutoCircle500, menuAutoText500);

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
            x: 400,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75
        });
        auto.gotoAndStop('auto');
        utils.getCenterPoint(auto);
        auto.on('click', function () {
            auto.gotoAndStop('autoOff');
            TweenMax.to(auto, 0.4, {x: auto.x - 120});
            controlsAutoContainer.alpha = 1;
            TweenMax.to(controlsAutoContainer, 0.4, {x: controlsAutoContainer.x - 100});
            if (controlsAutoContainer.open === true) {
                TweenMax.to(auto, 0.4, {x: auto.x + 120});
                TweenMax.to(controlsAutoContainer, 0.4, {x: controlsAutoContainer.x + 100, alpha: 0});
            }
            controlsAutoContainer.open = !controlsAutoContainer.open;
        });

        const maxBet = new c.Sprite(controlsSS).set({
            name: 'maxBet',
            x: 600,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75,
            cursor: 'pointer'
        });
        maxBet.gotoAndStop('maxBet');
        utils.getCenterPoint(maxBet);
        maxBet.on('click', function () {
            maxBet.gotoAndStop('maxBetOn');
            createjs.Sound.play('buttonClickSound');
            events.trigger('menu:maxBet', true);
        });

        spin = new c.Sprite(controlsSS).set({
            name: 'spin',
            x: 500,
            y: 73,
            scaleX: 0.75,
            scaleY: 0.75
        });
        spin.gotoAndStop('spin');
        utils.getCenterPoint(spin);
        spin.on('click', function () {
            spin.gotoAndStop('spinOn');
            handleSpinClick();
        });

        controlsContainer.addChild(controlsBG, lines, controlPlusBet, controlMinusBet, controlMinusCoin, controlPlusCoin, controlsAutoContainer, spin, auto, maxBet);

        mainContainer.addChild(controlsContainer);
    }

    function handleAutoClick(e) {
        createjs.Sound.play('buttonClickSound');
        const that = this;
        storage.write('autoCount', that.amount);
        events.trigger('menu:startAutoplay', this.amount);
        storage.changeState('autoplay', 'started');
    }

    function writeAutoplay() {
        spin.gotoAndStop('stop');
        // auto.gotoAndStop('autoStop');

        const autoCount = storage.read('autoCount');
        const autoText = new c.Text(autoCount, '38px Helvetica', '#231805').set({
            name: 'autoText',
            textAlign: 'center',
            textBaseline: 'middle',
            x: 400,
            y: auto.y,
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
        // auto.gotoAndStop('autoOut');
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


    return {
        start,
        drawControlsPanel,
        writeAutoplay,
        removeAutoplay,
        updateAutoplay
    };
})();
