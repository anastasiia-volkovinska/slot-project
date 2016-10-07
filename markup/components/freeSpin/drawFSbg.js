import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { balance } from 'components/balance/balance';
import { parameters } from 'components/balance/parameters';
import { config } from 'components/freeSpin/freeSpin';

const c = createjs;
let stage;

export function drawFreeSpinsBG() {
    stage = storage.read('stage');
    const loader = storage.read('loadResult');

    // Balance data invisible
    if (storage.read('device') === 'mobile') {
        hideBalance();
    }
    if (storage.read('device') === 'desktop') {
        moveBalanceFS();
    }

    showFsBalance();

    const bgContainer = stage.getChildByName('bgContainer');
    const mainContainer = stage.getChildByName('mainContainer');
    const gameBG = mainContainer.getChildByName('gameBG');
    const mainBG = bgContainer.getChildByName('mainBG');
    mainBG.alpha = 0;

    const fsMachineBG = new c.Bitmap(loader.getResult('fsMachineBG')).set({
        name: 'fsMachineBG',
        x: 62,
        y: 5
    });

    mainContainer.uncache();
    mainContainer.addChildAt(fsMachineBG, mainContainer.getChildIndex(gameBG) + 1);

    const fsBG = new c.Bitmap(loader.getResult('fsBG')).set({
        name: 'fsBG'
    });
    bgContainer.addChildAt(fsBG, bgContainer.getChildIndex(mainBG) + 1);

    if (storage.read('device') === 'desktop') {
        const controlsContainer = mainContainer.getChildByName('controlsContainer');
        controlsContainer.visible = false;

        const controlsContainerFS = new c.Container().set({
            name: 'controlsContainerFS',
            x: 92,
            y: 640
        });

        const controlsBGFS = new c.Bitmap(loader.getResult('controlsBGFS')).set({
            name: 'controlsBGFS',
            scaleX: 0.75,
            scaleY: 0.75
        });

        const lines = new c.Text('10', 'normal 16px Helvetica', '#e8b075').set({
            name: 'lines',
            x: 50,
            y: 88,
            textAlign: 'center',
            shadow: new c.Shadow('#e8b075', 0, 0, 15)
        });

        const win = storage.read('rollResponse').TotalWinCoins;
        console.log('TotalWinCoins', win);

        const winText = new c.Text(win, 'normal 16px Helvetica', '#e8b075').set({
            name: 'winText',
            x: 908,
            y: 28,
            textAlign: 'center',
            shadow: new c.Shadow('#e8b075', 0, 0, 15)
        });
        controlsContainerFS.addChild(controlsBGFS, lines, winText);
        mainContainer.addChildAt(controlsContainerFS, mainContainer.getChildIndex(mainContainer.getChildByName('gameTopContainer')));

        drawTableContainerDesktop();
        drawMultiContainerDesktop();
    }

    if (storage.read('device') === 'mobile') {
        drawTableContainer();
        drawMultiContainer();
    }

}

function drawTableContainer() {
    console.log('i am drawing table container');
    stage = storage.read('stage');
    const loader = storage.read('loadResult');

    const fsTableContainer = new c.Container().set({
        name: 'fsTableContainer'
    });

    // freeSpin count
    const fsTotalCountBG = new c.Sprite(loader.getResult('someFSelements')).set({
        name: 'fsTotalCountBG',
        x: -110,
        y: 350
    });
    utils.getCenterPoint(fsTotalCountBG);
    fsTotalCountBG.gotoAndStop(15);

    const fsTotalText = new c.Text('FREESPIN', '24px Helvetica', '#fff').set({
        x: 80,
        y: 480,
        name: 'fsTotalText',
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#444', 0, 0, 8)
    });
    const fsTotalCountText = new c.Text(config.currentCount + '', '75px Helvetica', '#f0e194').set({
        x: 82,
        y: 560,
        name: 'fsTotalCountText',
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#C19433', 0, 0, 8)
    });

    // freeSpin drum
    const fsBulletsBG = new c.Bitmap(loader.getResult('fsDrumBG')).set({
        name: 'fsBulletsBG',
        x: 80,
        y: 290
    });
    const fsBulletsText = new c.Text('BULLETS', '24px Helvetica', '#fff').set({
        x: fsBulletsBG.x,
        y: fsBulletsBG.y - 155,
        name: 'fsBulletsText',
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#444', 0, 0, 8)
    });
    const bullet = new c.Sprite(loader.getResult('new_elements')).set({
        name: 'bullet',
        x: 10,
        y: 170,
        scaleX: 0.55,
        scaleY: 0.55
    });
    utils.getCenterPoint(fsBulletsBG);
    utils.getCenterPoint(bullet);
    bullet.gotoAndStop(199);

    const baraban = new c.Sprite(loader.getResult('addedElements')).set({
        name: 'baraban',
        x: 80,
        y: 350,
        scaleX: 0.3,
        scaleY: 0.3
    });
    utils.getCenterPoint(baraban);
    baraban.gotoAndStop(1);

    fsTableContainer.addChild(fsTotalCountBG, fsTotalText, fsTotalCountText, fsBulletsBG, fsBulletsText, bullet, baraban);
    stage.addChildAt(fsTableContainer, stage.getChildIndex(stage.getChildByName('bgContainer')) + 1);
}

