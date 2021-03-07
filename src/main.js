import './styles/main.css';
import { getCurrentSection, getFilters } from './js/filters';
import { renderReadLaterItems } from './js/read-later';
import { renderNewsTiles } from './js/news';
import { debounce } from './js/helpers/debounce';

const handleSearchDebounced = debounce(() => {
    const { section, searchPhrase } = getFilters();
    if (searchPhrase && searchPhrase.trim())
        renderNewsTiles(section, 1, searchPhrase);
}, 400);

// event listeners

document.addEventListener('DOMContentLoaded', () => {
    renderNewsTiles();
    renderReadLaterItems();
});

document.getElementById('sectionSelect').addEventListener('change', () => {
    // TODO: optimize
    const searchInput = document.getElementById('newsContentSearch');
    searchInput.value = '';
    const section = getCurrentSection();
    renderNewsTiles(section);
});

document.getElementById('activePageSelect').addEventListener('change', () => {
    const { section, pageId } = getFilters();
    renderNewsTiles(section, pageId);
});

document.getElementById('newsContentSearch').addEventListener('keyup', (e) => {
    const { key } = e;
    if (key.length === 1 && /[a-zA-Z0-9- ]/.test(key)) handleSearchDebounced();
});

document.addEventListener('storage', renderReadLaterItems);
