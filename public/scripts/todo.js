/*global $*/
$(document).ready(function(){
    $("ul").on("click", "li", function(){
        $(this).toggleClass("completed"); 
    });
});

$(document).ready(function(){
    $("ul").on("click","span", function(event){
        $(this).parent().fadeOut(500, function(){
           $(this).remove(); 
        }); 
        event.stopPropagation();
    });
});
$(document).ready(function(){
   $("ul").on("click", "span:nth-child(2)", function(event){
       
   }); 
});

$("input[type='text']").keypress(function(){
    if(event.which === 13){
        window.location = "/todo/new";
    }
});


