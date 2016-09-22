import { events } from 'components/events/events';

// Модуль хранилища данных
export let storage = (function () {

    const store = {};
    const state = {};

    function write(key, value) {
        store[key] = value;
    }

    function read(key) {
        if (typeof store[key] !== 'undefined') {
            return store[key];
        } else {
            return false;
        }
    }

    function log() {
        console.log('Store is:', store);
    }

    function changeState(key, value) {
        state[key] = value;
        console.log(`State '${key}' changed to: ${value}`);
        events.trigger('changeState', key);
    }

    function readState(key) {
        if (typeof state[key] !== 'undefined') {
            return state[key];
        } else {
            return false;
        }
    }

    function logState() {
        console.log('State is:', state);
    }

    // API
    return {
        changeState,
        readState,
        logState,
        write,
        read,
        log
    };
})();
