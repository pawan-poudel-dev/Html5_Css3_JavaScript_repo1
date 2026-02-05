


let cart = JSON.parse(localStorage.getItem('ecomart_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('ecomart_wishlist')) || [];

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('ecomart_cart', JSON.stringify(cart));
}

// Function to save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('ecomart_wishlist', JSON.stringify(wishlist));
}

// Function to add item to cart
function addToCart(productName, price, image, description = '') {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            image: image,
            description: description,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${productName} added to cart!`, 'success');
    updateCartBadge();
}

// Function to add item to wishlist
function addToWishlist(productName, price, image, description = '') {
    const existingItem = wishlist.find(item => item.name === productName);
    
    if (existingItem) {
        showNotification(`${productName} is already in your wishlist!`, 'info');
        return;
    }
    
    wishlist.push({
        id: Date.now(),
        name: productName,
        price: price,
        image: image,
        description: description
    });
    
    saveWishlist();
    showNotification(`${productName} added to wishlist!`, 'success');
}

// Function to remove item from cart
function removeFromCart(productName) {
    const index = cart.findIndex(item => item.name === productName);
    if (index > -1) {
        cart.splice(index, 1);
        saveCart();
        showNotification('Item removed from cart!', 'info');
        updateCartBadge();
    }
}

// Function to remove item from wishlist
function removeFromWishlist(productName) {
    const index = wishlist.findIndex(item => item.name === productName);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveWishlist();
        showNotification('Item removed from wishlist!', 'info');
    }
}

// Function to update cart badge count
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Function to show notifications
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-in-out;
        ${type === 'success' ? 'background-color: #4CAF50; color: white;' : 'background-color: #2196F3; color: white;'}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// HOME PAGE FUNCTIONAL

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart badge
    updateCartBadge();
    
    // Product image cycling on hover
    const items = document.querySelectorAll('.item');
                
    items.forEach((item) => {
        const img = item.querySelector('.itemImage');
        if (!img) return;

        const dataImages = item.dataset.images;
        if (!dataImages) return;
                    
        const originalSrc = img.src;
        let imageArray = [];
                    
        try {
            imageArray = JSON.parse(dataImages);
            if (!Array.isArray(imageArray)) {
                imageArray = [dataImages];
            }
        } catch(e) {
            imageArray = [dataImages];
        }
                    
        let currentIndex = 0;
        let cycleInterval;
                    
        item.addEventListener('mouseenter', function() {
            clearInterval(cycleInterval);
            currentIndex = 0;
                        
            cycleInterval = setInterval(() => {
                img.src = imageArray[currentIndex];
                currentIndex = (currentIndex + 1) % imageArray.length;
            }, 500);
        });
                    
        item.addEventListener('mouseleave', function() {
            clearInterval(cycleInterval);
            img.src = originalSrc;
            currentIndex = 0;
        });
    });
                
    // Review slider functionality
    const leftArrow = document.querySelector('.review-arrow-left');
    const rightArrow = document.querySelector('.review-arrow-right');
    const reviewItems = document.querySelectorAll('.review-item');
    let currentReview = 0;
                
    if (leftArrow && rightArrow && reviewItems.length > 0) {
        const showReview = (index) => {
            reviewItems.forEach((item) => item.classList.remove('active'));
            reviewItems[index].classList.add('active');
        };
                    
        leftArrow.addEventListener('click', () => {
            currentReview = (currentReview - 1 + reviewItems.length) % reviewItems.length;
            showReview(currentReview);
        });
                    
        rightArrow.addEventListener('click', () => {
            currentReview = (currentReview + 1) % reviewItems.length;
            showReview(currentReview);
        });
    }

    // Quantity adjustment buttons functionality
    const itmamt = document.querySelectorAll('.item-amount');
    const btnInc = document.querySelectorAll('.button-increase');
    const btnDec = document.querySelectorAll('.button-decrease');

    btnInc.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let currentValue = parseInt(itmamt[index].value);
            if (currentValue < parseInt(itmamt[index].max)) {
                itmamt[index].value = currentValue + 1;
            }
        });
    });
    
    btnDec.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let currentValue = parseInt(itmamt[index].value);
            if (currentValue > parseInt(itmamt[index].min)) {
                itmamt[index].value = currentValue - 1;
            }
        });
    });
    // DEDICATED PRODUCT PAGE FUNCTIONALITY
    

    // Add to cart button on product page
    const addToCartButton = document.querySelector('.add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productName = document.querySelector('.dedicated-name')?.textContent || 'Product';
            const priceText = document.querySelector('.price')?.textContent || '0';
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const image = document.querySelector('.front-image img')?.src || '';
            const description = document.querySelector('.dedicated-description p')?.textContent || '';
            const quantity = parseInt(document.querySelector('.item-amount')?.value || 1);
            
            for (let i = 0; i < quantity; i++) {
                addToCart(productName, price, image, description);
            }
        });
    }

    // Add to wishlist button on product page
    const addToWishlistButton = document.querySelector('.add-to-wishlist');
    if (addToWishlistButton) {
        addToWishlistButton.addEventListener('click', function() {
            const productName = document.querySelector('.dedicated-name')?.textContent || 'Product';
            const priceText = document.querySelector('.price')?.textContent || '0';
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            const image = document.querySelector('.front-image img')?.src || '';
            const description = document.querySelector('.dedicated-description p')?.textContent || '';
            
            addToWishlist(productName, price, image, description);
        });
    }


    // WISHLIST PAGE FUNCTIONALITY


    // Handle wishlist buttons
    const moveToCartButtons = document.querySelectorAll('.mov2cart');
    const removeButtons = document.querySelectorAll('.remove');
    const saveForLaterButtons = document.querySelectorAll('.saveforlater');

    moveToCartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const wishitemContainer = this.closest('.wishitm');
            if (wishitemContainer) {
                const productName = wishitemContainer.querySelector('.itmName')?.textContent || 'Product';
                const priceText = wishitemContainer.querySelector('.price')?.textContent || '0';
                const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
                const image = wishitemContainer.querySelector('img')?.src || '';
                
                addToCart(productName, price, image);
                
                // Remove from wishlist display
                wishitemContainer.style.animation = 'fadeOut 0.3s ease-in-out';
                setTimeout(() => {
                    wishitemContainer.remove();
                }, 300);
            }
        });
    });

    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const wishitemContainer = this.closest('.wishitm');
            if (wishitemContainer) {
                const productName = wishitemContainer.querySelector('.itmName')?.textContent || 'Product';
                removeFromWishlist(productName);
                
                wishitemContainer.style.animation = 'fadeOut 0.3s ease-in-out';
                setTimeout(() => {
                    wishitemContainer.remove();
                }, 300);
            }
        });
    });

    saveForLaterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const wishitemContainer = this.closest('.wishitm');
            if (wishitemContainer) {
                const productName = wishitemContainer.querySelector('.itmName')?.textContent || 'Product';
                showNotification(`${productName} saved for later!`, 'success');
            }
        });
    });

    // Add animation style for wishlist
    if (!document.querySelector('style[data-wishlist]')) {
        const wishlistStyle = document.createElement('style');
        wishlistStyle.setAttribute('data-wishlist', 'true');
        wishlistStyle.textContent = `
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-100px);
                }
            }
        `;
        document.head.appendChild(wishlistStyle);
    }
});


// Make the cart and wishlist data accessible globally for cart page
function getCartItems() {
    return cart;
}

function getWishlistItems() {
    return wishlist;
}

function updateCart(updatedCart) {
    cart = updatedCart;
    saveCart();
}

function updateWishlist(updatedWishlist) {
    wishlist = updatedWishlist;
    saveWishlist();
}