class Tabs {
    constructor($target) {
        console.log($target);
        $target.find('.tabitem').each(function () {
            $(this).click(function () {
                $target.find('.tabitem.active').removeClass('active');
                $(this).addClass('active');
                $target.find('.tabcontent').each(function(){
                    $(this).hide();
                })
                $($(this).data('content')).show();
            })
        })
    }
}
