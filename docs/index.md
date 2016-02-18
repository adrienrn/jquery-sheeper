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

## Download

Head to our

## Basic usage

{% highlight html %}
  {% include _demo1.html %}
{% endhighlight %}

{% highlight html %}
  {% include _template-demo.html %}
{% endhighlight %}

## Options

jQuery Sheeper in fully customizable using options.

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
                        <small class="text-danger">(required)</small>
                    {% endif %}
                </span>
            </td>
            <td>{{ option.description|markdownify }}</td>
        </tr>
    {% endfor %}
</table>

## Events

{{ site.title }} provides custom events to which you can listen to extend it. In previous versions (`< 1.1.0`), {{ site.title }} did not have any events and *callbacks* were used and are now **deprecated**.

A very common use case is enabling Javascript on newly created element, like enabling jQuery Validate, initialize autocomplete fields like Google Maps, etc.

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

## Sheepception

What about sheeper inside sheeper ? It has been done, it works for the most part but it's still experimental.