function drawMultiContainer() {
    stage = storage.read('stage');
    const loader = storage.read('loadResult');

    const fsMultiContainer = new c.Container().set({
        name: 'fsMultiContainer'
    });

    const shkaf = new c.Bitmap(loader.getResult('shkaf')).set({
        name: 'shkaf',
        x: 1163,
        y: 142
    });

    const fsMultiText = new c.Text('MULTIPLIER', '15px Helvetica', '#fff').set({
        x: 1220,
        y: 162,
        name: 'fsMultiText',
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#444', 0, 0, 8)
    });

    const fsMulti4 = new c.Bitmap(loader.getResult('x4')).set({
        name: 'fsMulti4',
        x: 1220,
        y: 530,
        visible: false
    });

    const fsMulti6 = new c.Bitmap(loader.getResult('x6')).set({
        name: 'fsMulti6',
        x: 1220,
        y: 370,
        visible: false
    });

    const fsMulti8 = new c.Bitmap(loader.getResult('x8')).set({
        name: 'fsMulti8',
        x: 1220,
        y: 220,
        visible: false
    });
    utils.getCenterPoint(fsMulti4);
    utils.getCenterPoint(fsMulti6);
    utils.getCenterPoint(fsMulti8);
    const bottle4 = new c.Sprite(loader.getResult('someFSelements')).set({
        name: 'bottle4',
        x: 1220, // Magic Numbers
        y: 555 // Magic Numbers
    });
    utils.getCenterPoint(bottle4);
    bottle4.gotoAndStop(0);

    const bottle6 = bottle4.clone().set({
        name: 'bottle6',
        x: 1220, // Magic Numbers
        y: 390 // Magic Numbers
    });
    utils.getCenterPoint(bottle6);
    bottle6.gotoAndStop(0);

    const bottle8 = bottle4.clone().set({
        name: 'bottle8',
        x: 1220, // Magic Numbers
        y: 225 // Magic Numbers
    });
    utils.getCenterPoint(bottle8);
    bottle8.gotoAndStop(0);

    fsMultiContainer.addChild(shkaf, fsMultiText, fsMulti8, fsMulti6, fsMulti4, bottle4, bottle6, bottle8);
    stage.addChildAt(fsMultiContainer, stage.getChildIndex(stage.getChildByName('bgContainer')) + 2);

    events.trigger('changeMultiplier', 2);
    if (config.currentMulti !== 2) {
        events.trigger('changeMultiplier', config.currentMulti);
    }
}

function hideBalance() {
    const balanceContainer = stage.getChildByName('balanceContainer');
    const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
    const coinsSum = balanceTextContainer.getChildByName('coinsSum');
    const betSum = balanceTextContainer.getChildByName('betSum');
    const coinsSumText = balanceTextContainer.getChildByName('coinsSumText');
    const betSumText = balanceTextContainer.getChildByName('betSumText');
    betSum.visible = coinsSum.visible = betSumText.visible = coinsSumText.visible = false;
    // balanceContainer.updateCache();
}

function showFsBalance() {
    console.log('config', config);
    const balanceContainer = stage.getChildByName('balanceContainer');
    const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');

    let totalWinText = new c.Text('Total Win:', '24px Helvetica', '#dddddd').set({
        name: 'totalWinText',
        textAlign: 'center'
    });
    let totalWinSum = new c.Text(config.currentWinCoins + '', '24px Helvetica', '#e8b075').set({
        name: 'totalWinSum',
        textAlign: 'center',
        shadow: new c.Shadow('#e8b075', 0, 0, 15)
    });
    if (config.currentWinCents) {
        storage.read('currentBalance').winCash = (config.currentWinCents / 100).toFixed(2);
    }
    if (storage.read('device') === 'mobile') {
        totalWinText.y = totalWinSum.y = 658;
        totalWinText.x = utils.width / 2 - 10 - totalWinText.getMeasuredWidth();
        totalWinSum.x = totalWinText.x + 20 + totalWinText.getMeasuredWidth() / 2 + totalWinSum.getMeasuredWidth() / 2;
        balanceTextContainer.addChild(totalWinText, totalWinSum);
    }
    if (storage.read('device') === 'desktop') {
        totalWinText.visible = false;
        totalWinSum.x = 990;
        totalWinSum.y = 603;
        totalWinSum.font = '14px Helvetica';
        balanceTextContainer.addChild(totalWinText, totalWinSum);
        balanceContainer.updateCache();
    }
    // balanceContainer.updateCache();

}

