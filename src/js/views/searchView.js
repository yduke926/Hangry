import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    const test = document.querySelector(`.results__link[href="#${id}"]`)
    if (test) document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (label, limit = 17) => {
    const newTitle = [];
    if(label.length > limit){
        label.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //return the result
        return `${newTitle.join(' ')} ...`;
    } 
    return label;
}

const renderRecipe = hit => {
    //console.log(hit.recipe.uri)
   const rId = hit.recipe.uri.slice(43);
    const markup = `
    <li>
        <a class="results__link" href="${rId}">
            <figure class="results__fig">
                <img src="${hit.recipe.image}" alt="${hit.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(hit.recipe.label)}</h4>
                <p class="results__author">${hit.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderButtons = (page, numResults, resPerPage) => {
    const pages =  Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        //only button to go to next page
        button = createButton(page, 'next');
    } else if ( page < pages ){
        //both buttons
        button =`
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if ( page === pages && pages > 1){
        //only button to go previous
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (hits, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;

    hits.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, hits.length, resPerPage);
};