import { Link } from 'react-router-dom';
import './SubHeader.css';
import { useEffect, useState } from 'react';

const DEFAULT_FORM_ACTOR = {
  searchMovie: '',
};

const SubHeader = () => {
  const [formActor, setFormActor] = useState(DEFAULT_FORM_ACTOR);

  return (
    <div className="SubHeader-container">
      <div className="dropdown nav-item">
        <span className="dropdown-label">Genre</span>
        <div className="dropdown-content">
          <Link className="Link" to="/My Movies">
            Genre 1
          </Link>
          <Link className="Link" to="/My Movies">
            Genre 2
          </Link>
          <Link className="Link" to="/My Movies">
            Genre 3
          </Link>
        </div>
      </div>
      <div>|</div>
      <span style={{ marginRight: '8px' }}>Search by actor/director :</span>
      <input
        placeholder="Speed"
        value={formActor.searchMovie}
        onChange={(event) =>
          setFormActor({ ...formActor, searchMovie: event.target.value })
        }
      />
      <div>|</div>
      <Link className="SubLink" to="/My Movies">
        My Movies
      </Link>
    </div>
  );
};

export default SubHeader;
