import './styles/main.css';
import { getCurrentSection, getFilters } from './js/filters';
import { addReadLaterItem, renderReadLaterItems } from './js/read-later';
import { getNewsEndpoint, fetchNews } from './js/api-service';

const renderNewsTile = (data) => {
    const { webTitle, sectionName, webPublicationDate, webUrl } = data;

    const newsTile = document.querySelector('.newsList > li').cloneNode(true);

    newsTile.querySelector('h3').textContent = webTitle;
    let [sectionTitle, publicationDate] = newsTile.querySelectorAll(
        '.newsDetails li'
    );
    sectionTitle.textContent = `Section title: ${sectionName}`;
    publicationDate.textContent = `Publication date: ${webPublicationDate}`;
    const readMoreLink = newsTile.querySelector('a');
    readMoreLink.setAttribute('href', webUrl);
    const readLaterButton = newsTile.querySelector('.button.button-outline');
    readLaterButton.addEventListener('click', () =>
        addReadLaterItem({ webTitle, webUrl })
    );

    newsTile.querySelector('article').classList.remove('hidden');
    newsTile.classList.add('newsTile');
    document.querySelector('.newsList').append(newsTile);
};

const removeOldNewsTiles = () => {
    const oldNewsTiles = document.querySelectorAll('.newsTile');
    oldNewsTiles.forEach((oldNewsTile) => oldNewsTile.remove());
};

const displayNewsTiles = (section, pageId, searchPhrase) => {
    removeOldNewsTiles();
    const newsUrl = getNewsEndpoint(section, pageId, searchPhrase);
    fetchNews(newsUrl).then((results) => {
        results.forEach((result) => renderNewsTile(result));
    });
};

const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const handleSearchDebounced = debounce(() => {
    const { section, searchPhrase } = getFilters();
    if (searchPhrase && searchPhrase.trim())
        displayNewsTiles(section, 1, searchPhrase);
}, 400);

// event listeners

document.addEventListener('DOMContentLoaded', () => {
    displayNewsTiles();
    renderReadLaterItems();
});

document.getElementById('sectionSelect').addEventListener('change', () => {
    // TODO: optimize
    const searchInput = document.getElementById('newsContentSearch');
    searchInput.value = '';
    const section = getCurrentSection();
    displayNewsTiles(section);
});

document.getElementById('activePageSelect').addEventListener('change', () => {
    const { section, pageId } = getFilters();
    displayNewsTiles(section, pageId);
});

document.getElementById('newsContentSearch').addEventListener('keyup', (e) => {
    const { key } = e;
    if (key.length === 1 && /[a-zA-Z0-9- ]/.test(key)) handleSearchDebounced();
});

document.addEventListener('storage', renderReadLaterItems);
