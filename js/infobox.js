$(document).on('ready', function () {
    var $wrap = $('#wrapper'),
        items;

    $.getJSON( "../src/info_box.json", function(data) {
        items = data;
        infobox = new InfoBox({ items: items, renderTo: $wrap });
        appendControlsTo(infobox, $wrap);
    });
    
});

InfoBox = function (opts) {
    if (opts === undefined || !opts.renderTo)
        return;

    var renderTo = opts.renderTo,
        self = this;

    var attachEvent = function ($elem) {
        var detailsFlag = false;
        $elem.on('click', function (event) {
            detailsFlag = !detailsFlag;
            $(this).closest('.item-container').toggleClass('show-details', !detailsFlag)
               .toggleClass('hide-details', detailsFlag);
        })
    }

    this.render = function () {
        if (this.active === undefined || this.active === null) {
            this.active = 0;
        }
        this.$el.append(this.template);
        this.$container = this.$el.find('.component');
        this.renderActiveItem();
    };

    this.renderActiveItem = function (item) {
        var prevItem = this.$container.find(".item-container"),
            $template = $($('#item-template').html()), 
            item = this.collection[this.active],
            $note;

        if (item.img === undefined) item.img = item.field;

        $template.attr('data-id', this.active);
        $template.find('img').attr('src', 'src/img/' + item.img);
        $template.find('header').text(item.title);
        $note = $('<span class="note"/>').text(item.note);
        $template.find('.desc').text(item.description).append($note);
        this.$container.find('.find-store').attr('href', item.productUrl);
        attachEvent($template.find('.show'));
        if (prevItem.length === 0) {
            $template.prependTo(self.$container).fadeIn(300);
            return;
        }
        prevItem.fadeOut(300, function () {
            prevItem.remove();
            $template.prependTo(self.$container).fadeIn(300);
        });
    };

    this.$el = $(renderTo);
    this.el = this.$el[0];
    this.template = $('#component-template').html();
    this.collection = opts.items;
    this.active = opts.active || 0;

    this.render();
};

function appendControlsTo (model, $elem) {
    var ctrl = $elem.find('.buttons-container'),
        detailsFlag = false;

    ctrl.find('.prev').on('click', function () {
        var actInd = model.active;

        model.active = actInd === 0 ? model.collection.length - 1 : actInd - 1;
        model.renderActiveItem();
    });

    ctrl.find('.next').on('click', function () {
        var actInd = model.active,
        itemCount = model.collection.length;

        model.active = actInd === itemCount - 1 ? 0 : actInd + 1;
        model.renderActiveItem();
    });
}