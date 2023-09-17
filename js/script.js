// Get the UI Elements
let form = document.getElementById('book-form');
let bookList = document.querySelector('#book-list');


// Book Class 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// User Interface Class
class UserInterface {

    static addToBookList(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    static clearToBookList() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 3000);
    }


    // Remove Single Item in the List
    static deleteFromBook(target) {
        if (target.hasAttribute('href')) {
            if (confirm("Are you sure remove item?")) {
                Store.singleItemRemove(target.parentElement.previousElementSibling.textContent.trim());
                target.parentElement.parentElement.remove();
            }
            UserInterface.showAlert("Book Successfully Remove !", 'remove');
        }
    }
}


// Local Storage Adding Book
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayLocalStorageItem() {
        let items = Store.getBooks();

        items.forEach(book => {
            UserInterface.addToBookList(book);
        });
    }


    static singleItemRemove(isbn) {
        let items = Store.getBooks();

        items.forEach((book, index) => {
            if (book.isbn === isbn) {
                items.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(items));
    }
}


// Add Event Listener 
form.addEventListener('submit', newBook);
bookList.addEventListener('click', removeBook);
document.addEventListener('DOMContentLoaded', Store.displayLocalStorageItem());



// Define Function
function newBook(e) {

    let title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;


    if (title == '' || author == '' || isbn == '') {
        UserInterface.showAlert('Please fill all the fields!', 'error');
    } else {
        let book = new Book(title, author, isbn);

        // Adding to Book List
        UserInterface.addToBookList(book);

        // Clear All Fields
        UserInterface.clearToBookList();

        UserInterface.showAlert('Added Successfully', 'success');


        // Adding book in Local Storage
        Store.addBooks(book);
    }

    e.preventDefault();
}

// Remove Book In the Book List
function removeBook(e) {

    UserInterface.deleteFromBook(e.target);

    e.preventDefault();
}



// Storage Task in Local Storage