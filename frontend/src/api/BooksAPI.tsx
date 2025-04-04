import { Book } from "../types/Book";

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL = "https://localhost:5000/OnlineBook";

export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    sortBy: string,
    sortDirection: string,
    category: string
  ): Promise<FetchBooksResponse> => {
    try {
      const response = await fetch(
        `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}&sortDirection=${sortDirection}&category=${category}`
        // Ensure all query parameters are properly included
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
  
      return await response.json(); // Parse and return the response as JSON
    } catch (error) {
      console.error("Error fetching books:", error); // Log the error to the console for debugging
      throw error; // Rethrow the error to be handled by the calling function
    }
  };
  


export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook?`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error("Failed to add book");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding book", error);
    throw error;
  }
};

export const UpdateBook = async (
  bookID: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookID: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookID}`,
      {
        method: 'DELETE'
      }
    );
    if (!response.ok) {
      throw new Error('Failed to delete book')

    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
