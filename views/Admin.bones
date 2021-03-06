// Admin
// -----
// Main administrative view.
//
// - `options.auth` View class to be used for user authentication.
// - `options.model` Instantiated auth-based model for handling login.
// - `options.dropdowns` Array of dropdown view classes. Optional.
view = Backbone.View.extend({
    id: 'bonesAdmin',

    dropdowns: [],

    auth: null,

    events: {
        'click a.toggle': 'toggle'
    },

    initialize: function(options) {
        _.bindAll(this, 'render', 'toggle', 'setPanel', 'error');
        if (options) _.extend(this, options);

        this.model.bind('auth:status', this.render);
    },

    render: function() {
        $(this.el).html(templates['Admin'](this.model));
        if (!$('#' + this.id).size()) $('body').append(this.el);

        $('html').toggleClass('bonesAdmin', this.model.authenticated);
        if (this.model.authenticated) {
            _.each(this.dropdowns, function(Dropdown) {
                new Dropdown({ admin: this, model: this.model });
            }, this);
        } else if (this.auth) {
            new this.auth({ admin: this, model: this.model });
        }
        return this;
    },

    toggle: function() {
        $('html').toggleClass('bonesAdmin');
        return false;
    },

    setPanel: function(view) {
        if (view) {
            this.$('.panel').html(view.el);
        } else {
            this.$('.panel').empty();
        }
    },

    error: function(model, resp) {
        var message = resp;
        if (resp instanceof Object) {
            if (resp.responseText) {
                try {
                    message = $.parseJSON(resp.responseText).message;
                } catch (err) {}
            } else if (resp.message) {
                message = resp.message;
            } else {
                message = resp.toString();
            }
        }
        new views['AdminGrowl']({
            message: message,
            classes: 'error',
            autoclose: 0
        });
    }
});