function moveBalanceFS() {
    const balanceContainer = stage.getChildByName('balanceContainer');
    const balanceTextContainer = balanceContainer.getChildByName('balanceTextContainer');
    const coinsSum = balanceTextContainer.getChildByName('coinsSum');
    coinsSum.set(parameters.desktopFS.coinsSum);
    const betSum = balanceTextContainer.getChildByName('betSum');
    betSum.set(parameters.desktopFS.betSum);
    const betValue = balanceTextContainer.getChildByName('betValue');
    betValue.set(parameters.desktopFS.betValue);
    const coinsValue = balanceTextContainer.getChildByName('coinsValue');
    coinsValue.set(parameters.desktopFS.coinsValue);
    balanceContainer.updateCache();
}

function drawTableContainerDesktop() {
    stage = storage.read('stage');
    const loader = storage.read('loadResult');

    const mainContainer = stage.getChildByName('mainContainer');
    const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');

    const fsTableContainer = new c.Container().set({
        name: 'fsTableContainer'
    });

    // freeSpin count
    const fsTotalCountBG = new c.Sprite(loader.getResult('someFSelements')).set({
        name: 'fsTotalCountBG',
        x: 307,
        y: -137
    });
    utils.getCenterPoint(fsTotalCountBG);
    fsTotalCountBG.gotoAndStop(15);

    const fsTotalCountText = new c.Text(config.currentCount + '', '75px Helvetica', '#f0e194').set({
        x: 500,
        y: 70,
        name: 'fsTotalCountText',
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#C19433', 0, 0, 8)
    });

    // freeSpin drum
    const bullet = new c.Sprite(loader.getResult('new_elements')).set({
        name: 'bullet',
        x: 210,
        y: 50,
        scaleX: 0.45,
        scaleY: 0.45
    });
    utils.getCenterPoint(bullet);
    bullet.gotoAndStop(199);

    const baraban = new c.Sprite(loader.getResult('addedElements')).set({
        name: 'baraban',
        x: 372,
        y: 73,
        scaleX: 0.25,
        scaleY: 0.25
    });
    utils.getCenterPoint(baraban);
    baraban.gotoAndStop(1);

    fsTableContainer.addChild(fsTotalCountBG, fsTotalCountText, bullet, baraban);
    controlsContainerFS.addChild(fsTableContainer);
}

function drawMultiContainerDesktop() {
    stage = storage.read('stage');
    const loader = storage.read('loadResult');
    const mainContainer = stage.getChildByName('mainContainer');
    const controlsContainerFS = mainContainer.getChildByName('controlsContainerFS');

    const fsMultiContainer = new c.Container().set({
        name: 'fsMultiContainer'
    });

    const fsMulti4 = new c.Bitmap(loader.getResult('x4')).set({
        name: 'fsMulti4',
        x: 600,
        y: 63,
        scaleX: 0.75,
        scaleY: 0.75,
        visible: false
    });

    const fsMulti6 = new c.Bitmap(loader.getResult('x6')).set({
        name: 'fsMulti6',
        x: 655,
        y: 63,
        scaleX: 0.75,
        scaleY: 0.75,
        visible: false
    });

    const fsMulti8 = new c.Bitmap(loader.getResult('x8')).set({
        name: 'fsMulti8',
        x: 710,
        y: 63,
        scaleX: 0.75,
        scaleY: 0.75,
        visible: false
    });
    utils.getCenterPoint(fsMulti4);
    utils.getCenterPoint(fsMulti6);
    utils.getCenterPoint(fsMulti8);
    const bottle4 = new c.Sprite(loader.getResult('someFSelements')).set({
        name: 'bottle4',
        x: 600, // Magic Numbers
        y: 75,
        scaleX: 0.75,
        scaleY: 0.75
    });
    utils.getCenterPoint(bottle4);
    bottle4.gotoAndStop(0);

    const bottle6 = bottle4.clone().set({
        name: 'bottle6',
        x: 655, // Magic Numbers
        y: 75 // Magic Numbers
    });
    utils.getCenterPoint(bottle6);
    bottle6.gotoAndStop(0);

    const bottle8 = bottle4.clone().set({
        name: 'bottle8',
        x: 710, // Magic Numbers
        y: 75 // Magic Numbers
    });
    utils.getCenterPoint(bottle8);
    bottle8.gotoAndStop(0);

    fsMultiContainer.addChild(fsMulti8, fsMulti6, fsMulti4, bottle4, bottle6, bottle8);
    controlsContainerFS.addChild(fsMultiContainer);

    events.trigger('changeMultiplier', 2);
    if (config.currentMulti !== 2) {
        events.trigger('changeMultiplier', config.currentMulti);
    }
}
