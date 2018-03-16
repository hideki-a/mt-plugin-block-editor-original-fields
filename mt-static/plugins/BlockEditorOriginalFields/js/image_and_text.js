; (function ($) {
    var BEF = MT.BlockEditorField;
    var label = trans('ImageAndText');

    BEF.ImageAndText = function () { BEF.apply(this, arguments) };
    $.extend(BEF.ImageAndText, {
        label: trans('ImageAndText'),
        create_button: function () {
          return $('<button type="button" class="btn btn-contentblock"><svg title="' + label + '" role="img" class="mt-icon"><use xlink:href="' + StaticURI + 'plugins/BlockEditorOriginalFields/images/sprite.svg#ic_image_and_text"></use></svg>' + label + '</button>');
        },
    });
    $.extend(BEF.ImageAndText.prototype, BEF.prototype, {
        id: '',
        input_field: '',
        options: {},

        get_id: function () {
            return this.id;
        },
        get_type: function () {
            return 'image_and_text';
        },
        get_svg: function() {
            return '<svg title="' + this.get_type() + '" role="img" class="mt-icon mt-icon--sm"><use xlink:href="' + StaticURI + 'plugins/BlockEditorOriginalFields/images/sprite.svg#' + this.get_svg_name() + '" /></svg>';
        },
        get_svg_name: function() {
            return 'ic_image_and_text';
        },
        _exist_val: function (strings, ...values) {
            if (values[0]) {
                return values[0];
            }
            return '';
        },
        create: function (id, data) {
            var self = this;
            self.id = id;
            self.input_field = $('<div class="row no-gutters py-2"><div class="col col-md-6"><div class="form-group"><div class="asset_field"><input type="hidden" name="' + id + '-url" id="' + id + '-url" value=""><input type="hidden" name="' + id + '" id="' + id + '" value=""></div></div></div></div>');
            var edit_link = $('<div class="edit-image-link"></div>');;
            var edit_image_link = $('<div class="rounded-circle action-link"><a href="#" class="edit_image mt-open-dialog mt-modal-open" data-mt-modal-large>' + trans('edit Image') + '</a></div>');
            var delete_image_link = $('<div class="remove_image rounded-circle action-link"><a href="#" class="remove_image">' + trans('delete') + '</a></div>');
            edit_link.append(edit_image_link);
            edit_link.append(delete_image_link);
            self.input_field.find('#' + id).val(data.value);
            self.preview_field = $('<div></div>');
            self.preview_field.attr('id', id + '-preview');
            self.preview_field.addClass('img-preview');
            if (data.asset_url && data.asset_url != "") {
                self.preview_field.css('background-image', 'url(' + data.asset_url + ')');
                self.input_field.find('#' + id + '-url').val(data.asset_url);
            }
            if(data.asset_id && data.asset_id != ""){
                self.input_field.find('#' + id).val(data.asset_id);
            }

            const textarea = [
                `<div class="col col-md-6">`,
                `<div class="form-group">`,
                `<label for="${id}-content">テキスト</label>`,
                `<input type="hidden" data-target="${id}-content" value="richtext">`,
                `<textarea name="${id}-content" id="${id}-content" class="text high editorfield content-field form-control w-100" style="height: 15rem;" mt:watch-change="1">${self._exist_val `${data.content}`}</textarea>`,
                `</div>`,
                `</div>`,
            ];
            self.input_field.append($(textarea.join('')));

            $(window).one('field_created', function () {
                new MT.EditorManager(self.id + '-content', {
                    format: 'richtext',
                    wrap: true,
                });
            });

            self.preview_field.append(edit_link);
            self.input_field.find('.asset_field').append(self.preview_field);
            // self.input_field.find('a.mt-modal-open').mtModal();

            edit_link.on('click', '.remove_image', function(event){
                event.preventDefault();
                self.preview_field.css('background-image', 'none');
                $('#' + id + '-url').val('');
                $('#' + id).val('');
                Object.keys(self.options).forEach(function (key) {
                    self.options_field.find('#' + self.id + '_option_' + key).val('');
                    self.options = [];
                });
            });

            edit_image_link.find('a').on('click',function(){
                var link = self.get_edit_link();
                $(this).mtModal.open(link, {large: true});
                return false;
            });

            return self.input_field;
        },
        get_edit_link: function(){
            var self = this;
            var data = self.get_data();
            var link = ScriptURI;
            link += '?__mode=blockeditor_dialog_list_asset';
            link += '&amp;edit_field=' + self.id;
            link += '&amp;blog_id=' + $('[name=blog_id]').val();
            link += '&amp;dialog_view=1';
            link += '&amp;filter=class';
            link += '&amp;filter_val=image';
            link += '&amp;next_mode=block_editor_dialog_insert_options';
            link += '&amp;asset_select=1';
            if(self.asset_id && self.asset_id != ''){
                link += '&amp;asset_id=' + self.asset_id ;
            }
            link += '&amp;options=' + JSON.stringify(self.options);
            return link;
        },
        get_field_options: function (field_options) {
            var self = this;
            self.options_field = $('<div class="options"></div>');

            var option_alt = $('<div class="form-group"><label for="' + self.id + '_option_alt" class="form-control-label">' + trans('alt') + '</label><input type="text" name="field_option_alt" id="' + self.id + '_option_alt" class="form-control" mt:watch-change="1"></div>');
            self.options_field.append(option_alt);

            const image_position = [
                `<fieldset class="form-group"><legend class="h4 mt-0">画像の位置</legend>`,
                `<div class="custom-control custom-radio">`,
                `<input id="${self.id}-left" name="field_option_image_position_${self.id}" type="radio" value="L" class="custom-control-input" mt:watch-change="1">`,
                `<label class="custom-control-label" for="${self.id}-left">左</label>`,
                `</div>`,
                `<div class="custom-control custom-radio">`,
                `<input id="${self.id}-right" name="field_option_image_position_${self.id}" type="radio" value="R" class="custom-control-input" mt:watch-change="1">`,
                `<label class="custom-control-label" for="${self.id}-right">右</label>`,
                `</div>`,
                `</fieldset>`,
            ]
            self.options_field.append($(image_position.join('')));

            var callback = function () {
                return function () {
                    var name = $(this).attr('name');
                    var val = $(this).val();
                    self.set_option.call(self, name, val);
                };
            }();
            self.options_field.on('change', 'input', callback);

            Object.keys(self.options).forEach(function (key) {
                if (key === 'image_position') {
                    if (self.options.image_position === 'L') {
                        self.options_field.find('input#' + self.id + '-left').prop('checked', true);
                    } else if (self.options.image_position === 'R') {
                        self.options_field.find('input#' + self.id + '-right').prop('checked', true);
                    }
                } else {
                    self.options_field.find('input#' + self.id + '_option_' + key).val(self.options[key]);
                }
            });

            return field_options.append(self.options_field);
        },
        set_option: function (name, val) {
            var style_name = name.replace('field_option_', '');
            this.options[style_name] = val;
        },
        get_data: function () {
            var self = this;
            var data = {
                'content': $('#' + self.id + '-content').html(),
                'asset_id': $('#' + self.id).val(),
                'asset_url': self.get_src(),
                'html': self.get_html(),
                'options': self.options,
            };

            return data;
        },
        get_html: function () {
            var self = this;
            if($('#' + self.id + '-url').val() == ""){
                return '';
            }
            const html = [
                `<div class="lytimage -image${self.options.image_position}">`,
                `<div class="lytimage__image">`,
                `<img src="${$('#' + self.id + '-url').val()}" data-asset-id="${$('#' + self.id).val()}" alt="${$('#' + self.id + '_option_alt').val()}">`,
                `</div>`,
                `<div class="lytimage__text">${$('#' + self.id + '-content').html()}</div>`,
                `</div>`,
            ];

            return html.join('');
        },
        get_src: function() {
            var self = this;
            return $('#' + self.id + '-url').val();
        }
    });

    MT.BlockEditorFieldManager.register('image_and_text', BEF.ImageAndText);

})(jQuery);
