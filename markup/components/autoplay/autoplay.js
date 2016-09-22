import { utils } from 'components/utils/utils';
import { storage } from 'components/storage/storage';
import { events } from 'components/events/events';

export let autoplay = (function () {

    let autoCount;
    let autoTimer;
    let autoEnd;

    function start() {

    }

    function initAutoplay(amount) {
        autoCount = amount;
        autoEnd = false;
        startAutoplay();
        events.trigger('autoplay:started', autoCount);
    }

    function startAutoplay() {
        autoCount--;
        if (!autoEnd) {
            if (utils.lowBalance()) {
                autoEnd = true;
                stopAutoplay();
                utils.showPopup('Low balance!');
                storage.changeState('autoplay', 'ended');
                events.trigger('autoplay:ended');
            } else {
                events.trigger('autoplay:startRoll');
            }
        }
        if (autoCount > 0) {
            storage.write('autoCount', autoCount);
            storage.changeState('autoCount', autoCount);
            events.trigger('autoplay:count', autoCount);
        } else {
            stopAutoplay();
            storage.changeState('autoplay', 'ended');
            events.trigger('autoplay:ended');
        }
    }

    function stopAutoplay() {
        autoEnd = true;
        clearTimeout(storage.read('autoTimeout'));
        if (storage.readState('autoplay') !== 'ended') {
            events.trigger('autoplay:ended');
            storage.changeState('autoplay', 'ended');
        }
    }

    return {
        start,
        startAutoplay,
        stopAutoplay,
        initAutoplay
    };

})();
