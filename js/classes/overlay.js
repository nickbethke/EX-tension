class Overlay {
    constructor() {
        this.overlay = $('<div>').addClass('overlay-container');
        var $wrapper = $('<div>').addClass('overlay-wrapper');
        var $header = $('<div>').addClass('overlay-header');
        var $content = $('<div>').addClass('overlay-content');

        $wrapper.append($header).append($content);
        this.overlay.append($wrapper);
        $('body').append(this.overlay);
        this.overlay.hide();

        this.overlay.click(()=>{
            this.overlay.hide();
        })
    }
    head(h) {
        this.overlay.find('.overlay-header').html(h);
    }
    content(c) {
        this.overlay.find('.overlay-content').html(c);
    }
    footer(f) {
        var $footer = $('<div>').addClass('overlay-footer').html(f);
        $(this.overlay).find('overlay-wrapper').append($footer);
    }
    show() {
        this.overlay.show();
    }
    destroy() {

    }
}