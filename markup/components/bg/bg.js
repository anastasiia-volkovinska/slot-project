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
        const mainBG = new c.Bitmap(loader.getResult('newBGLight')).set({name: 'mainBG'});
        const gameBG = new c.Sprite(loader.getResult('bg'), 'gameBG').set({name: 'gameBG'});
        const gameMachine = new c.Bitmap(loader.getResult('newGameMachine')).set({
            name: 'gameMachine',
            x: 80, // Magic Numbers
            y: 5 // Magic Numbers
        });

        const fonar = new c.Bitmap(loader.getResult('fonar')).set({
            name: 'fonar',
            x: 71, // Magic Numbers
            y: 23, // Magic Numbers
            regX: 267 // Magic Numbers
        });
        const fonarTL = new TimelineMax({repeat: -1, yoyo: true});
        fonarTL.to(fonar, 2, {
            ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 0.1, points: 10, taper: 'none', randomize: true, clamp: false}), alpha: 0.7
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


        bgContainer.addChild(mainBG, gameBG, footerBgUp, footerBgDown, home);
        fgContainer.addChild(gameMachine, fonar);
        stage.addChildAt(bgContainer, fgContainer, 0);

        // TODO: Разобраться с кешированием бекграундов
        // TODO: Перенасти отрисовку нижних полосок меню в модуль balance

        storage.changeState('bgDraw', 'main');
        events.trigger('bg:main');
        storage.changeState('side', 'left');
        events.trigger('bg:changeSide', 'left');
    }

    function changeSide(side) {
        const stage = storage.read('stage');
        const fg = stage.getChildByName('fgContainer');
        const fonar = fg.getChildByName('fonar');
        if (side === 'left') {
            fonar.x = 71; // Magic Numbers
        } else if (side === 'right') {
            fonar.x = 71 - 150; // Magic Numbers
        }
    }

    return {
        start,
        drawBG,
        changeSide
    };

})();
