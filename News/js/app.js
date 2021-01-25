$(document).ready(function () {
  var k=Math.floor(Math.random() * 10);
  console.log(k);
  var url = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5f28f194a04e42d28fb05c61a18c1370";
  switch(k) {
  case 0: url="http://newsapi.org/v2/top-headlines?country=in&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 1: url="https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 2: url="https://newsapi.org/v2/everything?q=bitcoin&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 3: url="https://newsapi.org/v2/everything?q=apple&from=2020-10-18&to=2020-10-18&sortBy=popularity&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 4: url="http://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 5: url="http://newsapi.org/v2/everything?domains=wsj.com&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 6: url="http://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 7: url="http://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 8: url="http://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 9: url="http://newsapi.org/v2/top-headlines?country=au&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  default:
    url="https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=5f28f194a04e42d28fb05c61a18c1370";
}

  $.ajax({
    url: url,
    method: "GET",
    dataType: "JSON",

    beforeSend: function () {
      $(".progress").show();
    },

    complete: function () {
      $(".progress").hide();
    },

    success: function (newsdata) {
      let output = "";
      let latestNews = newsdata.articles;
      for (var i in latestNews) {
        output += `
          <div class="col l4 m6 s12">
          <div class="card medium hoverable">
            <div class="card-image">
              <img src="${latestNews[i].urlToImage}" class="responsive-img" alt="${latestNews[i].title}">
            </div>
            <div class="card-content">
              <span class="card-title activator"><i class="material-icons right">more_vert</i></span>
              <h6 class="truncate">Title: <a href="${latestNews[i].url}" title="${latestNews[i].title}">${latestNews[i].title}</a></h6>
              <p><b>Author</b>: ${latestNews[i].author} </p>
              <p><b>News source</b>: ${latestNews[i].source.name} </p>
              <p><b>Published</b>: ${latestNews[i].publishedAt} </p>
            </div>

            <div class="card-reveal">
              <span class="card-title"><i class="material-icons right">close</i></span>
              <p><b>Description</b>: ${latestNews[i].description}</p>
            </div>

            <div class="card-action">
              <a href="${latestNews[i].url}" target="_blank" class="btn">Read More</a>
            </div>
           </div>
          </div>
        `;
      }

      if (output !== "") {
        $("#newsResults").html(output);
      }

    },

    error: function () {
      let errorMsg = `<div class="errorMsg center">Some error occured</div>`;
      $("#newsResults").html(errorMsg);
    }
  })

});