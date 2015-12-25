/**
 * jQuery Input Sheeper plugin.
 *
 */
(function($) {
    $.sheeper = $.inputSheeper = function(element, options) {
        var plugin = this,
            defaults = {
                selector: ".sheep", // Each sheep must have this selector in template.
                addSelector: ".sheep-link", // Add button (new sheep in the list).
                removeSelector: ".unsheep-link", // Remove button in the prototype.
                moveUpSelector: ".sheepup-link", // Move up button in the prototype.
                moveDownSelector: ".sheepdown-link", // Move up button in the prototype.
                min: 1, // Minimum number of sheeps in the list.
                max: 100,
                prepend: false, // By default, append new element. Set prepend to true to prepend new sheeps.
                afterInit: function(element) {
                    return true;
                },
                afterSheep: function(element) {
                    return true;
                },
                beforeUnsheep: function(element) {
                    return true;
                },
                afterUnsheep: function(element) {
                    return true;
                }
            },
            $element = $(element),
            $wrapper,
            ids = [];
        plugin.settings = {};
        /**
         *
         * @return {[type]} [description]
         */
        plugin.init = function()
        {
            plugin.settings = $.extend({}, defaults, $element.data(), options);
            // Container for sheeps.
            $wrapper = (plugin.settings.container) ? $element.find(plugin.settings.container) : $element;

            if(plugin.settings.prototype.match('^(#|\\.)[a-zA-Z].*')) {
                // Prototype is an id (#) or a class (.)
                var $template = $(plugin.settings.prototype);

                // Hide the template and retrieve its content for latter use.
                $template.hide();
                plugin.settings.prototype = $template.html();
            }

            if(! plugin.settings.prototype) {
                console.error("No template found. Please provide a template using the 'prototype' javascript option or data-prototype HTML attribute");
                return;
            }

            // Do some init / apply stuffs.
            plugin.execute();
            plugin.settings.afterInit($element);
        };
        /**
         * Inits / apply DOM to this sheeper.
         *   - Called when init. @see init.
         *   - Called after an AJAX call. (that's why it's public ;) )
         * @return void
         */
        plugin.execute = function()
        {
            // Init the sheeper with existing sheeps.
            if (plugin.numberOfSheeps() > 0) {
                $wrapper.children().each(function() {
                    sheep(this);
                });
            }
            // If there's not enough sheeps in the herd, just sheep !
            if (plugin.numberOfSheeps() < plugin.settings.min) {
                for (var i = 0; i < (plugin.settings.min - plugin.numberOfSheeps()); i++) {
                    sheep();
                }
            }
            if (plugin.numberOfSheeps() === plugin.settings.min) {
                disableUnsheep();
            }
            // Actives the add link.
            $element.find(plugin.settings.addSelector).on("click", function(e) {
                e.preventDefault();
                sheep();
            });
            $wrapper.on("click", plugin.settings.removeSelector, function(e) {
                e.preventDefault();
                unsheep(this);
            });
            $wrapper.on("click", plugin.settings.moveUpSelector, function(e) {
                e.preventDefault();
                moveUp(this);
            });
            $wrapper.on("click", plugin.settings.moveDownSelector, function(e) {
                e.preventDefault();
                moveDown(this);
            });
        }
        /**
         * Creates (or registers) a new sheep in the herd.
         * @param  Element e  Opt: the sheep to add to the herd.
         * @return void.
         */
        var sheep = function(e)
        {
            if (plugin.numberOfSheeps() >= plugin.settings.max) {
                return;
            }
            if (e) {
                // Only registers the sheep in the herd.
                var $e = $(e),
                    id = $(e).data("sid");

                ids.push(id);

                plugin.settings.afterSheep($e);
                $e.trigger(
                    $.Event('sheeped.jq.sheeper', {})
                );
            } else {
                var id = getId();

                // Creates a new sheep.
                var $sheep = $(plugin.settings.prototype.replace(/(__|\{\{)\s?name\s?(__|\}\})/gi, id));

                // Sets the sheep ID.
                $sheep.data("sid", id);
                ids.push(id);

                if (plugin.settings.prepend) {
                    $wrapper.prepend($sheep);
                } else {
                    $wrapper.append($sheep);
                }
                // Registers the sheep in the herd.
                plugin.settings.afterSheep($sheep);
                $sheep.trigger(
                    $.Event('sheeped.jq.sheeper', {})
                );
            }
            if (plugin.numberOfSheeps() > plugin.settings.min) {
                enableUnsheep();
            } else {
                disableUnsheep();
            }
            if (plugin.numberOfSheeps() < plugin.settings.max) {
                enableSheep();
            } else {
                disableSheep();
            }

            refresh();
        }
        /**
         * Deletes a sheep element.
         * @param  Element e The '.unsheep-link' clicked.
         * @return void
         */
        var unsheep = function(e)
        {
            if (plugin.numberOfSheeps() > plugin.settings.min) {
                var $sheep = $(e).parents(plugin.settings.selector);
                plugin.settings.beforeUnsheep($sheep);
                $sheep.trigger(
                    $.Event('unsheep.jq.sheeper', {})
                );

                // Removes the sheep.
                $sheep.remove();

                plugin.settings.afterUnsheep($sheep);
                $wrapper.trigger(
                    $.Event('unsheeped.jq.sheeper', {
                        relatedTarget: $sheep
                    })
                );
            }
            if (plugin.numberOfSheeps() === plugin.settings.min) {
                disableUnsheep();
            }

            refresh();
        }

        var moveUp = function(e)
        {
            var $sheep = $(e).parents(plugin.settings.selector),
                $previous = $sheep.prev();
            if($previous.length) {
                $sheep.detach().insertBefore($previous);
            }

            refresh();
        }

        var moveDown = function(e)
        {
            var $sheep = $(e).parents(plugin.settings.selector),
                $next = $sheep.next();
            if($next.length) {
                $sheep.detach().insertAfter($next);
            }

            refresh();
        }

        plugin.numberOfSheeps = function()
        {
            return $wrapper.find(plugin.settings.selector).length;
        }

        var refresh = function()
        {
            var $sheeps = $wrapper.children();
            $sheeps.each(function(i, e) {
                var $e = $(e);
                $e.find(plugin.settings.moveUpSelector).each(function(i, e) {
                    $(e).removeClass("disabled");
                });
                $e.find(plugin.settings.moveDownSelector).each(function(i, e) {
                    $(e).removeClass("disabled");
                });
            });

            $sheeps.first().find(plugin.settings.moveUpSelector).addClass("disabled");
            $sheeps.last().find(plugin.settings.moveDownSelector).addClass("disabled");
        }

        var enableSheep = function()
        {
            $wrapper.find(plugin.settings.addSelector).removeClass("disabled");
        }

        var disableSheep = function()
        {
            $wrapper.find(plugin.settings.addSelector).addClass("disabled");
        }

        /**
         * Enable the ability to unhseep.
         * @return void
         */
        var enableUnsheep = function()
        {
            $wrapper.find(plugin.settings.removeSelector).removeClass("disabled");
        }
        /**
         * Disable the ability to unsheep.
         * @return void
         */
        var disableUnsheep = function()
        {
            $wrapper.find(plugin.settings.removeSelector).addClass("disabled");
        }

        var getId = function()
        {
            var id = 0;
            while(ids.indexOf(id) !== -1) {
                id++;
            }

            return id;
        }

        plugin.init();
    }

    $.fn.sheeper = $.fn.inputSheeper = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('inputSheeper')) {
                var plugin = new $.sheeper(this, options);
                $(this).data('inputSheeper', plugin);
            }
        });
    }

    /**
     * DATA-* ATTRIBUTES API
     *
     * Use data-* attributes to enable/configure your sheeper components.
     */
    $(document).ready(function() {
        $('[data-toggle="sheeper"]').sheeper({});
    });
})(jQuery);
