
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', event => {
        if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// The complete archive is authored in HTML, so it also works without JavaScript.
const projectCards = [...document.querySelectorAll('.projects-page-grid [data-category]')];
const projectSearch = document.querySelector('#project-search');
const projectFilters = [...document.querySelectorAll('[data-filter]')];
const projectResults = document.querySelector('.project-results');
const projectEmpty = document.querySelector('.project-empty');
let activeProjectFilter = 'all';

if (projectCards.length && projectSearch && projectResults) {
    const searchableText = new Map(projectCards.map(card => [
        card, card.textContent.toLocaleLowerCase().replace(/\s+/g, ' ')
    ]));

    function filterProjects() {
        const words = projectSearch.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
        let visibleCount = 0;

        projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            const categoryMatches = activeProjectFilter === 'all' || categories.includes(activeProjectFilter);
            const searchMatches = words.every(word => searchableText.get(card).includes(word));
            card.hidden = !(categoryMatches && searchMatches);
            if (!card.hidden) visibleCount++;
        });

        projectFilters.forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.filter === activeProjectFilter));
        });

        projectResults.textContent = visibleCount === projectCards.length
            ? `Showing all ${projectCards.length} projects`
            : `Showing ${visibleCount} of ${projectCards.length} projects`;
        if (projectEmpty) projectEmpty.hidden = visibleCount !== 0;
    }

    projectFilters.forEach(button => {
        button.addEventListener('click', () => {
            activeProjectFilter = button.dataset.filter;
            filterProjects();
        });
    });

    projectSearch.addEventListener('input', filterProjects);

    document.querySelector('[data-reset-projects]')?.addEventListener('click', () => {
        activeProjectFilter = 'all';
        projectSearch.value = '';
        filterProjects();
        projectSearch.focus();
    });

    // Featured links and shared URLs always reveal their target, even after filtering.
    function revealLinkedProject() {
        const card = projectCards.find(item => `#${item.id}` === window.location.hash);
        if (!card) return;
        activeProjectFilter = 'all';
        projectSearch.value = '';
        filterProjects();
        card.scrollIntoView({ block: 'start', behavior: 'instant' });
    }

    window.addEventListener('hashchange', revealLinkedProject);
    filterProjects();
    revealLinkedProject();
}

document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = new URL(link.href).pathname.split('/').pop();

    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

const revealElements = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add('visible');
    });
}

document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
});

document.querySelectorAll('.project-screenshot').forEach(image => {
    const showImage = () => {
        image.closest('.project-art').classList.add('has-image');
        image.style.opacity = '1';
    };

    image.addEventListener('load', showImage);

    image.addEventListener('error', () => {
        image.style.display = 'none';
    });

    if (image.complete && image.naturalWidth > 0) {
        showImage();
    }
});
