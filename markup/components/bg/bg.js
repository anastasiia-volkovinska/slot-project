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
        const fgContainer = new c.Container().set({name: 'fgContainer'});
        const mainBG = new c.Bitmap(loader.getResult('mainBG')).set({name: 'mainBG'});
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

        // Это нужно перенести в модуль баланса или оставить здесь
        const footerBgDown = new c.Shape().set({name: 'footerBgDown'});
        const footerBgUp = new c.Shape().set({name: 'footerBgUp'});
        footerBgDown.graphics.beginFill('rgba(0, 0, 0)').drawRect(0, h - config.bottomLineHeight, w, config.bottomLineHeight);
        footerBgUp.graphics.beginFill('rgba(0, 0, 0, 0.6)').drawRect(0, h - config.bottomLineHeight - config.topLineHeight, w, config.topLineHeight);

        // Это нужно перенести в модуль кнопок либо отдельный модуль
        const home = new c.Bitmap(loader.getResult('home')).set({
            name: 'homeButton',
            x: 15, // Magic Numbers
            y: h - 63 // Magic Numbers
        });
        home.on('click', function () {
            utils.request('_Logout/', storage.read('sessionID'))
            .then((response) => {
                console.log('Logout response:', response);
            });
            window.history.back();
        });

        bgContainer.addChild(mainBGSky, greyBGGradient, mainBG, gameBG, footerBgUp, footerBgDown, home);
        fgContainer.addChild(gameMachine);
        stage.addChildAt(bgContainer, fgContainer, 0);

        addCloud();
        addCloud();
        addCloud();

        // TODO: Разобраться с кешированием бекграундов
        // TODO: Перенасти отрисовку нижних полосок меню в модуль balance

        storage.changeState('bgDraw', 'main');
        events.trigger('bg:main');
        storage.changeState('side', 'left');
        events.trigger('bg:changeSide', 'left');
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

    function changeSide(side) {
        const stage = storage.read('stage');
        const fg = stage.getChildByName('fgContainer');

    }

    return {
        start,
        drawBG,
        changeSide
    };

})();
