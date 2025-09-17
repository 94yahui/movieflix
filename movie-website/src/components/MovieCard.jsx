import React from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "src/assets/no-poster.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="ratting">
            <img src="src/assets/star.png" alt=""/>
            {vote_average.toFixed(1)}
          </div>
            <div>
                {original_language}
            </div>
            <div>
              {release_date? release_date.split("-")[0]: "N/A"}
            </div>
        </div>
      </div>
    </div>
    
  );
};

export default MovieCard;
