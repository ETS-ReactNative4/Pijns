import firebase from 'firebase';

import { FETCH_PIJN_LOG } from './types';

export const sendPijn = ({ postId, author, currentDate }) => {
  const db = firebase.database();

  incrementAuthorPostPijnCount(db, author.id, postId);
  incrementPostsPijnCount(db, postId);
  firebaseRecordPijn(db, currentDate, postId);
};

export const fetchPijnLog = () => {
  const { currentUser } = firebase.auth();
  const currentDate = new Date(
    new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
  );

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/pijns/${currentDate}`)
      .on('value', snapshot => {
        dispatch({ type: FETCH_PIJN_LOG, payload: snapshot.val() }
        );
      }
    );
  };
};

const incrementAuthorPostPijnCount = (db, authorId, postId) => {
  const authorPostRef = db.ref(`/users/${authorId}/posts/${postId}/notes/count`);

  authorPostRef.transaction((currentCount) => (currentCount || 0) + 1);
};

const incrementPostsPijnCount = (db, postId) => {
  const postsRef = db.ref(`/posts/${postId}/notes/count`);

  postsRef.transaction((currentCount) => (currentCount || 0) + 1);
};

const firebaseRecordPijn = (db, currentDate, postId) => {
  const { uid } = firebase.auth().currentUser;
  const userPijnsRef = db.ref(`/users/${uid}/pijns/${currentDate}/${postId}`);

  userPijnsRef.set(Date.now());
};