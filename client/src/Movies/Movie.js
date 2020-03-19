import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRouteMatch, useHistory } from "react-router-dom";
import MovieCard from "./MovieCard";

function Movie({ addToSavedList, movieList, setMovieList }) {
    const [movie, setMovie] = useState(null);
    const match = useRouteMatch();
    const history = useHistory();

    const fetchMovie = id => {
        axios
            .get(`http://localhost:5000/api/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(err => console.log(err.response));
    };

    const saveMovie = () => {
        addToSavedList(movie);
    };

    useEffect(() => {
        fetchMovie(match.params.id);
    }, [match.params.id]);

  

    if (!movie) {
        return <div>Loading movie information...</div>;
    }
    const deleteMovie = () => {
        axios
            .delete(`http://localhost:5000/api/movies/${match.params.id}`)
            .then(res => {
                setMovieList(movieList.filter((movie) => movie.id !== Number(match.params.id)));
                history.push('/');
            })
            .catch(err => {
                console.log("Error deleting movie:", err);
            })
    }


  return (
    <div className='save-wrapper'>
       <MovieCard movie={movie} />
      <div className='save-button' onClick={saveMovie}>
        Save
      </div>
      <Link to={`/update-movie/${match.params.id}`}>
          <div className="edit-button">
              edit
          </div>
      </Link>

      <div className='delete-button' onClick={deleteMovie}>
        Delete
      </div>
    </div>
  );
}

export default Movie;
