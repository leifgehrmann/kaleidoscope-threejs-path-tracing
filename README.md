# kaleidoscope-threejs-path-tracing

A website to simulate [kaleidoscopes](https://en.wikipedia.org/wiki/Kaleidoscope) using [path tracing](https://en.wikipedia.org/wiki/Path_tracing).

Try the website at [kaleidoscope-path-tracing.leifgehrmann.com](https://kaleidoscope-path-tracing.leifgehrmann.com/).

**Warning:** This website does not perform well on mobile, both Android and iOS, due to various bugs and memory limitations. For best results, try this website on a desktop or laptop.

![Screenshot of the website, showing the form and the kaleidoscopes](./example.png)

## Attribution

* `src/traquair.jpg` is a cropped version of [_Salvation of Mankind_](https://commons.wikimedia.org/wiki/File:Salvation_of_Mankind_(detail)_by_Phoebe_Anna_Traquair_1886_to_1893.jpg) (1886 to 1893, Panel 2, _The Angel of Death and Purification_) by [Phoebe Anna Traquair](https://en.wikipedia.org/wiki/Phoebe_Anna_Traquair). The photo is by Stephencdickson, and is licensed under CC BY-SA 4.0. 
* `src/jawlensky.jpg` is a cropped version of [_Flowers in a Vase_](https://www.nationalgalleries.org/art-and-artists/113683) (1936) by [Alexej von Jawlensky](https://en.wikipedia.org/wiki/Alexej_von_Jawlensky). The photo is by the National Galleries of Scotland, and is licensed under CC BY-NC. 
* `src/mackintosh.jpg` is a cropped version of [_Mont Alba_](https://www.nationalgalleries.org/art-and-artists/1652) (1924-1927) by [Charles Rennie Mackintosh](https://en.wikipedia.org/wiki/Charles_Rennie_Mackintosh). The photo is by the National Galleries of Scotland, and is licensed under CC BY-NC. 

## Development

```shell
# Install the dependencies
npm install

# Run the website in development mode
npm run serve

# Generate the website files to host on a website
npm run build
```
