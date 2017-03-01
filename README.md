# CatMap
The aim of this projects is to visualize the territory and movements of my cats.
To achieve this I equipped them with GPS loggers and exported the resulting data as a GeoJSON object.

## Installation
First make sure you have nodeJS installed on your machine.
You can get it here: <https://nodejs.org>

Then install gulp globally:
```sh
$ sudo npm install gulp -g
```
*»sudo«* is only needed on a Mac.

And finally change to the directory of your basement project and install the needed components via:
```sh
$ npm install
```

### Tasks
To:
  - start a webserver
  - compile your sass
  - minify your your js and css
  - refresh the browser the moment you refresh files

you can just use the default gulp task
```sh
$ gulp
```


And to:
  - build your project for distribution
  - copy all your assets

use: 
```sh
$ gulp build
```
