const hide = () => {
    const modal = document.querySelector('.modal');
    modal.classList.remove('show');
}
const onClickProduct = (event) => {
    let id = parseInt(event.target.id);
    const product = productsTab.find(item => item.id === id);

    const modal = document.getElementsByClassName('modal')[0];
    const productID = modal.querySelector('#productID');
    productID.textContent = product.id;
    const productText = modal.querySelector('#productText');
    productText.textContent = product.text;
    const productImage = modal.querySelector('#productImage');
    productImage.textContent = product.image;
    modal.classList.add('show');
}

let itemCount = 0;
let isLoading = false;  // To prevent multiple loads at once 
let pageSize = 20;
let productsTab = [];

const selectChanged = (event) => {
    pageSize = parseInt(event.target.value);
}

async function getData() {
    const url = `https://brandstestowy.smallhost.pl/api/random?pageNumber=${Math.ceil((itemCount + 1) / pageSize)}&pageSize=${pageSize}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json()
            .then((data) =>
                productsTab = [...productsTab, ...data.data]
            );
    } catch (error) {
        console.error(error.message);
    }
}

const loadMoreItems = () => {
    if (isLoading || productsTab.length < itemCount) return;
    isLoading = true;
    getData();

    setTimeout(() => {
        const root = document.getElementById('products');
        for (let i = 0; i < pageSize; i++) {
            itemCount++;
            const colItem = document.createElement('div');
            colItem.className = 'col-3';

            const prodItem = document.createElement('div');
            prodItem.className = 'product';
            prodItem.id = `${itemCount}`;
            prodItem.textContent = `ID: ${itemCount}`;
            prodItem.addEventListener('click', onClickProduct);

            colItem.appendChild(prodItem);
            root.appendChild(colItem);
        }
        isLoading = false;
    }, 100);
}

const s1 = document.getElementById('section_1');
const s2 = document.getElementById('section_2');
const s3 = document.getElementById('section_3');

const checkScrollPosition = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.offsetHeight;

    if (scrollPosition >= pageHeight - 1) {  // Reached bottom of the page
        loadMoreItems();
    }

    if (s1.getBoundingClientRect().top >= 0) {
        underscoreMenu('section_0')
    }
    if (s1.getBoundingClientRect().top <= 1) {
        underscoreMenu(s1.id)
    }
    if (s2.getBoundingClientRect().top <= 0) {
        underscoreMenu(s2.id)
    }
    if (s3.getBoundingClientRect().top <= 0) {
        underscoreMenu(s3.id)
    }
    if (piesek.getBoundingClientRect().top <= 500) {
        piesekParallax();
    }
}

const underscoreMenu = (sectionId) => {
    const menuLinks = document.querySelectorAll('menu a');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

let piesek = document.getElementById('piesek');
let V1_piesL = document.getElementById('V1_piesL');
let V1_piesP = document.getElementById('V1_piesP');

const piesekParallax = () => {
    let value = piesek.getBoundingClientRect().top;

    piesek.style.top = value * 0.1 - 50 + 'px';
    V1_piesL.style.left = value - 770 + 'px'
    V1_piesP.style.left = value * -1 + 520 + 'px';
}

// Add scroll event listener
window.addEventListener('scroll', checkScrollPosition);