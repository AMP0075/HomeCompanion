$(document).ready(function () {
  var k=Math.floor(Math.random() * 20);
  console.log(k);
  var url = "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
  switch(k) {
  case 0: url="http://newsapi.org/v2/top-headlines?country=br&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 1: url="http://newsapi.org/v2/top-headlines?country=ie&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 2: url="http://newsapi.org/v2/top-headlines?country=ca&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 3: url="http://newsapi.org/v2/top-headlines?country=nz&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 4: url="http://newsapi.org/v2/top-headlines?country=gb&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 5: url="http://newsapi.org/v2/top-headlines?country=ng&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 6: url="http://newsapi.org/v2/top-headlines?country=za&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 7: url="http://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 8: url="http://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 9: url="http://newsapi.org/v2/top-headlines?country=au&category=technology&apiKey=5f28f194a04e42d28fb05c61a18c1370";
      break;
  case 10: url="http://newsapi.org/v2/top-headlines?country=br&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 11: url="http://newsapi.org/v2/top-headlines?country=ie&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 12: url="http://newsapi.org/v2/top-headlines?country=ca&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 13: url="http://newsapi.org/v2/top-headlines?country=nz&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 14: url="http://newsapi.org/v2/top-headlines?country=gb&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 15: url="http://newsapi.org/v2/top-headlines?country=ng&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  case 16: url="http://newsapi.org/v2/top-headlines?country=za&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 17: url="http://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 18: url="http://newsapi.org/v2/top-headlines?country=us&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;  
  case 19: url="http://newsapi.org/v2/top-headlines?country=au&category=science&apiKey=5f28f194a04e42d28fb05c61a18c1370";
		  break;
  default:
    url="http://newsapi.org/v2/everything?q=technology&from=2020-10-03&sortBy=publishedAt&apiKey=5f28f194a04e42d28fb05c61a18c1370";
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