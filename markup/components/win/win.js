import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';
import { parameters } from 'components/win/parameters';

import { autoplay } from 'components/autoplay/autoplay';
import { freeSpin } from 'components/freeSpin/freeSpin';

/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
export let win = (function () {

    const c = createjs;

    let winData = {};
    let stage;
    let winLinesContainer;
    let winRectsContainer;
    let winElements;
    let currWinLines = [];
    let currWinScatters = [];
    let lightLinesCounter = 0;
    let lightDoneCounter = 0;
    let config;
    const defaultConfig = {
        topScreen: true
    };

    function start(configObj) {
        config = configObj || defaultConfig;
    }

    function initWin() {
        stage = storage.read('stage');
        const mainContainer = stage.getChildByName('mainContainer');
        const gameContainer = mainContainer.getChildByName('gameContainer');
        const gameBG = mainContainer.getChildByName('gameBG');
        winLinesContainer = new c.Container().set({
            name: 'winLinesContainer',
            x: gameContainer.x,
            y: gameContainer.y
        });
        winRectsContainer = new c.Container().set({
            name: 'winRectsContainer',
            x: gameContainer.x,
            y: gameContainer.y
        });
        mainContainer.addChildAt(winLinesContainer, mainContainer.getChildIndex(gameBG) + 1);
        mainContainer.addChild(winRectsContainer);
        winElements = findWinElements();
    }

    function findWinElements() {
        const result = [];
        const columns = [];
        const winLines = storage.read('lines');
        const mainContainer = stage.getChildByName('mainContainer');
        const gameContainer = mainContainer.getChildByName('gameContainer');
        for (let i = 0; i < 5; i++) {
            const column = gameContainer.getChildByName(`gameColumn${i}`);
            columns.push(column);
        }
        winLines.forEach((line, number) => {
            result[number] = [];
            line.forEach((point, position) => {
                const x = +point[0];
                const y = +point[1];
                const element = columns[position].getChildByName(`gameElement${y + 1}`);
                result[number].push(element);
            });
        });
        return result;
    }

    function drawLineShape(number) {
        const linesCoords = storage.read('linesCoords');
        const lineShape = new c.Shape();
        for (let j = 0; j < 5; j++) {
            const currentCoords = linesCoords[number - 1][j];
            if (j === 0) {
                lineShape.graphics.s('rgba(244, 233, 205, 0.15)').setStrokeStyle(2).lt(currentCoords.x, currentCoords.y);
            } else {
                lineShape.graphics.lt(currentCoords.x, currentCoords.y);
            }
        }
        lineShape.graphics.es();
        winLinesContainer.addChild(lineShape);
    }

    function drawLineLight(number) {
        let completeCounter = 0;
        const lightMas = [];
        const amount = Math.round(Math.random() * 80) + 20;
        const linesCoords = storage.read('linesCoords');
        const loader = storage.read('loadResult');
        const ss = loader.getResult('bulletpath');
        const bullet = new c.Sprite(ss).set({
            x: linesCoords[number - 1][0].x,
            y: linesCoords[number - 1][0].y,
            scaleX: 0.2,
            scaleY: 0.2
        });
        bullet.gotoAndStop(0);
        lightMas.push(bullet);
        winLinesContainer.addChild(bullet);
        utils.getCenterPoint(bullet);
        for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 5; j++) {
                const trace = bullet.clone();
                trace.gotoAndStop(i);
                lightMas.push(trace);
                winLinesContainer.addChild(trace);
                utils.getCenterPoint(trace);
                trace.alpha = 1 / i;
            }
        }

        // animation
        TweenMax.staggerTo(lightMas, 0.7,
            {bezier: {type: 'soft', values: linesCoords[number - 1], autoRotate: true},
            ease: Power1.easeOut,
            onComplete: function () {
                winLinesContainer.removeChild(this.target);
            }}, 0.025, function () {
                storage.changeState('lineLight', 'done');
                events.trigger('win:lineLight', number);
            }
        );
    }

    function drawLineText(data) {
        const loader = storage.read('loadResult');
        const linesCoords = storage.read('linesCoords');
        const number = data.lineNumber;
        const amount = data.lineAmount;
        const lineWin = data.lineWin;
        const winText = new c.Container().set({
            name: 'winText',
            x: linesCoords[number - 1][amount - 1].x + 25, // Magic Numbers
            y: linesCoords[number - 1][amount - 1].y + 20 // Magic Numbers
        });
        const winLineRect = new c.Bitmap(loader.getResult('winLineRect')).set({
            name: 'winLineRect',
            scaleX: 0.9,
            scaleY: 0.9
        });
        const winLineText = new c.Text(lineWin, '20px Helvetica', '#f0e194').set({
            name: 'winLineText',
            x: 35, // Magic Numbers
            y: 37, // Magic Numbers
            textAlign: 'center',
            textBaseline: 'middle',
            shadow: new c.Shadow('#C19433', 0, 0, 8)
        });
        if ((winLineText.text + '').length > 3) {
            winLineText.font = '14px Helvetica';
        } else if ((winLineText.text + '').length > 2) {
            winLineText.font = '16px Helvetica';
        } else if ((winLineText.text + '').length > 1) {
            winLineText.font = '18px Helvetica';
        }
        winText.addChild(winLineRect, winLineText);
        winRectsContainer.addChild(winText);
    }

    function showTotalWin(totalWinNumber) {
        const loader = storage.read('loadResult');
        const totalWin = new c.Container().set({
            name: 'totalWin',
            x: utils.gameWidth / 2 + 3, // Magic Numbers
            y: utils.gameHeight / 2
        });
        const totalWinRect = new c.Bitmap(loader.getResult('winTotalRect')).set({
            name: 'totalWinRect'
        });
        utils.getCenterPoint(totalWinRect);
        const totalWinText = new c.Text(totalWinNumber, '75px Helvetica', '#f0e194').set({
            name: 'totalWinText',
            textAlign: 'center',
            textBaseline: 'middle',
            shadow: new c.Shadow('#C19433', 0, 0, 8)
        });
        totalWin.addChild(totalWinRect, totalWinText);
        winRectsContainer.addChild(totalWin);
    }

    function drawLineFire(number) {
        const loader = storage.read('loadResult');
        const ss = loader.getResult('addedElements');
        const lineFire = new c.Sprite(ss, 'splash').set({
            name: 'lineFire',
            x: parameters[number].x - winRectsContainer.x, // Magic Numbers
            y: parameters[number].y - winRectsContainer.y + 3,
            scaleX: 1.2,
            scaleY: 1.2
        });
        const lineFire2 = new c.Sprite(ss, 'splash').set({
            name: 'lineFire2',
            x: parameters[number].x + 980 - winRectsContainer.x - 3, // Magic Numbers
            y: parameters[number].y - winRectsContainer.y + 5,
            scaleX: 1.2,
            scaleY: 1.2
        });
        // if (storage.readState('side') === 'right') {
        //     lineFire.x += 150; // Magic Numbers
        //     lineFire2.x += 150; // Magic Numbers
        // } else if (storage.readState('side') === 'center') {
        //     lineFire.x += 80; // Magic Numbers
        //     lineFire2.x += 80; // Magic Numbers
        // }
        lineFire.on('animationend', () => { lineFire.stop(); });
        lineFire2.on('animationend', () => { lineFire2.stop(); });
        utils.getCenterPoint(lineFire);
        utils.getCenterPoint(lineFire2);
        winRectsContainer.addChild(lineFire, lineFire2);
    }

    function fireWinLine(number, amount) {
        const gameTopElements = storage.read('gameTopElements');
        const winLine = storage.read('lines')[number - 1];

        if (defaultConfig.topScreen) {
            currWinLines.push({
                number: number,
                amount: amount,
                winLine: winLine
            });

            for (let i = 0; i < amount; i++) {
                const element = winElements[number - 1][i];
                const animationName = element.currentAnimation;
                const elementIndex = animationName.substr(animationName.indexOf('-') - 1, 1);
                let topElement = gameTopElements[+winLine[i][0]][+winLine[i][1]];
                element.visible = false;
                topElement.visible = true;

                topElement.gotoAndPlay(`${elementIndex}-w`);
                let tl = new TimelineMax();
                tl.fromTo(topElement, 0.6, {scaleX: 0.8, scaleY: 0.8}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut });
            }
        } else {
            for (let i = 0; i < amount; i++) {
                const element = winElements[number - 1][i];
                const animationName = element.currentAnimation;
                const elementIndex = animationName.substr(animationName.indexOf('-') - 1, 1);
                element.gotoAndPlay(`${elementIndex}-w`);
                let tl = new TimelineMax();
                tl.fromTo(element, 0.6, {scaleX: 0.8, scaleY: 0.8}, { scaleX: 1.1, scaleY: 1.1, ease: Bounce.easeOut });
            }
        }

        drawLineLight(number);
        drawLineFire(number);
    }

    function drawAnotherLine(index) {
        cleanWin();
        if (index === winData.winLines.length) {
            index = 0;
        }
        const winLine = winData.winLines[index];
        if (+winLine.lineNumber !== -1) {
            fireWinLine(winLine.lineNumber, winLine.lineAmount);
            drawLineText(winLine);
        } else if (+winLine.lineWin !== 0) {
            fireAllScatters();
        } else {
            fireScatterWild();
        }
        storage.changeState('anotherLine', index);
        events.trigger('win:anotherLine', index);
    }

    function fireAllScatters() {
        console.log('we entered fireAllScatters');
        const mainContainer = stage.getChildByName('mainContainer');
        const gameContainer = mainContainer.getChildByName('gameContainer');
        const gameTopElements = storage.read('gameTopElements');
        winElements.forEach((winLine) => {
            winLine.forEach((element, colInd) => {
                const animationName = element.currentAnimation;
                const elementIndex = animationName.substr(animationName.indexOf('-') - 2, 2);
                if (+elementIndex === 10) {
                    if (animationName === '10-n') {
                        if (defaultConfig.topScreen) {
                            let topElement = gameTopElements[colInd][+element.posY];
                            element.visible = false;
                            topElement.visible = true;
                            topElement.gotoAndPlay(`${elementIndex}-w`);
                        } else {
                            element.gotoAndPlay(`${elementIndex}-w`);
                        }

                        currWinScatters.push({
                            el: element,
                            colInd: colInd
                        });
                    }
                }
                if (+elementIndex === 11) {
                    if (animationName === '11-n') {
                        if (defaultConfig.topScreen) {
                            let topElement = gameTopElements[colInd][+element.posY];
                            element.visible = false;
                            topElement.visible = true;
                            topElement.gotoAndPlay(`${elementIndex}-w`);
                            let totalFreeSpins = storage.read('rollResponse').TotalFreeSpins;
                            // freeSpin.showTotalFreeSpins(totalFreeSpins);
                            events.trigger('fs:showTotalFreeSpins', totalFreeSpins);
                            bulletFSToGun(topElement);
                        } else {
                            element.gotoAndPlay(`${elementIndex}-w`);
                            let totalFreeSpins = storage.read('rollResponse').TotalFreeSpins;
                            // freeSpin.showTotalFreeSpins(totalFreeSpins);
                            events.trigger('fs:showTotalFreeSpins', totalFreeSpins);
                        }

                        currWinScatters.push({
                            el: element,
                            colInd: colInd
                        });
                    }
                }
            });
        });
        if (storage.read('rollResponse').BonusResults[0] === 'FreeSpinBonus') {
            setTimeout(function () {
                events.trigger('initFreeSpins');
            }, 1500);
        }
    }

    function bulletFSToGun(element) {
        let x0 = element.x;
        let y0 = element.y;
        let x1;
        let y1;
        let x2;
        let y2;
        if (storage.read('device') === 'mobile') {
            x1 = 300;
            y1 = 100;
            x2 = 85 - 150;
            y2 = 215 - 89;
        }

        if (storage.read('device') === 'desktop') {
            x1 = 200;
            y1 = 100;
            x2 = 270;
            y2 = 630;
        }
        TweenMax.to(element, 1, {scaleX: 0.3, scaleY: 0.3,
            bezier: {type: 'soft', values: [ {x: x0, y: y0}, {x: x1, y: y1}, {x: x2, y: y2} ], autoRotate: false},
            ease: Power1.easeOut,
            onComplete: function () {
                element.visible = false;
                element.x = x0;
                element.y = y0;
                element.scaleX = 1;
                element.scaleY = 1;
                element.rotation = 0;
                events.trigger('fs:rotateFSGun');
            }
        });
    }

    // function calcCardCoords(rot, x0, y0) {
    //     let xFinal, yFinal;
    //     if (rot < 90) {
    //         xFinal = x0 + Math.tan(rot) * utils.height * 1 / 3;
    //         yFinal = y0 - utils.height * 1 / 3;
    //     } else if (rot < 180) {
    //         xFinal = x0 + Math.tan(rot - 90) * utils.height;
    //         yFinal = y0 + utils.height;
    //     } else if (rot < 270) {
    //         xFinal = x0 - Math.tan(rot - 180) * utils.height;
    //         yFinal = y0 + utils.height;
    //     } else if (rot < 360) {
    //         xFinal = x0 - Math.tan(rot - 270) * utils.height * 1 / 3;
    //         yFinal = y0 - utils.height * 1 / 3;
    //     }
    //     return {
    //         x: xFinal,
    //         y: yFinal
    //     };
    // }
    //
    // function fireCards(curX, curY) {
    //     console.log('I am called with', curX, curY);
    //     const loader = storage.read('loadResult');
    //     const cardsContainer = new c.Container().set({
    //         name: 'cardsContainer'
    //     });
    //     const cards = [];
    //     cards.push(
    //         new c.Sprite(loader.getResult('cardsForLizaWin'), '01card'),
    //         new c.Sprite(loader.getResult('cardsForLizaWin'), '02card'),
    //         new c.Sprite(loader.getResult('cardsForLizaWin'), '03card'),
    //         new c.Sprite(loader.getResult('cardsForLizaWin'), '04card')
    //     );
    //     const amount = Math.round(Math.random() * 50 + 50);
    //     for (let i = 0; i < amount; i++) {
    //         const cardIndex = Math.floor(Math.random() * 4);
    //         const cardRotation = Math.round(Math.random() * 360);
    //         const cardTime = Math.random() * 2 + 0.7;
    //         const finalCoords = calcCardCoords(cardRotation, curX + utils.elementWidth / 2, curY + utils.elementHeight / 2);
    //         const newCard = cards[cardIndex].clone(true);
    //         newCard.rotation = cardRotation;
    //         newCard.x = curX + utils.elementWidth / 2;
    //         newCard.y = curY + utils.elementHeight / 2;
    //         utils.getCenterPoint(newCard);
    //         TweenMax.to(newCard, cardTime, {x: finalCoords.x, y: finalCoords.y, onComplete: function () {
    //             cardsContainer.removeChild(this.target);
    //         }});
    //         cardsContainer.addChild(newCard);
    //     }
    //     stage.addChild(cardsContainer);
    // }

    function drawTotalWin(lines) {
        lines.forEach((line) => {
            const lineNumber = line.lineNumber;
            const lineAmount = line.lineAmount;
            const lineWin = line.lineWin;
            if (+lineNumber !== -1) {
                fireWinLine(lineNumber, lineAmount);
                lightLinesCounter++;
            } else {
                fireAllScatters();
            }
        });
        const totalWin = storage.read('rollResponse').TotalWinCoins;
        if (totalWin > 0) {
            showTotalWin(totalWin);
        }
    }

    function parseWinResult(arr) {
        const result = [];
        arr.forEach((line) => {
            const lineAmount = +parseInt(line, 10);
            const lineNumber = +parseInt(line.substr(line.indexOf('#') + 1), 10);
            const lineWin = +parseInt(line.substr(line.indexOf(':') + 1), 10);
            const lineObj = {
                lineAmount,
                lineNumber,
                lineWin
            };
            result.push(lineObj);
        });
        return result;
    }

    function showWin() {
        const rollData = storage.read('rollResponse');
        winData.winCoins = rollData.TotalWinCoins;
        winData.winCents = rollData.TotalWinCents;
        winData.winLines = parseWinResult(rollData.LinesResult);
        if (winData.winLines.length) {
            drawTotalWin(winData.winLines);
            // createjs.Sound.play('lineWinSound');
            createjs.Sound.play('vistrelSound');
            createjs.Sound.play('pulyaSound', {delay: 200});
        }
    }

    function _clearWinElement(el) {
        const animationName = el.currentAnimation;

        let elementIndex;
        if (animationName.length === 4) {
            elementIndex = animationName.substr(animationName.indexOf('-') - 2, 2);
        } else {
            elementIndex = animationName.substr(animationName.indexOf('-') - 1, 1);
        }
        el.gotoAndStop(`${elementIndex}-n`);
        el.set({
            scaleX: 1,
            scaleY: 1
        });
    }

    function cleanWin() {
        if (defaultConfig.topScreen) {
            const gameTopElements = storage.read('gameTopElements');
            if (currWinLines.length) {
                currWinLines.forEach((lineData) => {
                    let amount = lineData.amount;
                    let number = lineData.number;
                    let winLine = lineData.winLine;
                    for (let i = 0; i < amount; i++) {
                        const element = winElements[number - 1][i];
                        const topElement = gameTopElements[+winLine[i][0]][+winLine[i][1]];
                        element.visible = true;
                        topElement.visible = false;
                        _clearWinElement(topElement);
                    }
                });

                currWinLines = [];
            }

            if (currWinScatters.length) {
                currWinScatters.forEach((scatter) => {
                    let element = scatter.el;
                    if (defaultConfig.topScreen) {
                        let topElement = gameTopElements[scatter.colInd][+element.posY];
                        element.visible = true;
                        topElement.visible = false;
                        _clearWinElement(topElement);
                    } else {
                        _clearWinElement(element);
                    }
                });
                currWinScatters = [];
            }
        } else {
            winElements.forEach((line) => {
                line.forEach((element) => {
                    _clearWinElement(element);
                });
            });
        }

        winLinesContainer.removeAllChildren();
        winRectsContainer.removeAllChildren();
        lightLinesCounter = 0;
        lightDoneCounter = 0;
    }

    function startRoll() {
        cleanWin();
        if (storage.read('lineTimeout')) {
            clearTimeout(storage.read('lineTimeout'));
        }
    }

    function endRoll() {
        showWin();
        if (storage.read('rollResponse').BonusResults.length) {
            storage.changeState('lockedMenu', true);
        }
        if (storage.readState('autoplay') === 'started') {
            let time;
            if (storage.read('rollResponse').LinesResult.length > 0) {
                time = 1000;
            } else {
                time = 300;
            }
            const autoTimeout = setTimeout(function () {
                autoplay.startAutoplay();
            }, time);
            storage.write('autoTimeout', autoTimeout);
        }
        if (storage.readState('mode') === 'fsBonus') {
            let count = storage.read('rollResponse').TotalFreeSpins;
            storage.changeState('fsMulti', storage.read('rollResponse').Multiplier.MultiplierValue);
            storage.changeState('fsLevel', storage.read('rollResponse').Multiplier.MultiplierStep);
            if (count > 0) {
                console.log('I start free Spin', count);
                let time;
                if (storage.read('rollResponse').LinesResult.length > 0) {
                    time = 1000;
                } else {
                    time = 300;
                }
                const fsTimeout = setTimeout(function () {
                    freeSpin.startFreeSpin();
                }, time);
                storage.write('fsTimeout', fsTimeout);
            } else {
                console.warn('I am stoping Free Spins!');
                events.trigger('finishFreeSpins');
            }
        }
    }

    function finishLineLight() {
        lightDoneCounter++;
        if (lightDoneCounter === lightLinesCounter && storage.readState('mode') === 'normal') {
            if (storage.readState('autoplay') !== 'started') {
                if (storage.read('rollResponse').BonusResults.length === 0) {
                    storage.changeState('lineByLine', 'started');
                    events.trigger('win:lineByLine', 0);
                }
            }
        }
    }

    function showNextLine() {
        let lineTimeout = setTimeout(function () {
            drawAnotherLine(storage.readState('anotherLine') + 1);
        }, 1500);
        storage.write('lineTimeout', lineTimeout);
    }

    function showMulti() {
        if (storage.readState('roll') === 'ended') {
            events.trigger('multiplierBonus', storage.read('fsMultiplierResponse'));
        }
    }

    return {
        start,
        initWin,
        cleanWin,
        startRoll,
        endRoll,
        drawAnotherLine,
        drawLineFire,
        finishLineLight,
        showNextLine,
        showMulti
    };
})();
