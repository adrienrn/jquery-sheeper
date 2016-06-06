---
layout: default
title: Home
---

<div class="card-demo">
  <div class="card-block">
    <div class="demo-label">Example</div>
    {% include _demo1.html %}
    <script id="demo1-prototype" type="text/template">
      {% include _template-demo.html %}
    </script>
  </div>
</div>

{{ site.description }}

1. [Usage](#usage)
2. [Options](#options)
3. [Events](#events)
4. [Symfony](#symfony-integration)
5. [jQuery UI Sortable](#jquery-ui-sortable)
6. [Sheepception](#sheepception)

<a href="{{ site.github.repo }}">
  View on Github
</a>

## Usage

First, you need to define your template.

The safest way is to add a script tag in the head of your site with the type text/template. It will be picked up by its id.

{% highlight html %}
<script id="demo1-prototype" type="text/template">
{% include _template-demo.html %}
</script>
{% endhighlight %}

Then, you can initialize your sheeper. You can initialize this plugin via data-* attributes or via Javascript. Both of following syntax are equal.

{% highlight html %}
  {% include _demo1.html %}
{% endhighlight %}

{% highlight javascript %}
$("#demo1").sheeper({
  "prototype": "#demo1-prototype"
});
{% endhighlight %}

Note the `prototype` option matching the template `id` attribute.

## Options

{{ site.title }} is fully customizable using options.

<table>
    <tr>
        <th>Name</th>
        <th>Description</th>
    </tr>
    {% for option in site.data.options %}
        <tr>
            <td>
                <span class="docs-highlight">
                    {{ option.name }}<br />
                    {% if option.required == true %}
                        <small class="docs-required">(required)</small>
                    {% endif %}
                </span>
            </td>
            <td>{{ option.description|markdownify }}</td>
        </tr>
    {% endfor %}
</table>

## Events

{{ site.title }} provides custom events to which you can listen to extend it. A very common use case is enabling Javascript on newly created element, like enabling jQuery Validate, initialize autocomplete fields like Google Maps, etc.

<div class="message">
  In previous versions (< 1.1.0), {{ site.title }} did not have any events and *callbacks* were used and are now **deprecated**.
</div>

{% highlight javascript %}
$("#demo1").on("sheeped.jq.sheeper", function(event) {
    // Do something...
    var target = event.target;
});
{% endhighlight %}

<table>
    <tr>
        <th>Event</th>
        <th>Description</th>
    </tr>
    {% for event in site.data.events %}
        <tr>
            <td>
                <span class="docs-highlight">{{ event.name }}</span>
            </td>
            <td>{{ event.description|markdownify }}</td>
        </tr>
    {% endfor %}
</table>

## Symfony integration

{{ site.title }} has found its first use case scenario as part of a [Symfony2](https://symfony.com/) project, working with [the Symfony Form components](http://symfony.com/doc/current/components/form/introduction.html) and it still does.

`@TODO`

## jQuery UI Sortable

{{ site.title }} works seemlessly with [jQuery UI Sortable](https://jqueryui.com/sortable/), a javascript component to reorder list items using drag-and-drop.

You can achieve this integration with the `container` option and [events](#events).

{% highlight html %}
<div
    id="demo2"
    data-toggle="sheeper"
    data-prototype="#demo1-prototype"
    data-container=".sheeps" <!-- Reference the div.sheeps below -->
>
  <h6>
    To-do list
    &nbsp;<a class="sheep-link" href="#">Add new to-do</a>
  </h6>
  <div class="sheeps">
    <!-- This div will hold sheeps that you create. -->
  </div>
</div>
{% endhighlight %}

Enable jQuery UI Sortable on the sheep container:

{% highlight javascript %}
$("#demo2 .sheeps").sortable({});
{% endhighlight %}

Then, bind the `moved.jq.sheeper` to the [`sortstop` jQuery UI event](http://api.jqueryui.com/sortable/#event-stop).

{% highlight javascript %}
$(".selector").on("sortstop", function(event, ui) {
    var target = ui.item[0],
        sheeper = $(this).closest("[data-toggle='sheeper']");

    sheeper.trigger("moved.jq.sheeper");
});
{% endhighlight %}

## Sheepception

`@TODO`

