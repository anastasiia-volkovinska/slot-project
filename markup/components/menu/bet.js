import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { config } from 'components/menu/menu';

const c = createjs;
export function showBetMenu() {
    const loader = storage.read('loadResult');
    const ss = loader.getResult('menu');

    const menuBetTitle = new c.Sprite(ss, 'setBet').set({
        name: 'menuBetTitle',
        y: 50 // Magic Numbers
    });
    utils.getCenterPoint(menuBetTitle);
    utils.setInCenterOf(menuBetTitle, config.menuWidth);

    const menuMaxBet = new c.Sprite(ss, 'maxbetOff').set({
        name: 'menuMaxBet',
        y: 167 // Magic Numbers
    });
    utils.getCenterPoint(menuMaxBet);
    utils.setInCenterOf(menuMaxBet, config.menuWidth);

    const menuBetLevel = new c.Sprite(ss, 'betLevel').set({
        name: 'menuBetLevel',
        y: 274 // Magic Numbers
    });
    utils.getCenterPoint(menuBetLevel);
    utils.setInCenterOf(menuBetLevel, config.menuWidth);

    const menuBetBG = new c.Sprite(ss, 'button').set({
        name: 'menuBetBG',
        y: 345 // Magic Numbers
    });
    utils.getCenterPoint(menuBetBG);
    utils.setInCenterOf(menuBetBG, config.menuWidth);

    const menuBetMinus = new c.Sprite(ss, 'minusOut').set({
        name: 'menuBetMinus',
        y: menuBetBG.y
    });
    utils.getCenterPoint(menuBetMinus);
    utils.setInCenterOf(menuBetMinus, config.menuWidth);
    menuBetMinus.x = menuBetMinus.x - menuBetBG.getBounds().width / 2 - menuBetMinus.getBounds().width / 2 - config.plusMinusDelta;

    const menuBetPlus = new c.Sprite(ss, 'plusOut').set({
        name: 'menuBetPlus',
        y: menuBetBG.y
    });
    utils.getCenterPoint(menuBetPlus);
    utils.setInCenterOf(menuBetPlus, config.menuWidth);
    menuBetPlus.x = menuBetPlus.x + menuBetBG.getBounds().width / 2 + menuBetPlus.getBounds().width / 2 + config.plusMinusDelta;

    const betValue = storage.read('currentBalance').betValue;
    const menuBetText = new c.Text(betValue, 'bold 60px Arial', '#90fd5a').set({
        name: 'menuBetText',
        textAlign: 'center',
        textBaseline: 'middle',
        y: menuBetBG.y,
        shadow: new c.Shadow('#90fd5a', 0, 0, 8)
    });
    utils.setInCenterOf(menuBetText, config.menuWidth);

    const menuCoinValue = new c.Sprite(ss, 'coinValue').set({
        name: 'menuCoinValue',
        y: 437 // Magic Numbers
    });
    utils.getCenterPoint(menuCoinValue);
    utils.setInCenterOf(menuCoinValue, config.menuWidth);

    const menuCoinBG = menuBetBG.clone().set({
        name: 'menuCoinBG',
        y: 510 // Magic Numbers
    });

    const menuCoinMinus = new c.Sprite(ss, 'minusOut').set({
        name: 'menuCoinMinus',
        y: menuCoinBG.y
    });
    utils.getCenterPoint(menuCoinMinus);
    utils.setInCenterOf(menuCoinMinus, config.menuWidth);
    menuCoinMinus.x = menuCoinMinus.x - menuCoinBG.getBounds().width / 2 - menuCoinMinus.getBounds().width / 2 - config.plusMinusDelta;

    const menuCoinPlus = new c.Sprite(ss, 'plusOut').set({
        name: 'menuCoinPlus',
        y: menuCoinBG.y
    });
    utils.getCenterPoint(menuCoinPlus);
    utils.setInCenterOf(menuCoinPlus, config.menuWidth);
    menuCoinPlus.x = menuCoinPlus.x + menuCoinBG.getBounds().width / 2 + menuCoinPlus.getBounds().width / 2 + config.plusMinusDelta;

    const coinsValue = storage.read('currentBalance').coinsValue;
    const menuCoinsText = new c.Text(coinsValue, 'bold 35px Arial', '#90fd5a').set({
        name: 'menuCoinsText',
        textAlign: 'center',
        textBaseline: 'middle',
        y: menuCoinBG.y,
        shadow: new c.Shadow('#90fd5a', 0, 0, 8)
    });
    utils.setInCenterOf(menuCoinsText, config.menuWidth);

    const menuDivider1 = new c.Sprite(ss, 'divider').set({
        name: 'menuDivider1',
        y: menuMaxBet.y - menuMaxBet.getBounds().height / 2 - config.dividerDelta
    });
    utils.getCenterPoint(menuDivider1);
    utils.setInCenterOf(menuDivider1, config.menuWidth);
    const menuDivider2 = menuDivider1.clone().set({
        name: 'menuDivider2',
        y: menuMaxBet.y + menuMaxBet.getBounds().height / 2 + config.dividerDelta
    });
    const menuDivider3 = menuDivider1.clone().set({
        name: 'menuDivider3',
        y: menuBetBG.y + menuBetBG.getBounds().height / 2 + config.dividerDelta
    });
    const menuDivider4 = menuDivider1.clone().set({
        name: 'menuDivider4',
        y: menuCoinBG.y + menuCoinBG.getBounds().height / 2 + config.dividerDelta
    });

    menuMaxBet.on('click', function () {
        createjs.Sound.play('buttonClickSound');
        events.trigger('menu:maxBet', true);
        menuBetText.text = storage.read('currentBalance').betValue;
    });
    menuCoinPlus.on('click', function () {
        createjs.Sound.play('buttonClickSound');
        events.trigger('menu:changeCoins', true);
        menuCoinsText.text = storage.read('currentBalance').coinsValue;
    });
    menuCoinMinus.on('click', function () {
        createjs.Sound.play('buttonClickSound');
        events.trigger('menu:changeCoins', false);
        menuCoinsText.text = storage.read('currentBalance').coinsValue;
    });
    menuBetPlus.on('click', function () {
        createjs.Sound.play('buttonClickSound');
        events.trigger('menu:changeBet', true);
        menuBetText.text = storage.read('currentBalance').betValue;
    });
    menuBetMinus.on('click', function () {
        createjs.Sound.play('buttonClickSound');
        events.trigger('menu:changeBet', false);
        menuBetText.text = storage.read('currentBalance').betValue;
    });

    let stage = storage.read('stage');
    let menuContainer = stage.getChildByName('menuContainer');
    menuContainer.addChild(
        menuBetTitle,
        menuMaxBet,
        menuBetLevel,
        menuBetBG,
        menuBetPlus,
        menuBetMinus,
        menuBetText,
        menuCoinValue,
        menuCoinBG,
        menuCoinPlus,
        menuCoinMinus,
        menuCoinsText,
        menuDivider1,
        menuDivider2,
        menuDivider3,
        menuDivider4
    );
}
