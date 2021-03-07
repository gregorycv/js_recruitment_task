import './styles/main.css';
import { apiConfig } from './js/api-config';
import {
    getCurrentSection,
    setActivePageOptions,
    getFilters,
    setCurrentPage,
} from './js/filters';
import { addReadLaterItem, renderReadLaterItems } from './js/read-later';

// TODO: refactor to allow passing different date formats
const getFromDateQueryString = (numberOfDaysAgo = 30) => {
    const now = new Date();
    const last30days = new Date(now.setDate(now.getDate() - numberOfDaysAgo));

    return last30days.toISOString().slice(0, 10);
};

const getNewsEndpoint = (section = 'news', pageId = 1, searchPhrase) => {
    const { url, key } = apiConfig;
    const last30days = getFromDateQueryString();
    const searchPhraseQueryParam = searchPhrase ? `&q=${searchPhrase}` : '';
    const endpoint = `${url}?section=${section}&from-date=${last30days}&page=${pageId}${searchPhraseQueryParam}&api-key=${key}`;

    console.log(endpoint);
    console.log(getCurrentSection());
    return endpoint;
};

// rendering

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

// fetching

const fetchNews = (url) => {
    return fetch(url)
        .then((response) => response.json())
        .then((data) => data.response)
        .then((response) => {
            setActivePageOptions(response.pages);
            setCurrentPage(response.currentPage);
            return response.results;
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
    console.log(searchPhrase);
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
