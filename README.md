<img src="https://github.com/koehlersimon/vanillafocus/blob/main/vanillafocus.png?raw=true">

# vanillafocus
The plain JS focuspoint plugin without jQuery dependency. Inspired by jQuery FocusPoint, salted with some extra CSS.

### Documentation
https://vanillafocus.simon-koehler.com

## HTML
```
<div class="vf-ratio vf-ratio-16x9">
    <div class="vf-container" data-focus-x="0.66"
    data-focus-y="0.36"
    data-image-w="750"
    data-image-h="498">
        <img src="https://i.imgur.com/PA09XUX.jpeg" alt="Demo">
    </div>
</div>
```

## JS
```
<script src="vanillafocus.js"></script>
var vanillafocus_demo = new vanillafocus({
     selector: ".vf-container",
     reCalcOnWindowResize: true
})
```

## CSS
```
<link href="vanillafocus.css" rel="stylesheet">
```
