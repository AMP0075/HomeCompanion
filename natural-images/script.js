var APIKey = '11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192';

$.getJSON('https://api.unsplash.com/search/photos?query=natural&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=snow&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid2').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=hills&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid3').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=river&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid4').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=ocean&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid5').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=trees&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid6').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});

$.getJSON('https://api.unsplash.com/search/photos?query=garden&per_page=50&client_id=11f2ff5a50fcce4df43aa4c897d132d3f5ad4a84ed0aec7be67718deb5120192', function(data) {
  console.log(data);
  
  
  var imageList = data.results;
  
  $.each(imageList, function(i, val) {
    
    var image = val;
    var imageURL = val.urls.regular;
    var imageWidth = val.width;
    var imageHeight = val.height;
    
    if (imageWidth >= imageHeight) {
      $('.grid7').append('<div class="image"><img src="'+ imageURL +'"></div>');
    }   
    
  });  
});
