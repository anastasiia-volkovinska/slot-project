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

        //  New Preloader
        const newPreloaderContainer = new c.Container().set({ name: 'newPreloaderContainer' });
        const lineSS = loader.getResult('preloaderLine');
        const coinSS = loader.getResult('preloaderCoin');
        const line = new c.Sprite(lineSS).set({
            name: 'preloaderLine',
            y: 450
        });
        const coin = new c.Sprite(coinSS, 'coin').set({
            name: 'preloaderCoin',
            y: 200,
            scaleX: 0.9,
            scaleY: 0.9,
            framerate: 24
        });
        utils.getCenterPoint(line);
        utils.setInCenterOf(line, utils.width);
        line.paused = true;
        utils.getCenterPoint(coin);
        utils.setInCenterOf(coin, utils.width);
        coin.play();
        const darkBG = new c.Shape();
        darkBG.graphics.beginFill('#000').drawRect(0, 0, utils.width, utils.height);
        newPreloaderContainer.addChild(darkBG, line, coin);

        stage.addChild(newPreloaderContainer);
        mainPreload(newPreloaderContainer);
    }

    function drawInitScreen() {
        createjs.Sound.play('preloadAmbientSound', {loop: -1});
        const loader = storage.read('loadResult');
        const ss = loader.getResult('new_elements');
        const clock = loader.getResult('preloaderSprite');
        const preloaderContainer = new c.Container().set({ name: 'preloaderContainer' });
        const preloaderCache = new c.Container().set({ name: 'preloaderCache' });
        const preloaderBG = new c.Bitmap(loader.getResult('preloaderBG')).set({ name: 'preloaderBG' });
        const preloaderBGSky = new c.Bitmap(loader.getResult('mainBGSky')).set({ name: 'preloaderBGSky' });
        const preloaderLuchi = new c.Bitmap(loader.getResult('luchi'));
        preloaderLuchi.set({
            name: 'preloaderLuchi',
            x: w / 2,
            y: h / 2 + 150,
            scaleX: 0.6,
            scaleY: 0.6
        });
        utils.getCenterPoint(preloaderLuchi);

        const preloaderBaraban = new c.Sprite(loader.getResult('addedElements'), 'baraban');
        preloaderBaraban.set({
            name: 'preloaderBaraban',
            x: w / 2,
            y: h / 2 + 140,
            framerate: 4,
            scaleX: 0.55,
            scaleY: 0.55
        });
        utils.getCenterPoint(preloaderBaraban);

        const preloaderBarabanBG = new c.Sprite(loader.getResult('addedElements'));
        preloaderBarabanBG.set({
            name: 'preloaderBarabanBG',
            x: w / 2,
            y: h / 2 + 241,
            framerate: 4,
            scaleX: 0.55,
            scaleY: 0.55
        });
        utils.getCenterPoint(preloaderBarabanBG);
        preloaderBarabanBG.gotoAndStop(8);

        preloaderBaraban.play();
        preloaderBaraban.on('animationend', function () {
            preloaderPlay.visible = true;
            preloaderBaraban.gotoAndStop(7);
            preloaderBaraban.stop();
            const tl = new TimelineMax({repeat: -1});
            tl.to(preloaderLuchi, 30, {rotation: 360, alpha: 0.1, ease: Power1.easeInOut, yoyo: true});
            const tl2 = new TimelineMax({repeat: -1});
            tl2.to(preloaderBaraban, 3, {rotation: 360, ease: Power0.easeNone});
        });

        const preloaderLogo = new c.Bitmap(loader.getResult('logo'));
        preloaderLogo.set({
            name: 'preloaderLogo',
            x: w / 2,
            y: 115,
            scaleX: 0.7,
            scaleY: 0.7
        });
        utils.getCenterPoint(preloaderLogo);

        const preloaderPlay = new c.Bitmap(loader.getResult('play'));
        preloaderPlay.set({
            name: 'preloaderPlay',
            x: w / 2,
            y: 290,
            scaleX: 0.7,
            scaleY: 0.7,
            visible: false,
            cursor: 'pointer'
        });
        utils.getCenterPoint(preloaderPlay);

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

        preloaderCache.addChild(preloaderBGSky, preloaderLuchi, preloaderBG, preloaderBarabanBG, preloaderBaraban, preloaderLogo, line2);
        lines.forEach((line) => {
            preloaderCache.addChild(line);
        });
        // preloaderCache.cache(0, 0, w, h);
        preloaderContainer.addChild(preloaderCache, preloaderPlay);
        preloaderContainer.on('click', function (e) {
            e.stopPropagation();
        });
        stage.addChildAt(preloaderContainer, stage.getChildIndex(stage.getChildByName('newPreloaderContainer')));
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

    function mainPreload(container) {
        const sprite = container.getChildByName('preloaderLine');
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
        storage.write('loadResult', event.target);
        drawInitScreen();
        setTimeout(clearPreloader, 100);
    }

    function clearPreloader() {
        let preloaderContainer = stage.getChildByName('preloaderContainer');
        let play = preloaderContainer.getChildByName('preloaderPlay');
        play.on('click', handlePlayClick, play, true);

        let newPreloaderContainer = stage.getChildByName('newPreloaderContainer');
        newPreloaderContainer.cache(0, 0, utils.width, utils.height);
        TweenMax.to(newPreloaderContainer, 0.5, {alpha: 0, onComplete: function () {
            storage.changeState('loaded', true);
            events.trigger('preloader:loaded');
            stage.removeChild(newPreloaderContainer);
        }});
    }

    function handlePlayClick(event, data) {
        events.trigger('preloader:goFullscreen');
        storage.changeState('fastSpinSetting', false);

        // Это стоит вынести в модуль музыки
        createjs.Sound.stop('preloadAmbientSound');
        const ambient = c.Sound.play('ambientSound', {loop: -1});
        storage.write('ambient', ambient);
        storage.changeState('music', true);
        // Конец фрагмента

        const loader = storage.read('loadResult');
        const container = storage.read('stage').getChildByName('preloaderContainer');
        container.cache(0, 0, w, h);

        TweenMax.to(container, config.fadingTime, {alpha: 0, onComplete: function () {
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
