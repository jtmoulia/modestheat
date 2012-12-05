# Modest Heat (work in progress) #

A heat map layer for modestmaps, which, remember, mapbox.js is built upon.

## Requires ##

- A browser which supports HTML5 web workers.

## Example ##

Run `python -m SimpleHTTPServer`, and point your browser to
`http://localhost:8000/example.html`. It should start right up with some
example data.

## Todo ##

Well, it works alright as is. But these things would make it better.

- Draw to an offscreen context which is used instead of this pixel by pixel stuff
- Use Uint8ClampedArrays (?)
- Pan the heatmap with the map
