import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { config } from 'components/menu/menu';

const c = createjs;
export function showAutoMenu() {
    const loader = storage.read('loadResult');
    const ss = loader.getResult('menu');
    let autoDelta;
    let yPoint = [190, 335, 480]; // Magic Numbers

    const menuAutoTitle = new c.Sprite(ss, 'autoplay').set({
        name: 'menuAutoTitle',
        y: 45 // Magic Numbers
    });
    utils.getCenterPoint(menuAutoTitle);
    utils.setInCenterOf(menuAutoTitle, config.menuWidth);
    const menuAutoCircle = new c.Sprite(ss, 'button');
    utils.getCenterPoint(menuAutoCircle);
    autoDelta = (config.menuWidth - 2 * menuAutoCircle.getBounds().width) / 3;
    const menuAutoText = new c.Text('', 'bold 60px Arial', '#90fd5a').set({
        textAlign: 'center',
        textBaseline: 'middle',
        shadow: new c.Shadow('#90fd5a', 0, 0, 8)
    });

    const menuAutoCircle10 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle10'
    });
    const menuAutoText10 = menuAutoText.clone().set({
        name: 'menuAutoText10',
        text: 10
    });
    const menuAutoButton10 = new c.Container().set({
        name: 'menuAutoButton10',
        amount: 10,
        x: autoDelta + menuAutoCircle.getBounds().width / 2,
        y: yPoint[0]
    });
    menuAutoButton10.addChild(menuAutoCircle10, menuAutoText10);

    const menuAutoCircle25 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle25'
    });
    const menuAutoText25 = menuAutoText.clone().set({
        text: 25,
        name: 'menuAutoText25'
    });
    const menuAutoButton25 = new c.Container().set({
        amount: 25,
        name: 'menuAutoButton25',
        x: autoDelta * 2 + menuAutoCircle.getBounds().width * 3 / 2,
        y: yPoint[0]
    });
    menuAutoButton25.addChild(menuAutoCircle25, menuAutoText25);

    const menuAutoCircle50 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle50'
    });
    const menuAutoText50 = menuAutoText.clone().set({
        text: 50,
        name: 'menuAutoText50'
    });
    const menuAutoButton50 = new c.Container().set({
        amount: 50,
        name: 'menuAutoButton50',
        x: autoDelta + menuAutoCircle.getBounds().width / 2,
        y: yPoint[1]
    });
    menuAutoButton50.addChild(menuAutoCircle50, menuAutoText50);

    const menuAutoCircle100 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle100'
    });
    const menuAutoText100 = menuAutoText.clone().set({
        text: 100,
        font: 'bold 45px Arial',
        name: 'menuAutoText100'
    });
    const menuAutoButton100 = new c.Container().set({
        amount: 100,
        name: 'menuAutoButton100',
        x: autoDelta * 2 + menuAutoCircle.getBounds().width * 3 / 2,
        y: yPoint[1]
    });
    menuAutoButton100.addChild(menuAutoCircle100, menuAutoText100);

    const menuAutoCircle250 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle250'
    });
    const menuAutoText250 = menuAutoText.clone().set({
        text: 250,
        font: 'bold 45px Arial',
        name: 'menuAutoText250'
    });
    const menuAutoButton250 = new c.Container().set({
        amount: 250,
        name: 'menuAutoButton250',
        x: autoDelta + menuAutoCircle.getBounds().width / 2,
        y: yPoint[2]
    });
    menuAutoButton250.addChild(menuAutoCircle250, menuAutoText250);

    const menuAutoCircle500 = menuAutoCircle.clone().set({
        name: 'menuAutoCircle500'
    });
    const menuAutoText500 = menuAutoText.clone().set({
        text: 500,
        font: 'bold 45px Arial',
        name: 'menuAutoText500'
    });
    const menuAutoButton500 = new c.Container().set({
        amount: 500,
        name: 'menuAutoButton500',
        x: autoDelta * 2 + menuAutoCircle.getBounds().width * 3 / 2,
        y: yPoint[2]
    });
    menuAutoButton500.addChild(menuAutoCircle500, menuAutoText500);

    let stage = storage.read('stage');
    let menuContainer = stage.getChildByName('menuContainer');
    menuContainer.addChild(
        menuAutoTitle,
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
}

function handleAutoClick(e) {
    createjs.Sound.play('buttonClickSound');
    const that = this;
    storage.write('autoCount', that.amount);
    events.trigger('menu:startAutoplay', this.amount);
    storage.changeState('autoplay', 'started');
}
