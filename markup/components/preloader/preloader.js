// import CreateJS
// import TweenMax
// import TimelineMax
import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { preloaderManifest, mainManifest } from 'components/preloader/manifests';

export let preloader = (function () {

    let config;
    const defaultConfig = {
        fadingTime: 1
    };

    const c = createjs;
    const w = utils.width;
    const h = utils.height;
    let stage;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function startPreloader() {
        const loader = new c.LoadQueue(true);
        loader.setMaxConnections(4);
        loader.loadManifest(preloaderManifest);
        loader.on('complete', showPreloader);
    }

    function showPreloader(event) {
        stage = storage.read('stage');
        const loader = event.target;
        const ss = loader.getResult('preloader');
        const clock = loader.getResult('preloaderSprite');

        const preloaderContainer = new c.Container().set({ name: 'preloaderContainer' });
        const preloaderCache = new c.Container().set({ name: 'preloaderCache' });
        const preloaderBG = new c.Sprite(ss, 'bg').set({ name: 'preloaderBG' });
        const preloaderLogo = new c.Sprite(ss, 'logo');
        preloaderLogo.set({
            name: 'preloaderLogo',
            x: (w - preloaderLogo.getBounds().width) / 2,
            y: 75
        });
        const preloaderPlay = new c.Sprite(ss, 'play');
        preloaderPlay.set({
            name: 'preloaderPlay',
            x: (w - preloaderPlay.getBounds().width) / 2,
            y: 310
        });
        const preloaderSprite = new c.Sprite(clock, 'start');
        preloaderSprite.set({
            name: 'preloaderSprite',
            x: (w - preloaderSprite.getBounds().width) / 2 - 100,
            y: 150
        });
        preloaderSprite.paused = true;

        preloaderCache.addChild(preloaderBG, preloaderLogo);
        preloaderCache.cache(0, 0, w, h);
        preloaderContainer.addChild(preloaderCache, preloaderPlay, preloaderSprite);
        stage.addChild(preloaderContainer);

        mainPreload(preloaderContainer);
    }

    function mainPreload(container) {
        const sprite = container.getChildByName('preloaderSprite');
        const loader = new c.LoadQueue(true);
        loader.installPlugin(c.Sound);
        loader.setMaxConnections(20);
        loader.loadManifest(mainManifest);

        loader.on('progress', handleLoadProgress, loader, false, {
            sprite
        });
        loader.on('complete', handleLoadComplete, loader, true, {
            container
        });

    }

    function handleLoadProgress(event, data) {
        const sprite = data.sprite;
        const progress = event.progress;
        const framesNumber = sprite.spriteSheet.getNumFrames('start');
        const currentFrame = Math.ceil(progress * framesNumber) - 1;
        sprite.gotoAndStop(currentFrame);
        if (progress === 1) {
            event.remove();
        }
    }

    function handleLoadComplete(event, data) {
        const container = data.container;
        const sprite = container.getChildByName('preloaderSprite');
        const play = container.getChildByName('preloaderPlay');

        sprite.gotoAndPlay('finish');
        play.on('click', handlePlayClick, play, true, {
            container
        });

        storage.write('loadResult', event.target);
        storage.changeState('loaded', true);
        events.trigger('preloader:loaded');
    }

    function handlePlayClick(event, data) {
        events.trigger('preloader:goFullscreen');
        storage.changeState('fastSpinSetting', false);

        // Это стоит вынести в модуль музыки
        const ambient = c.Sound.play('ambientSound', {loop: -1});
        storage.write('ambient', ambient);
        storage.changeState('music', true);
        // Конец фрагмента

        const container = data.container;
        container.cache(0, 0, w, h);

        const tl = new TimelineMax();
        tl.to(container, config.fadingTime, {alpha: 0, onComplete: function () {
            stage.removeChild(container);
            storage.changeState('preloader', 'done');
            events.trigger('preloader:done');
        }});

    }

    return {
        start,
        startPreloader
    };

})();
