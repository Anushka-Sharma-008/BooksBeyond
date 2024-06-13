// Constants
const apiKey = "AIzaSyA2VXUKnwVMqM67u4l4qjA2qJUQmrcgIcM"; // Replace with your actual Google Books API key
const maxResults = 10;
let startIndex = 0;
let likedBooks = [];

// Reload page when logo is clicked
document.getElementById('logo-img').addEventListener('click', () => {
    location.reload();
});

// Display form for new reader
document.getElementById('new-reader').addEventListener('click', () => {
    displayForm('new');
});

// Display form for existing reader
document.getElementById('existing-reader').addEventListener('click', () => {
    displayForm('existing');
});

// Function to display form
function displayForm(type) {
    const form = document.createElement('form');
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    if (type === 'new') {
        form.innerHTML = `
            <input type="text" placeholder="Name" id="name" required>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Create password" required>
            <input type="password" placeholder="Confirm password" required>
            <button type="submit">Get started!</button>
        `;
    } else if (type === 'existing') {
        form.innerHTML = `
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Continue journey!</button>
        `;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const userName = document.querySelector('#name') ? document.querySelector('#name').value : 'User';
        displayUserOptions(userName);
    });

    mainContent.appendChild(form);
}

// Function to display user options after login/signup
function displayUserOptions(userName) {
    const header = document.querySelector('header');
    header.innerHTML = ''; // Clear existing header content

    const logo = document.createElement('img');
    logo.src = "/newlogo1.jpeg";
    logo.alt = "Books🦇Beyond Logo";
    logo.id = "logo-img";
    logo.addEventListener('click', () => {
        location.reload();
    });
    header.appendChild(logo);

    const title = document.createElement('h1');
    title.textContent = "Books🦇Beyond";
    header.appendChild(title);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';

    const likedBooksBtn = document.createElement('button');
    likedBooksBtn.id = 'liked-books-btn';
    likedBooksBtn.textContent = 'LIKED BOOKS';
    likedBooksBtn.addEventListener('click', displayLikedBooks);
    buttonsContainer.appendChild(likedBooksBtn);

    const searchScreenBtn = document.createElement('button');
    searchScreenBtn.id = 'search-screen-btn';
    searchScreenBtn.textContent = 'SEARCH';
    searchScreenBtn.addEventListener('click', () => {
        displaySearchScreen();
    });
    buttonsContainer.appendChild(searchScreenBtn);

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'LOGOUT';
    logoutBtn.addEventListener('click', () => {
        location.reload();
    });
    buttonsContainer.appendChild(logoutBtn);

    header.appendChild(buttonsContainer);

    // Display the search screen by default after login/signup
    displaySearchScreen();
}

// Function to display liked books
function displayLikedBooks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h2 style="color: white;">Liked Books</h2>';

    if (likedBooks.length === 0) {
        mainContent.innerHTML += '<p style="color: white;">No liked books yet.</p>';
    } else {
        likedBooks.forEach(bookCard => {
            mainContent.appendChild(bookCard.cloneNode(true));
        });
    }
}

// Function to display search screen
function displaySearchScreen() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Search books...">
            <button id="search-btn">Search</button>
        </div>
        <div id="search-results"></div>
        <div id="pagination"></div>
    `;

    // Add event listener to search button
    document.getElementById('search-btn').addEventListener('click', () => {
        startIndex = 0; // Reset start index on new search
        const searchTerm = document.getElementById('search-input').value;
        searchBooks(searchTerm);
    });
}

// Function to toggle bookmark status of a book
function toggleBookmark(bookId, bookCard) {
    const bookmarkButton = bookCard.querySelector('.bookmark-btn');
    const isBookmarked = bookmarkButton.dataset.bookmarked === 'true';

    if (isBookmarked) {
        bookmarkButton.textContent = '❤️';
        bookmarkButton.dataset.bookmarked = 'false';
        likedBooks = likedBooks.filter(book => book.id !== bookId);
    } else {
        bookmarkButton.textContent = '❤️‍🔥';
        bookmarkButton.dataset.bookmarked = 'true';
        likedBooks.push(bookCard.cloneNode(true));
    }
}

// Function to search books using Google Books API
function searchBooks(searchTerm) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the received data
            displaySearchResults(data);
            displayPagination(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle error: display a message to the user or retry the request
        });
}

// Function to display search results
function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    data.items.forEach(item => {
        const book = item.volumeInfo;

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.id = item.id;

        const bookThumbnail = document.createElement('img');
        bookThumbnail.classList.add('book-thumbnail');
        bookThumbnail.src = book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/100x150';
        bookThumbnail.alt = "Book Thumbnail";
        bookCard.appendChild(bookThumbnail);

        const bookDetails = document.createElement('div');
        bookDetails.classList.add('book-details');

        const bookTitle = document.createElement('div');
        bookTitle.classList.add('book-title');
        bookTitle.textContent = book.title;
        bookDetails.appendChild(bookTitle);

        const bookAuthor = document.createElement('div');
        bookAuthor.classList.add('book-author');
        bookAuthor.textContent = book.authors ? book.authors.join(', ') : 'Unknown Author';
        bookDetails.appendChild(bookAuthor);

        const bookDescription = document.createElement('div');
        bookDescription.classList.add('book-description');
        bookDescription.textContent = book.description ? book.description.substring(0, 150) + '...' : 'No description available';
        bookDetails.appendChild(bookDescription);

        const bookmarkButton = document.createElement('button');
        bookmarkButton.classList.add('bookmark-btn');
        bookmarkButton.textContent = '❤️'; // Initially unbookmarked
        bookmarkButton.dataset.bookmarked = 'false';
        bookmarkButton.addEventListener('click', () => {
            toggleBookmark(item.id, bookCard);
        });
        bookDetails.appendChild(bookmarkButton);

        bookCard.appendChild(bookDetails);

        searchResultsContainer.appendChild(bookCard);
    });
}

// Function to display pagination
function displayPagination(data) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalItems = data.totalItems;
    const totalPages = Math.ceil(totalItems / maxResults);

    for (let i = 0; i < totalPages; i++) {
        const pageNumber = i + 1;
        const button = document.createElement('button');
        button.textContent = pageNumber;
        if (startIndex === i * maxResults) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            startIndex = i * maxResults;
            searchBooks(document.getElementById('search-input').value);
        });
        paginationContainer.appendChild(button);
    }
}

// Initial call to display the search screen
displaySearchScreen();
