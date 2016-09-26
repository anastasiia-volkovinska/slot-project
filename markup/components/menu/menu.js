import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

import { showBetMenu } from 'components/menu/bet';
import { showAutoMenu } from 'components/menu/auto';
import { showSettingsMenu } from 'components/menu/settings';

export let config;
export let menu = (function () {

    const c = createjs;

    const defaultConfig = {
        menuWidth: 300,
        borderWidth: 2,
        slideTime: 0.5,
        plusMinusDelta: 10,
        dividerDelta: 5,
        captionDelta: 10
    };

    const menuContainer = new c.Container().set({ name: 'menuContainer' });
    let delta;
    let tl;

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function showMenu(name) {
        const loader = storage.read('loadResult');
        const stage = storage.read('stage');
        const ss = loader.getResult('menu');

        const overlay = new c.Shape().set({
            name: 'overlay',
            alpha: 0
        });
        overlay.graphics.beginFill('rgba(0, 0, 0, 0.5)').drawRect(0, 0, utils.width, utils.height);
        overlay.on('click', hideMenu);
        menuContainer.on('click', function (e) {
            e.stopPropagation();
        });

        stage.addChild(overlay, menuContainer);

        const menuBG = new createjs.Shape().set({name: 'menuBG'});
        menuBG.graphics.beginFill('#000').drawRect(0, 0, config.menuWidth, utils.height);

        const menuBorder = new createjs.Shape().set({name: 'menuBorder'});
        menuBorder.graphics.beginFill('rgba(255, 255, 255, 0.3)').drawRect(0, 0, config.borderWidth, utils.height);

        if (storage.readState('side') === 'right') {
            menuContainer.x = -config.menuWidth;
            menuBorder.x = config.menuWidth - config.borderWidth;
        } else {
            menuContainer.x = utils.width;
            menuBorder.x = 0;
        }

        const menuBack = new c.Sprite(loader.getResult('buttons'), 'backOut').set({
            name: 'menuBack',
            y: 650 // Magic Number
        });
        utils.getCenterPoint(menuBack);
        utils.setInCenterOf(menuBack, config.menuWidth);
        menuBack.on('click', hideMenu);

        menuContainer.addChild(menuBG, menuBorder, menuBack);

        tl = new TimelineMax();
        tl.to(overlay, config.slideTime, {alpha: 1})
            .to(menuContainer, config.slideTime, {x: delta}, 0);

        if (name === 'bet') {
            showBetMenu();
        } else if (name === 'auto') {
            showAutoMenu();
        } else if (name === 'settings') {
            showSettingsMenu();
        }

    }

    function hideMenu() {
        if (tl) {
            tl.reverse();
        }
        tl = null;
    }

    function changeSide(side) {
        if (side === 'left') {
            menuContainer.x = utils.width;
            delta = `-=${config.menuWidth}`;
        } else {
            menuContainer.x = -config.menuWidth;
            delta = `+=${config.menuWidth}`;
        }
    }

    return {
        start,
        hideMenu,
        showMenu,
        changeSide
    };
})();
