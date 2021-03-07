import { toggleNoResultsMessage } from './no-results';

const storeEnum = {
    LS_STORE_KEY: 'readLaterStore',
    ACTION_ADD: 'add',
    ACTION_DELETE: 'delete',
    ACTION_GET_STORE: 'get_store',
};

const { LS_STORE_KEY, ACTION_ADD, ACTION_DELETE, ACTION_GET_STORE } = storeEnum;

const addReadLaterItem = (item) => {
    storeManager(ACTION_ADD, item);
};

const deleteReadLaterItem = (item) => {
    storeManager(ACTION_DELETE, item);
};

const getReadLaterItems = () => {
    return storeManager(ACTION_GET_STORE);
};

const renderReadLaterItem = (data) => {
    const { webTitle, webUrl } = data;
    const readLaterTile = document
        .querySelector('.readLaterList > li')
        .cloneNode(true);

    readLaterTile.querySelector('h4').textContent = webTitle;
    const readLink = readLaterTile.querySelector('a');
    readLink.setAttribute('href', webUrl);
    const removeButton = readLaterTile.querySelector('button');
    removeButton.addEventListener('click', () => deleteReadLaterItem(data));

    readLaterTile.classList.remove('hidden');
    readLaterTile.classList.add('readLaterTile');
    document.querySelector('.readLaterList').append(readLaterTile);
};

const renderReadLaterItems = () => {
    unmountOldReadLaterItems();
    const readLaterItems = getReadLaterItems();
    if (readLaterItems.length > 0) {
        toggleNoResultsMessage('.readLaterList', false);
        readLaterItems.forEach((readLaterItem) =>
            renderReadLaterItem(readLaterItem)
        );
    } else {
        toggleNoResultsMessage('.readLaterList', true);
    }
};

const unmountOldReadLaterItems = () => {
    const oldReadLaterTiles = document.querySelectorAll('.readLaterTile');
    oldReadLaterTiles.forEach((oldReadLaterTile) => oldReadLaterTile.remove());
};

const storeManager = (action, payload) => {
    const currentStore = JSON.parse(localStorage.getItem(LS_STORE_KEY)) || [];
    switch (action) {
    case ACTION_GET_STORE:
        return [...currentStore];
    case ACTION_ADD:
        if (currentStore.find((item) => item.webTitle === payload.webTitle)) {
            alert('you have already added this to read later');
            return;
        }
        localStorage.setItem(
            LS_STORE_KEY,
            JSON.stringify([...currentStore, payload])
        );
        document.dispatchEvent(new Event('storage')); // manually trigger event dispatch to rerender readLaterItems based on localStorage value
        break;
    case ACTION_DELETE:
        localStorage.setItem(
            LS_STORE_KEY,
            JSON.stringify(
                currentStore.filter(({ webTitle }) => webTitle !== payload.webTitle)
            )
        );
        document.dispatchEvent(new Event('storage'));
        break;
    default:
        break;
    }
};

export { addReadLaterItem, renderReadLaterItems };
