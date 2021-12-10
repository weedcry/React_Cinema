
import $ from 'jquery'; 
$(document).ready(function () {
    var $cinemadep = $('.seat_area a.select');
    // var $cinemadep = $('.select');
    var check = 1;

    $(".seat_setting li input").change(function() {
        if(this.checked) {
            check = Number($(this).attr("value"))
        }
    });

    setTimeout(() => {
    $('.seat_area a.select')
        .mouseover(function () {
            switch(check)
            {
                case 1:
                    $(this).addClass('over')
                    break;
                case 2:
                    $(this).addClass('over')

                    if($(this).next("a").hasClass("select")){
                        $(this).next("a").addClass('over')
                    }

                    break;
                // case 3: 
                //     $(this).addClass('over')
                //     $(this).next("a").addClass('over')
                //     $(this).next("a").next("a").addClass('over')
                //     break;
                // case 4: 
                //     $(this).addClass('over')
                //     $(this).next("a").addClass('over')
                //     $(this).next("a").next("a").addClass('over')
                //     $(this).next("a").next("a").next("a").addClass('over')
                //     break;
            }
        })
        .mouseout(function () {
            $('.seat_area a.select').removeClass('over')
        })

    }, 1000); 

    setTimeout(() => {
        $("#resetGhe").click(function (e) { 
            e.preventDefault();
            $('.seat_area a').removeClass('over overSelect')
            $('.seat_area a').addClass('select')
        });
    }, 1000); 


        setTimeout(() => {
        $('.seat_area a.select').click(function (e) { 
            e.preventDefault();
            if( ! $(this).hasClass("overSelect")){
                switch(check)
                {
                    case 1:
                        $(this).addClass('overSelect')
                        $(this).removeClass('select')
                        break;
                    case 2:
                        $(this).addClass('overSelect')
                        $(this).removeClass('select')


                        if($(this).next("a").hasClass("select")){
                            $(this).next("a").addClass('overSelect')
                            $(this).next("a").removeClass('select')
                        }

                        break;
                    // case 3: 
                    //     $(this).addClass('overSelect')
                    //     $(this).next("a").addClass('overSelect')
                    //     $(this).next("a").next("a").addClass('overSelect')

                    //     $(this).removeClass('select')
                    //     $(this).next("a").removeClass('select')
                    //     $(this).next("a").next("a").removeClass('select')
                    //     break;
                    // case 4: 
                    //     $(this).addClass('overSelect')
                    //     $(this).next("a").addClass('overSelect')
                    //     $(this).next("a").next("a").addClass('overSelect')
                    //     $(this).next("a").next("a").next("a").addClass('overSelect')

                    //     $(this).removeClass('select')
                    //     $(this).next("a").removeClass('select')
                    //     $(this).next("a").next("a").removeClass('select')
                    //     $(this).next("a").next("a").next("a").removeClass('select')
                    //     break;
                }

        }else{
            switch(check)
            {
                case 1:
                    $(this).addClass('select')
                    $(this).removeClass('overSelect')
                    break;
                case 2:
                    $(this).addClass('select')
                    $(this).next("a").addClass('select')

                    $(this).removeClass('overSelect')
                    $(this).next("a").removeClass('overSelect')

                    break;
                // case 3: 
                //     $(this).addClass('select')
                //     $(this).next("a").addClass('select')
                //     $(this).next("a").next("a").addClass('select')

                //     $(this).removeClass('overSelect')
                //     $(this).next("a").removeClass('overSelect')
                //     $(this).next("a").next("a").removeClass('overSelect')
                //     break;
                // case 4: 
                //     $(this).addClass('select')
                //     $(this).next("a").addClass('select')
                //     $(this).next("a").next("a").addClass('select')
                //     $(this).next("a").next("a").next("a").addClass('select')

                //     $(this).removeClass('overSelect')
                //     $(this).next("a").removeClass('overSelect')
                //     $(this).next("a").next("a").removeClass('overSelect')
                //     $(this).next("a").next("a").next("a").removeClass('overSelect')
                //     break;
            }
        }

        });

    }, 1000); 

});