import { useState } from 'react';
import axios from 'axios';
import './AddMovieForm.css';

const DEFAULT_FORM_VALUES = {
  email: '',
  firstname: '',
  lastname: '',
};

function AddMovieForm({ onSuccessfulMovieCreation }) {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);

  const [MovieCreationError, setMovieCreationError] = useState(null);
  const [MovieCreationSuccess, setMovieCreationSuccess] = useState(null);

  const displayCreationSuccessMessage = () => {
    setMovieCreationSuccess('New Movie created successfully');
    setTimeout(() => {
      setMovieCreationSuccess(null);
    }, 3000);
  };

  const saveMovie = (event) => {
    // This avoid default page reload behavior on form submit
    event.preventDefault();

    setMovieCreationError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/Movie/new`, formValues)
      .then(() => {
        displayCreationSuccessMessage();
        setFormValues(DEFAULT_FORM_VALUES);
        onSuccessfulMovieCreation();
      })
      .catch((error) => {
        setMovieCreationError('An error occured while creating new Movie.');
        console.error(error);
      });
  };

  return (
    <div>
      <form className="add-Movie-form" onSubmit={saveMovie}>
        <input
          className="add-Movie-input"
          required
          type="email"
          placeholder="Email"
          value={formValues.email}
          onChange={(event) =>
            setFormValues({ ...formValues, email: event.target.value })
          }
        />
        <input
          className="add-Movie-input"
          placeholder="First name"
          value={formValues.firstname}
          onChange={(event) =>
            setFormValues({ ...formValues, firstname: event.target.value })
          }
        />
        <input
          className="add-Movie-input"
          placeholder="Last name"
          value={formValues.lastname}
          onChange={(event) =>
            setFormValues({ ...formValues, lastname: event.target.value })
          }
        />
        <button className="add-Movie-button" type="submit">
          Add Movie
        </button>
      </form>
      {MovieCreationSuccess !== null && (
        <div className="Movie-creation-success">{MovieCreationSuccess}</div>
      )}
      {MovieCreationError !== null && (
        <div className="Movie-creation-error">{MovieCreationError}</div>
      )}
    </div>
  );
}

export default AddMovieForm;
