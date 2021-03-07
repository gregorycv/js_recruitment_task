const toggleNoResultsMessage = (parentNodeSelector, shouldRender) => {
    const parentNode = document.querySelector(parentNodeSelector);
    shouldRender
        ? parentNode.querySelector('.noResults').classList.remove('hidden')
        : parentNode.querySelector('.noResults').classList.add('hidden');
};

export { toggleNoResultsMessage };
