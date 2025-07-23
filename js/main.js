$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

const apiKey = 'API_KEY_HERE';

function getMovies(searchText){
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchText)}`)
    .then((response) => {
      console.log(response);
      let movies = response.data.results;
      let output = '';
      $.each(movies, (index, movie) => {
        // Poster, başlık veya id yoksa filmi gösterme
        if (!movie.poster_path || !movie.title || !movie.id) return;
        const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${poster}">
              <h5>${movie.title}</h5>
              <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.genres.map(g => g.name).join(', ')}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.adult ? '18+' : 'PG'}</li>
              <li class="list-group-item"><strong>TMDb Rating:</strong> ${movie.vote_average}</li>
              <li class="list-group-item"><strong>Overview:</strong> ${movie.overview}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.overview}
            <hr>
            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-primary">View on TMDb</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
}
