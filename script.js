
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
