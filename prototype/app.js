// Voyage Vogue - Main JavaScript

// Cart Management
let cart = JSON.parse(localStorage.getItem('voyageVogueCart')) || [];

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Add to cart
function addToCart() {
    const product = {
        id: Date.now(),
        name: document.querySelector('h1').textContent,
        price: 189000,
        quantity: parseInt(document.getElementById('quantity').textContent),
        image: document.getElementById('mainImage').src,
        size: 'M',
        color: '베이지'
    };

    cart.push(product);
    localStorage.setItem('voyageVogueCart', JSON.stringify(cart));
    updateCartCount();

    // Show success message
    showNotification('상품이 장바구니에 추가되었습니다!');
}

// Remove item from cart
function removeItem(button) {
    const item = button.closest('.border-b, .p-6');
    item.remove();
    showNotification('상품이 삭제되었습니다.');
    updateCartCount();
}

// Update quantity in cart
function updateQuantity(button, change) {
    const container = button.parentElement;
    const quantitySpan = container.querySelector('span');
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(1, quantity + change);
    quantitySpan.textContent = quantity;
}

// Product detail page functions
function changeImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src.replace('w=200', 'w=800');
    }
}

function increaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    if (quantityEl) {
        quantityEl.textContent = parseInt(quantityEl.textContent) + 1;
    }
}

function decreaseQuantity() {
    const quantityEl = document.getElementById('quantity');
    if (quantityEl) {
        const current = parseInt(quantityEl.textContent);
        if (current > 1) {
            quantityEl.textContent = current - 1;
        }
    }
}

// Navigation to product page
function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Login form handler
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (in production, this would be server-side)
    if (email && password) {
        localStorage.setItem('voyageVogueUser', JSON.stringify({ email }));
        showNotification('로그인 성공!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = event.target;

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.remove('translate-x-full');

    setTimeout(() => {
        notification.classList.add('translate-x-full');
    }, 3000);
}

// Search functionality
function handleSearch(event) {
    event.preventDefault();
    const searchTerm = event.target.querySelector('input').value;
    if (searchTerm) {
        window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

// Newsletter subscription
function handleNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    if (email) {
        showNotification('뉴스레터 구독이 완료되었습니다!');
        event.target.reset();
    }
}

// Filter products by category
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sort products
function sortProducts(sortBy) {
    const container = document.querySelector('.products-grid');
    const products = Array.from(container.children);

    products.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);

        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return b.dataset.date - a.dataset.date;
            default:
                return 0;
        }
    });

    products.forEach(product => container.appendChild(product));
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('form[action="#newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }

    // Search form
    const searchForm = document.querySelector('form[action="#search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('voyageVogueUser'));
    if (user) {
        const userIcon = document.querySelector('a[href="login.html"] i');
        if (userIcon) {
            userIcon.classList.remove('fa-user');
            userIcon.classList.add('fa-user-circle');
        }
    }
});

// Image carousel for product gallery
class ProductGallery {
    constructor(container) {
        this.container = container;
        this.images = container.querySelectorAll('.gallery-image');
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.container.querySelector('.prev-btn')?.addEventListener('click', () => this.prev());
        this.container.querySelector('.next-btn')?.addEventListener('click', () => this.next());
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateGallery();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateGallery();
    }

    updateGallery() {
        this.images.forEach((img, index) => {
            img.style.display = index === this.currentIndex ? 'block' : 'none';
        });
    }
}

// Initialize galleries
document.querySelectorAll('.product-gallery').forEach(gallery => {
    new ProductGallery(gallery);
});

// Checkout process
function proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem('voyageVogueUser'));
    if (!user) {
        showNotification('로그인이 필요합니다.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        window.location.href = 'checkout.html';
    }
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('voyageVogueWishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('위시리스트에서 제거되었습니다.');
    } else {
        wishlist.push(productId);
        showNotification('위시리스트에 추가되었습니다.');
    }
    localStorage.setItem('voyageVogueWishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (wishlist.includes(productId)) {
            btn.classList.add('text-red-500');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
        } else {
            btn.classList.remove('text-red-500');
            btn.querySelector('i').classList.remove('fas');
            btn.querySelector('i').classList.add('far');
        }
    });
}

// Currency converter
const exchangeRates = {
    KRW: 1,
    USD: 0.00075,
    EUR: 0.00069,
    JPY: 0.11
};

function convertCurrency(amount, from, to) {
    const krwAmount = amount / exchangeRates[from];
    return krwAmount * exchangeRates[to];
}

function updatePrices(currency) {
    document.querySelectorAll('.price').forEach(priceEl => {
        const krwPrice = parseInt(priceEl.dataset.krw);
        const convertedPrice = convertCurrency(krwPrice, 'KRW', currency);

        let symbol = '₩';
        if (currency === 'USD') symbol = '$';
        else if (currency === 'EUR') symbol = '€';
        else if (currency === 'JPY') symbol = '¥';

        priceEl.textContent = symbol + convertedPrice.toFixed(currency === 'KRW' || currency === 'JPY' ? 0 : 2);
    });
}

// Export functions for use in HTML
window.addToCart = addToCart;
window.removeItem = removeItem;
window.updateQuantity = updateQuantity;
window.changeImage = changeImage;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.goToProduct = goToProduct;
window.toggleMobileMenu = toggleMobileMenu;
window.handleLogin = handleLogin;
window.togglePassword = togglePassword;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.proceedToCheckout = proceedToCheckout;
window.toggleWishlist = toggleWishlist;