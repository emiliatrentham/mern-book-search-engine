

import { gql } from '@apollo/client';

// fetch the current logged-in user's information, including their id, username, email, bookCount, and savedBooks array
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;