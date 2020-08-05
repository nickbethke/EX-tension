class EX {
    static INPUT = "input";
    static CHECKBOX = "input:checkbox";
    static TEXTAREA = "textarea";
    static SEPARATOR = "hr";
    constructor(options) {
        this.options = options;
    }
    get Options() {
        return this.renderOptions();
    }
    renderOptions() {
        var $options = $('<div class="wrapper">');
        for (var option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                var _option = this.options[option];
                if (_option.tag != EX.SEPARATOR) {
                    var $wrapper = $('<div>');
                    var $label = $('<label>');
                    $label.attr('for',"id_"+option);
                }
                switch (_option.tag) {
                    case EX.INPUT:
                        var $option = $(`<input>`);
                        $option.addClass('form-check-input');
                        $wrapper.addClass('input-group');
                        if (_option.default) {
                            $option.val(_option.default);
                        }
                        break;
                    case EX.CHECKBOX:
                        var $option = $(`<input>`);
                        $option.addClass('form-check-input');
                        $wrapper.addClass('form-check');
                        $option.attr('type', 'checkbox');
                        if (_option.default) {
                            $option.attr('checked', 'checked');
                        }
                        break;
                    case EX.SEPARATOR:
                        var $option = $(`<hr>`);
                        break;
                }
                if (_option.tag != EX.SEPARATOR) {
                    $option.attr('name', option);
                    $option.attr('id',"id_"+option);
                    $label.html(_option.label);
                    if (_option.tag = EX.CHECKBOX) {
                        $wrapper.append($option).append($label);
                    } else {
                        $wrapper.append($label).append($option);
                    }



                    $options.append($wrapper)
                } else {
                    $options.append($option);
                }

            }

        }
        return $options;
    }
}