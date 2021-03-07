const getCurrentSection = () => {
    const sectionSelect = document.getElementById('sectionSelect');
    const { value } = sectionSelect;
    if (value === 'all') return 'news'; // news is general, we want to fetch ALL news
    return value.toLowerCase();
};

const getCurrentPage = () => {
    const activePageSelect = document.getElementById('activePageSelect');
    const { value } = activePageSelect;
    console.log(value);
    return value;
};

const getFilters = () => {
    return {
        pageId: getCurrentPage(),
        section: getCurrentSection(),
    };
};

const setActivePageOptions = (pageAmount) => {
    const activePageSelect = document.getElementById('activePageSelect');
    const currentPage = activePageSelect.value;
    activePageSelect.innerHTML = '';
    for (let i = 1; i <= pageAmount; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', i);
        option.innerText = i;
        activePageSelect.append(option);
    }
    activePageSelect.value = currentPage;
};

const setCurrentPage = (pageId) => {
    const activePageSelect = document.getElementById('activePageSelect');
    activePageSelect.value = pageId;
};

export {
    getCurrentSection,
    getCurrentPage,
    getFilters,
    setCurrentPage,
    setActivePageOptions,
};
