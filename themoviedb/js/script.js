const apiKey = config.API_KEY
const baseURL = 'http://image.tmdb.org/t/p/'

var mostPopularMovies = []

function getTrendingList () {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      mostPopularMovies = res.results

      setBannerImage(mostPopularMovies)
      setTitle()
      setMoviesTable(mostPopularMovies)
    })
}

function getRecomendations (item) {
  const url = `https://api.themoviedb.org/3/movie/${item.id}/recommendations?api_key=${apiKey}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      let items = res.results
      var recommendations = document.getElementById('recommendations')

      for (var i = 0; i < items.length; i++) {
        let item = items[i]
        let tmpl = document.getElementById('recomendationsTemplate').content.cloneNode(true)
        tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w154/${item.poster_path}` : 'https://via.placeholder.com/154x239.png?text=NO+IMAGE'
        tmpl.querySelector('.movie-title').innerText = item.original_title
        tmpl.querySelector('.item').onclick = setMovie.bind(event, item)
        recommendations.appendChild(tmpl)
      }
    })
}

function search (page) {
  let searchInput = document.getElementById('searchInput').value

  clearMovie()
  clearTitle()
  clearRecommendation()
  clearPagination()

  if (!searchInput) {
    setTitle()
    setMoviesTable(mostPopularMovies)
    return
  }

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${searchInput}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      setMoviesTable(res.results)
      setPagination(res)
    })
}

function setBannerImage (res) {
  let randomItem = res[Math.floor(Math.random() * 20 + 1)]
  let header = document.getElementById('header')
  header.style.background = randomItem ? `linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6)), url(${baseURL}original/${randomItem.backdrop_path}) no-repeat top` : '#78909C'
  header.style.backgroundSize = 'cover'
}

function setMoviesTable (items) {
  clearMoviesTable()
  var moviesTable = document.getElementById('moviesTable')

  for (var i = 0; i < items.length; i++) {
    let item = items[i]
    let tmpl = document.getElementById('movieListTemplate').content.cloneNode(true)
    tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w45/${item.poster_path}` : 'https://via.placeholder.com/45x68.png?text=NO+IMAGE'
    tmpl.querySelector('.movie-title').innerText = item.original_title
    tmpl.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
    tmpl.querySelector('.item').onclick = setMovie.bind(event, item)
    moviesTable.appendChild(tmpl)
  }
}

function setPagination (res) {
  clearPagination()

  if (!res.total_results) {
    var title = document.getElementById('title')
    let tmpl = document.getElementById('titleTemplate').content.cloneNode(true)
    tmpl.querySelector('.title').innerText = 'No data available'
    title.appendChild(tmpl)
  } else {
    for (var i = 1; i <= res.total_pages; i++) {
      var pager = document.getElementById('pager')
      let tmpl = document.getElementById('pagerTemplate').content.cloneNode(true)
      tmpl.querySelector('.button').innerText = i
      tmpl.querySelector('.button').onclick = search.bind(event, i)
      if (i !== res.page) {
        tmpl.querySelector('.button').classList.add('is-secondary')
      }
      pager.appendChild(tmpl)
    }

    var title = document.getElementById('title')
    var tmpl = document.getElementById('resultsTemplate').content.cloneNode(true)
    tmpl.querySelector('.results').innerText = 'Results'
    tmpl.querySelector('.label').innerText = res.total_results
    title.appendChild(tmpl)
  }
}

function setMovie (item) {
  clearMoviesTable()
  clearPagination()
  clearTitle()
  clearMovie()
  clearRecommendation()

  getRecomendations(item)

  var movie = document.getElementById('movie')
  var tmpl = document.getElementById('movieTemplate').content.cloneNode(true)
  tmpl.querySelector('.title').innerText = item.original_title
  tmpl.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
  tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w342/${item.poster_path}` : 'https://via.placeholder.com/342x513.png?text=NO+IMAGE'
  tmpl.querySelector('.overview').innerText = item.overview
  movie.appendChild(tmpl)
}

function setTitle () {
  var title = document.getElementById('title')
  var tmpl = document.getElementById('titleTemplate').content.cloneNode(true)
  tmpl.querySelector('.title').innerText = 'The weekly trending list'
  title.appendChild(tmpl)
}

function clearMoviesTable () {
  moviesTable.innerHTML = ''
}

function clearPagination () {
  pager.innerHTML = ''
}

function clearTitle () {
  title.innerHTML = ''
}

function clearMovie () {
  movie.innerHTML = ''
}

function clearRecommendation () {
  recommendations.innerHTML = ''
}

window.onload = function() {
  getTrendingList()

  // Execute a Search function when the user presses Enter key
  let searchInput = document.getElementById("searchInput")

  searchInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      search()
    }

    if (!searchInput.value) {
      clearPagination()
      clearRecommendation()
      clearTitle()
      clearMovie()

      setTitle()
      setMoviesTable(mostPopularMovies)
    }
  })

  searchInput.focus()
}






