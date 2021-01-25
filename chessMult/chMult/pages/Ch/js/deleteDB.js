$("#delete-submit").click(function () {
	//alert("hej");
	var test="if not included I get an error on live server";
	$.ajax({
		type:'POST',
		url:'../deleteMoves.php',
		data:{test: test},
		dataType:'json',
		success:function(data){
			//alert(data.msg);
			$("#DeleteMoves").val("");
		}
	})
	
});	

$("#deleteGame-submit").click(function () {
	//alert(window.location.href );
	//var search_query = getUrlVars()['id'];
	//var search_query = "http://google.com";
	
	var test="if not included I get an error on live server";
	$.ajax({
		type:'POST',
		url:'../deleteGame.php',
		data:{test: test},
		dataType:'json',
		success:function(data){
			//alert(data.msg);
			//window.location.href =window.location.href;
			
			
		}
	})
	
	
});	
