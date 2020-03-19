import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouteMatch, useHistory } from "react-router-dom";

function UpdateMovie({ movieList, setMovieList }) {

    const [movie, setMovie] = useState({ title: "", director: "", metascore: 0, stars: []});
    const match = useRouteMatch();
    const history = useHistory();

    const fetchMovie = Movieid => {
        axios
            .get(`http://localhost:5000/api/movies/${Movieid}`)
            .then(res => {
                setMovie(res.data);
            })
            .catch(err => console.log('fetch movie error',err.response));
    };

    useEffect(() => {
        fetchMovie(match.params.id);
    }, [match.params.id]);


    const handleChange = e => {
        if (e.target.name !== "actor") {
            setMovie({ ...movie, [e.target.name]: e.target.value });
        }
        else {
            const newStars = [...movie.stars];
            newStars[Number(e.target.id)] = e.target.value;

            setMovie({
                ...movie,
                stars: newStars
            });
        }
    };

    const updateMovie = e => {
        e.preventDefault();

        axios
            .put(`http://localhost:5000/api/movies/${match.params.id}`, movie)
            .then(res => {
                setMovieList([
                    movie,
                    ...movieList.filter(movie => movie.id !== Number(match.params.id))
                ]);
                history.push(`/movies/${match.params.id}`);
            })
            .catch(err => {
                console.log("Error updating movie:", err);
            });
    };

    return (
        <div className="update-movie">
            <h3>Update {movie.title === "" ? "Movie" : movie.title}</h3>

            {movie.title === "" ? "Loading movie information..." : ""}

            <form onSubmit={updateMovie}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={movie.title}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="director"
                    placeholder="Director"
                    value={movie.director}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="metascore"
                    placeholder="Metascore"
                    value={movie.metascore}
                    onChange={handleChange}
                />
                <hr />
                {movie.stars.map((actor, key) => {
                    return (
                        <input
                            key={key}
                            type="text"
                            name="actor"
                            id={key}
                            placeholder={actor}
                            value={actor}
                            onChange={handleChange}
                        />
                    );
                })}
                <hr />
                <input type="submit" />
            </form>
        </div>
    );
}

export default UpdateMovie;