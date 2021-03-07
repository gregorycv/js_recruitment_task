import config from '../api-config/config';
import {
    getCurrentSection,
    setActivePageOptions,
    setCurrentPage,
} from '../filters';

// TODO: refactor to allow passing different date formats
const getFromDateQueryString = (numberOfDaysAgo = 30) => {
    const now = new Date();
    const last30days = new Date(now.setDate(now.getDate() - numberOfDaysAgo));

    return last30days.toISOString().slice(0, 10);
};

const getNewsEndpoint = (section, pageId = 1, searchPhrase) => {
    const { url, key } = config;
    const last30days = getFromDateQueryString();
    const sectionQueryParam = section ? `section=${section}&` : '';
    const searchPhraseQueryParam = searchPhrase ? `&q=${searchPhrase}` : '';
    const endpoint = `${url}?${sectionQueryParam}&from-date=${last30days}&page=${pageId}${searchPhraseQueryParam}&api-key=${key}`;

    console.log(endpoint);
    console.log(getCurrentSection());
    return endpoint;
};

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

export { getNewsEndpoint, fetchNews };
