/*---------- Faqs Accordion ----------*/
$(document).ready(function(){
  
    $(".accordion-container .accordion").click(function(){

      // self clicking close
      if($(this).hasClass("active")){
        $(this).removeClass("active");
        $(this).find("i").removeClass("fa-minus").addClass("fa-plus")	
      }

      else{
        $(".accordion-container .accordion").removeClass("active");
        $(".accordion-container .accordion .accordion-heading i").removeClass("fa-minus").addClass("fa-plus");
        $(this).addClass("active");
        $(this).find("i").removeClass("fa-plus").addClass("fa-minus")
      }
    })

  })