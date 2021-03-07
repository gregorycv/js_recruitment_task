import { addReadLaterItem } from './read-later';
import { getNewsEndpoint, fetchNews } from './helpers/api-helper';
import { toggleNoResultsMessage } from './no-results';

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

const renderNewsTiles = (section, pageId, searchPhrase) => {
    removeOldNewsTiles();
    const newsUrl = getNewsEndpoint(section, pageId, searchPhrase);
    fetchNews(newsUrl).then((results) => {
        if (results.length > 0) {
            toggleNoResultsMessage('.newsList', false);
            results.forEach((result) => renderNewsTile(result));
        } else {
            toggleNoResultsMessage('.newsList', true);
        }
    });
};

export { renderNewsTiles };
