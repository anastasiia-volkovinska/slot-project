import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { balance } from 'components/balance/balance';
import { config } from 'components/freeSpin/freeSpin';

const c = createjs;
let stage;

export function drawFreeSpinsBG() {
    stage = storage.read('stage');
    const loader = storage.read('loadResult');

    // Balance data invisible
    hideBalance();
    showFsBalance();

    const bgContainer = stage.getChildByName('bgContainer');
    const gameBG = bgContainer.getChildByName('gameBG');
    const mainBG = bgContainer.getChildByName('mainBG');
    mainBG.alpha = 0;

    const fsMachineBG = new c.Bitmap(loader.getResult('fsMachineBG')).set({
        name: 'fsMachineBG',
        x: 140,
        y: 5
    });

    bgContainer.addChildAt(fsMachineBG, bgContainer.getChildIndex(gameBG) + 1);

    const fgContainer = stage.getChildByName('fgContainer');

    fgContainer.uncache();
    const fsBG = new c.Bitmap(loader.getResult('fsBG')).set({
        name: 'fsBG'
    });
    bgContainer.addChildAt(fsBG, bgContainer.getChildIndex(mainBG) + 1);

    drawTableContainer();
    drawMultiContainer();

}

function drawTableContainer() {
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
    stage.addChildAt(fsTableContainer, stage.getChildIndex(stage.getChildByName('fgContainer')) + 1);
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
    stage.addChildAt(fsMultiContainer, stage.getChildIndex(stage.getChildByName('fgContainer')) + 2);

    events.trigger('changeMultiplier', 2);
    if (config.currentMulti !== 2) {
        events.trigger('changeMultiplier', config.currentMulti);
    }
}

function hideBalance() {
    const balanceContainer = stage.getChildByName('balanceContainer');
    const coinsSum = balanceContainer.getChildByName('coinsSum');
    const betSum = balanceContainer.getChildByName('betSum');
    const coinsSumText = balanceContainer.getChildByName('coinsSumText');
    const betSumText = balanceContainer.getChildByName('betSumText');
    betSum.visible = coinsSum.visible = betSumText.visible = coinsSumText.visible = false;
}

function showFsBalance() {
    const balanceContainer = stage.getChildByName('balanceContainer');

    const totalWinText = new c.Text('Total Win:', '24px Helvetica', '#dddddd').set({
        name: 'totalWinText',
        y: 658,
        textAlign: 'center'
    });
    const totalWinSum = new c.Text(config.currentWinCoins + '', '24px Helvetica', '#e8b075').set({
        name: 'totalWinSum',
        y: 658,
        textAlign: 'center',
        shadow: new c.Shadow('#e8b075', 0, 0, 15)
    });
    if (config.currentWinCents) {
        storage.read('currentBalance').winCash = (config.currentWinCents / 100).toFixed(2);
    }
    totalWinText.x = utils.width / 2 - 10 - totalWinText.getMeasuredWidth();
    totalWinSum.x = totalWinText.x + 20 + totalWinText.getMeasuredWidth() / 2 + totalWinSum.getMeasuredWidth() / 2;
    balanceContainer.addChild(totalWinText, totalWinSum);
    balanceContainer.updateCache();
}
