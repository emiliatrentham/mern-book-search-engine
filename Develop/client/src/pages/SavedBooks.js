//import React, { useState, useEffect } from 'react';
import React, {  } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;


  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  // get the client object
  const client = useApolloClient(); 

  const userData = data?.me || {};

  /*useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
          return false;
        }
        const response = await getMe(token);
        if (!response.ok) {
          throw new Error('something went wrong!');
        }
        const user = await response.json();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };
    getUserData();
  }, [userDataLength]);*/

  // function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId }
      });

      // remove book's id from localStorage once successful
      removeBookId(bookId);

      if (data?.removeBook) {
        const updatedUserData = { ...userData };
        updatedUserData.savedBooks = updatedUserData.savedBooks.filter((savedBook) => savedBook.bookId !== bookId);
        // update user data in the cache to remove deleted book
        client.writeQuery({
          query: GET_ME,
          data: { me: updatedUserData }
        });
      }
    } catch (err) {
      console.error(err);
    }

    /*try {
      const response = await deleteBook(bookId, token);
      if (!response.ok) {
        throw new Error('something went wrong!');
      }
      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }*/
  };

  // alert if data isn't here yet, say so
  if (loading) {
    return (<h2>LOADING...</h2>);
  }

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;