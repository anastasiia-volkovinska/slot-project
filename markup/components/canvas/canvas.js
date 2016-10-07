// import CreateJS
// import TweenMax
import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

export let canvas = (function () {

    let config;
    const defaultConfig = {
        canvas: '#game',
        mouseOver: 10,
        leftToRight: 150,
        center: 75,
        timeToSlide: 0.5
    };
    const c = createjs;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function initStage() {

        // Определяем сцену
        const stage = new c.Stage('stage');
        stage.snapToPixelEnabled = true;
        stage.enableMouseOver(config.mouseOver);

        // Включаем heartbeet
        c.Ticker.timingMode = c.Ticker.RAF;
        c.Ticker.on('tick', stage);

        // Запишем холст в Storage
        storage.write('stage', stage);
        // Сцена создана
        storage.changeState('stage', true);
        events.trigger('canvas:stage', stage);

    }

    function fullScreen(e) {
        e = e || document.querySelector(config.canvas);
        /* eslint-disable */
        e.requestFullScreen ? e.requestFullScreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen && e.webkitRequestFullScreen();
        /* eslint-enable */
        iosFullScreenHack();
    }

    function iosFullScreenHack() {
        if ($('html').hasClass('ios') || $('html').hasClass('iphone')) {
            $(document).bind('touchmove', false);
        }
        $(function () {
            if (!$('html').hasClass('ios') || !$('html').hasClass('iphone')) {
                $('h1').hide();
            }
        });
    }

    // TODO: Эту функцию нужно будет полностью продебажить
    function changeSide(side) {
        console.log('I must change side to:', side);

        const stage = storage.read('stage');
        const mainContainer = stage.getChildByName('mainContainer');
        const bg = stage.getChildByName('bgContainer');
        const balance = stage.getChildByName('balanceContainer');
        const balanceText = balance.getChildByName('balanceTextContainer');
        const balanceCache = balance.getChildByName('balanceCache');

        let delta;
        switch (side) {
            case 'right':
                delta = `+=${config.leftToRight}`;
                storage.changeState('side', 'right');
                break;
            case 'left':
                if (storage.readState('side') === 'right') {
                    delta = `-=${config.leftToRight}`;
                    storage.changeState('side', 'left');
                } else {
                    delta = `-=${config.center}`;
                    storage.changeState('side', 'left');
                }
                break;
            case 'center':
                if (storage.readState('side') === 'left') {
                    delta = `+=${config.center}`;
                } else {
                    delta = `-=${config.center}`;
                }
                storage.changeState('side', 'center');
                break;
            default:
                return;
        }
        balance.uncache();
        TweenMax.to([mainContainer, balanceText, balanceCache], config.timeToSlide, {x: delta, onComplete: function () {
            balance.cache(0, 0, utils.width, utils.height);
        }});
    }

    return {
        start,
        initStage,
        changeSide,
        fullScreen,
        iosFullScreenHack
    };
})();
