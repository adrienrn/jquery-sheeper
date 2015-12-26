/**
 * jQuery Input Sheeper plugin.
 *
 */
(function($) {
    $.sheeper = $.inputSheeper = function(element, options) {
        var plugin = this,
            defaults = {
                selector: ".sheep", // Each sheep must have this selector in template.
                placeholder: /(__|\{\{\s?)NAME(__|\}\}\s?)/gi,
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
                },
                beforeMove: function(element) {
                    return true;
                },
                afterMove: function(element) {
                    return true;
                },
                beforeMoveUp: function(element) {
                    return true;
                },
                afterMoveUp: function(element) {
                    return true;
                },
                beforeMoveDown: function(element) {
                    return true;
                },
                afterMoveDown: function(element) {
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

            if(! plugin.settings.prototype) {
                console.error("No template found. Please provide a template using the 'prototype' javascript option or data-prototype HTML attribute.");
                return;
            }

            if(plugin.settings.prototype.match(/^(#|\\.)[a-zA-Z].*/)) {
                // Prototype is an id (#) or a class (.)
                var $template = $(plugin.settings.prototype);

                if ($template.length === 0) {
                    console.error("No template found. Prototype '" + plugin.settings.prototype + "' does not exists.");
                    return;
                }

                // Hide the template and retrieve its content for latter use.
                $template.hide();
                plugin.settings.prototype = $template.html();
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
            var countSheepsAtInit = plugin.numberOfSheeps();
            if (countSheepsAtInit < plugin.settings.min) {
                for (var i = 0; i < (plugin.settings.min - countSheepsAtInit); i++) {
                    sheep();
                }
            }
            if (plugin.numberOfSheeps() === plugin.settings.min) {
                disableUnsheep();
            }
            // Actives the add link.
            $element.find(plugin.settings.addSelector).on("click", function(e) {
                e.preventDefault();

                if($(this).is(".disabled,:disabled")) {
                    return;
                }

                sheep();
            });
            $wrapper.on("click", plugin.settings.removeSelector, function(e) {
                e.preventDefault();

                if($(this).is(".disabled,:disabled")) {
                    return;
                }

                unsheep(this);
            });
            $wrapper.on("click", plugin.settings.moveUpSelector, function(e) {
                e.preventDefault();

                if($(this).is(".disabled,:disabled")) {
                    return;
                }

                moveUp(this);
            });
            $wrapper.on("click", plugin.settings.moveDownSelector, function(e) {
                e.preventDefault();

                if($(this).is(".disabled,:disabled")) {
                    return;
                }

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
                    id = $(e).data("sheep-id");

                if(id === undefined) {
                    // data-sheep-id is not defined on the element, making one.
                    id = getId();
                    $e.data("sheep-id", id);
                }

                ids.push(id);

                plugin.settings.afterSheep($e);
                $e.trigger(
                    $.Event('sheeped.jq.sheeper', {})
                );
            } else {
                var id = getId();

                // Creates a new sheep from template.
                var $sheep = $(plugin.settings.prototype.replace(plugin.settings.placeholder, id));

                // Sets the sheep ID.
                $sheep.data("sheep-id", id);
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
                var $sheep = $(e).closest(plugin.settings.selector);
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

            refresh();
        }

        /**
         * Move up sheep element.
         * @param  Element e The '.move-up-sheep-link' clicked.
         * @return void
         */
        var moveUp = function(e)
        {
            var $sheep = $(e).parents(plugin.settings.selector),
                $previous = $sheep.prev(plugin.settings.selector);

            if($previous.length) {
                // Setup some callbacks.
                plugin.settings.beforeMove($sheep);
                plugin.settings.beforeMoveUp($sheep);

                updateIndex($sheep, $previous);
                $sheep.detach().insertBefore($previous);

                // Setup some callbacks.
                plugin.settings.afterMoveUp($sheep);
                plugin.settings.afterMove($sheep);
            }

            refresh();
        }

        /**
         * Move down sheep element.
         * @param  Element e The '.move-down-sheep-link' clicked.
         * @return void
         */
        var moveDown = function(e)
        {
            var $sheep = $(e).parents(plugin.settings.selector),
                $next = $sheep.next(plugin.settings.selector);

            if($next.length) {
                // Setup some callbacks.
                plugin.settings.beforeMove($sheep);
                plugin.settings.beforeMoveDown($sheep);

                updateIndex($sheep, $next);
                $sheep.detach().insertAfter($next);

                // Setup some callbacks.
                plugin.settings.afterMoveDown($sheep);
                plugin.settings.afterMove($sheep);
            }

            refresh();
        }

        plugin.getSheeps = function()
        {
            return $wrapper.children(plugin.settings.selector);
        }

        plugin.numberOfSheeps = function()
        {
            return plugin.getSheeps().length;
        }

        var refresh = function()
        {
            // Get sheeps list.
            var $sheeps = plugin.getSheeps();

            // Enable/Disable sheeping.
            if (plugin.numberOfSheeps() > plugin.settings.min) {
                enableUnsheep();
            } else {
                disableUnsheep();
            }

            // Enable/Disable unsheeping.
            if (plugin.numberOfSheeps() < plugin.settings.max) {
                enableSheep();
            } else {
                disableSheep();
            }

            // Remove .disabled class on every move up & move down trigger.
            $sheeps.each(function(i, e) {
                var $e = $(e);
                $e.find(plugin.settings.moveUpSelector).each(function(i, e) {
                    $(e).removeClass("disabled");
                });
                $e.find(plugin.settings.moveDownSelector).each(function(i, e) {
                    $(e).removeClass("disabled");
                });
            });

            // Disable move up for the first sheep.
            $sheeps.first().find(plugin.settings.moveUpSelector).addClass("disabled");

            // Disable move down for the last sheep.
            $sheeps.last().find(plugin.settings.moveDownSelector).addClass("disabled");
        }

        /**
         * Enable the "sheep" feature.
         * @return void
         */
        var enableSheep = function()
        {
            $wrapper.find(plugin.settings.addSelector).removeClass("disabled");
        }

        /**
         * Disable the "unsheep" feature.
         * @return void
         */
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

        /**
         * Get the longest commong string in an array of strings.
         *   Ex. ['interspecies', 'interstelar', 'interstate'])  => 'inters'
         * @param  Array<String> array
         * @return String
         */
        var sharedStart = function(array) {
          var A= array.concat().sort(),
          a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
          while(i<L && a1.charAt(i)=== a2.charAt(i)) i++;
          return a1.substring(0, i);
        }

        /**
         * Find the root name attribute to swap on move-up / move-down.
         * @param  Array array
         * @return String
         */
        var findRootNameAttr = function($fields) {
          return sharedStart($fields.map(function(i, e) {
            return $(e).attr('name');
          }).get());
        }

        /**
         * Swap sheep id and form name.
         * @param  jQuery $element1
         * @param  jQuery $element2
         */
        var updateIndex = function ($element1, $element2)
        {
          // Get all fields within element1.
          var $fields1 = $element1.find("input, select, textarea");

          // Get all fields within element2.
          var $fields2 = $element2.find("input, select, textarea");

          if ($fields1.length === 0 || $fields.length === 0) {
            // Skip; no input / select / textarea in sheep template.
            return;
          }

          // Defines root name attributes to be swaped.
          var rootName1 = findRootNameAttr($fields1),
              rootName2 = findRootNameAttr($fields2);

          // Replace names from $element1 by those in $elements2
          $fields1.each(function (i, e) {
            $(e).attr('name', $(e).attr('name').replace(rootName1, rootName2));
          });

          // Replace names from $element2 by those in $elements1
          $fields2.each(function (i, e) {
            $(e).attr('name', $(e).attr('name').replace(rootName2, rootName1));
          });
        }

        /**
         * Generate a new (unused) sheep id.
         * @return Int
         */
        var getId = function()
        {
            var id = 0;
            while($.inArray(id, ids) !== -1) {
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
