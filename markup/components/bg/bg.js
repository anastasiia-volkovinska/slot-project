// import CreateJS
// import TimelineMax
import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

export let bg = (function () {

    let config;
    const defaultConfig = {
        bottomLineHeight: 30,
        topLineHeight: 40
    };

    const c = createjs;
    const w = utils.width;
    const h = utils.height;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function drawBG() {
        const stage = storage.read('stage');
        const loader = storage.read('loadResult');

        const bgContainer = new c.Container().set({name: 'bgContainer'});
        const mainContainer = new c.Container().set({
            name: 'mainContainer'
        });
        if (storage.read('device') === 'desktop') {
            mainContainer.scaleX = mainContainer.scaleY = 0.86;
            mainContainer.x = mainContainer.x + 130;
        }
        const mainBG = new c.Bitmap(loader.getResult('mainBG')).set({name: 'mainBG'});
        const zaglushka = new c.Bitmap(loader.getResult('zaglushka')).set({name: 'zaglushka', y: 600, scaleX: 0.7, scaleY: 0.7});
        const mainBGSky = new c.Bitmap(loader.getResult('mainBGSky')).set({name: 'mainBGSky'});
        const greyBGGradient = new c.Shape().set({
            name: 'greyBGGradient',
            alpha: 0
        });
        greyBGGradient.graphics.beginLinearGradientFill(['#000', '#FFF'], [0, 1], 0, 0, 0, utils.height).drawRect(0, 0, utils.width, utils.height);
        TweenMax.to(greyBGGradient, 45, {alpha: 0.8, repeat: -1, yoyo: true, ease: Power4.easeInOut});

        const gameBG = new c.Bitmap(loader.getResult('gameBG')).set({
            name: 'gameBG',
            x: 60, // Magic Numbers
            y: 5 // Magic Numbers
        });
        const gameMachine = new c.Bitmap(loader.getResult('gameMachine')).set({
            name: 'gameMachine',
            x: 60, // Magic Numbers
            y: 5 // Magic Numbers
        });

        bgContainer.addChild(mainBGSky, greyBGGradient, mainBG, zaglushka);
        mainContainer.addChild(gameBG, gameMachine);
        stage.addChildAt(bgContainer, mainContainer, 0);

        addCloud();
        addCloud();
        addCloud();
        addPole();

        // TODO: Разобраться с кешированием бекграундов
        // TODO: Перенасти отрисовку нижних полосок меню в модуль balance

        storage.changeState('bgDraw', 'main');
        events.trigger('bg:main');
        if (storage.read('device') === 'desktop') {
            storage.changeState('side', 'right');
            events.trigger('bg:changeSide', 'right');
        } else {
            storage.changeState('side', 'left');
            events.trigger('bg:changeSide', 'left');
        }
    }

    function addCloud() {
        const loader = storage.read('loadResult');
        const newCloud = new c.Bitmap(loader.getResult('cloud')).set({
            name: 'newCloud',
            y: 90
        });
        utils.getCenterPoint(newCloud);

        let side = Math.round(Math.random()) ? 'left' : 'right';
        const time = 30 + Math.random() * 15 - 7.5;
        let delta;
        newCloud.y = newCloud.y + Math.random() * 100 - 50;
        newCloud.scaleX = newCloud.scaleY = Math.random() * 0.5 + 0.5;
        if (side === 'left') {
            newCloud.x = -420;
            delta = 1280 + 420;
        } else {
            newCloud.x = 1280 + 420;
            delta = -420;
        }

        const stage = storage.read('stage');
        const bgContainer = stage.getChildByName('bgContainer');
        const greyBGGradient = bgContainer.getChildByName('greyBGGradient');

        bgContainer.addChildAt(newCloud, bgContainer.getChildIndex(greyBGGradient));

        TweenMax.to(newCloud, time, {x: delta,
            onComplete: function () {
                bgContainer.removeChild(newCloud);
                addCloud();
            }
        });
    }

    function addPole() {
        const loader = storage.read('loadResult');
        const pole = new c.Sprite(loader.getResult('pole')).set({
            name: 'pole',
            y: 580
        });
        utils.getCenterPoint(pole);
        pole.play();

        let side = Math.round(Math.random()) ? 'left' : 'right';
        let time = 15 + Math.random() * 15 - 7.5;
        let delta;

        if (side === 'left') {
            pole.x = -420;
            delta = 1280 + 420;
        } else {
            pole.x = 1280 + 420;
            pole.skewY = 180;
            delta = -420;
        }

        const stage = storage.read('stage');
        const bgContainer = stage.getChildByName('bgContainer');
        bgContainer.addChild(pole);

        TweenMax.to(pole, time, {x: delta,
            onComplete: function () {
                bgContainer.removeChild(pole);
                addPole();
            }
        });
    }

    function changeSide(side) {
        const stage = storage.read('stage');
        const mainContainer = stage.getChildByName('mainContainer');
    }

    return {
        start,
        drawBG,
        changeSide
    };

})();
