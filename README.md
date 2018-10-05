# personal-library
Full Stack Personal Library


- [X] Nothing from my website will be cached in my client as a security measure.
- [X] I will see that the site is powered by 'PHP 4.2.0' even though it isn't as a security measure.
- [X] I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
- [X] I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount.
- [X] I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).
- [X] I can post a comment to /api/books/{_id} to add a comment to a book and returned will be the books object similar to get /api/books/{_id}.
- [X] I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
- [X] If I try to request a book that doesn't exist I will get a 'no book exists' message.
- [X] I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
- [X] All 6 functional tests required are complete and passing.

Example usage:

| API | GET | POST | DELETE |
| --- | --- | ---- | ------ |
| `/api/books` | list all books | add new book | delete all books |
| `/api/books/Hatchet` | show book Hatchet | add comment to Hatchet | delete Hatchet |

Completed Project:
-----
* https://personal-library-fcc-cmccormack.glitch.me/

