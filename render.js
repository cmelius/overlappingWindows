function tick() {
    PUBLIC.CONTEXT.reset();
    PUBLIC.CONTEXT.fillStyle = getColor();
    PUBLIC.CONTEXT.fillRect(0, 0, PUBLIC.CANVAS.width, PUBLIC.CANVAS.height);

    const other = getOtherInstanceKey();
    const data = getParsedLocalStorage();

    if (data.length > 1) {
        drawBox(data[other]);
    }

    window.requestAnimationFrame(() => tick());
}

const DATA = {
    SCREEN: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    }
};

function drawBox(data) {
    console.log(data);
    const x = data.left - DATA.SCREEN.left;
    const y =  data.top - DATA.SCREEN.top;
    const width = data.width;
    const height = data.height;


    PUBLIC.CONTEXT.fillStyle = PUBLIC.COLOR_OVERLAY;
    PUBLIC.CONTEXT.fillRect(x, y, width, height);
    PUBLIC.CONTEXT.stroke();
}

function resize() {
    DATA.SCREEN.width = window.innerWidth;
    DATA.SCREEN.height = window.innerHeight;

    PUBLIC.CANVAS.width = window.innerWidth;
    PUBLIC.CANVAS.height = window.innerHeight;

    PUBLIC.CONTEXT.fillStyle = getColor();
    PUBLIC.CONTEXT.fillRect(0, 0, PUBLIC.CANVAS.width, PUBLIC.CANVAS.height);

    writeToLocalStorage(PUBLIC.INSTANCE_KEY, DATA.SCREEN);
}

function moveInterval() {
    setInterval(() => {
        let changed = false;

        if (window.screenTop !== DATA.SCREEN.top) {
            DATA.SCREEN.top = window.screenTop;
            changed = true;
        }

        if (window.screenLeft !== DATA.SCREEN.left) {
            DATA.SCREEN.left = window.screenLeft;
            changed = true;
        }

        if (changed) {
            writeToLocalStorage(PUBLIC.INSTANCE_KEY, DATA.SCREEN);
        }
    }, 100);
}

function setupLocalStorage() {
    let instances = localStorage.getItem('instances');

    if (instances == null) {
        localStorage.setItem('instances', JSON.stringify([]));
    }
}

function getParsedLocalStorage() {
    return JSON.parse(localStorage.getItem('instances'));
}

function getInstanceKey() {
    let instances = getParsedLocalStorage();

    return instances.length;
}

function getOtherInstanceKey() {
    if (PUBLIC.INSTANCE_KEY === 0) {
        return 1;
    }

    return 0;
}

function writeToLocalStorage(instanceKey, data) {
    let storage = getParsedLocalStorage();
    storage[instanceKey] = data;

    localStorage.setItem('instances', JSON.stringify(storage));
}

function removeFromLocalStorage(instanceKey) {
    let storage = getParsedLocalStorage();
    storage.splice(instanceKey, 1);

    localStorage.setItem('instances', JSON.stringify(storage));
}

const PUBLIC = {
    INSTANCE_KEY: null,
    CANVAS: null,
    CONTEXT: null,
    COLOR_OVERLAY: '#d35400',
};

function getColor() {
    if (PUBLIC.INSTANCE_KEY === 0) {
        return '#c0392b';
    }

    return '#f39c12';
}

function setup() {
    setupLocalStorage();

    PUBLIC.INSTANCE_KEY = getInstanceKey();
    writeToLocalStorage(PUBLIC.INSTANCE_KEY, {
        left: window.screenLeft,
        top: window.screenTop,
    });

    PUBLIC.CANVAS = document.getElementById('canvas');
    PUBLIC.CONTEXT = PUBLIC.CANVAS.getContext('2d')

    resize();

    moveInterval();
}

function reset() {
    if (PUBLIC.INSTANCE_KEY === 0) {
        localStorage.setItem('instances', JSON.stringify([]));
    } else {
        removeFromLocalStorage(PUBLIC.INSTANCE_KEY);
    }
}