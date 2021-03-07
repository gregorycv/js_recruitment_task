import './styles/main.css';
import { apiConfig } from './js/api-config';
import {
    getCurrentSection,
    setActivePageOptions,
    getFilters,
    setCurrentPage,
} from './js/filters';

// TODO: refactor to allow passing different date formats
const getFromDateQueryString = (numberOfDaysAgo = 30) => {
    const now = new Date();
    const last30days = new Date(now.setDate(now.getDate() - numberOfDaysAgo));

    return last30days.toISOString().slice(0, 10);
};

const getNewsEndpoint = (section = 'news', pageId = 1, searchPhrase) => {
    const { url, key } = apiConfig;
    const last30days = getFromDateQueryString();
    const q = searchPhrase ? `&q=${searchPhrase}` : '';
    const endpoint = `${url}?section=${section}&from-date=${last30days}&page=${pageId}${q}&api-key=${key}`;

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

// event listeners

document.addEventListener('DOMContentLoaded', () => {
    displayNewsTiles();
});

document.getElementById('sectionSelect').addEventListener('change', () => {
    const section = getCurrentSection();
    displayNewsTiles(section);
});

document.getElementById('activePageSelect').addEventListener('change', () => {
    const { section, pageId } = getFilters();
    displayNewsTiles(section, pageId);
});
