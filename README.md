#  Autocomplete Map Author (WIP)

enables everyone to create autocomplete maps à la "Why is [] so ..."

## Basic Concept

1. user uploads GeoJSON file with Geometries and Properties
   => GeoJSON is displayed on the map
2. user defines the phrase which has to gets autocompleted as "Why is ${name} so ..."
   => Googles Suggestion API is getting requested for every Feature
   => Geometries are filled with labels

## Things To Clarify

1. AngularJS vs. EmberJS vs. Plain JS vs. Apache Wicket vs...<br /> 
   => Bootstrap, RiotJS, ReduxJS
2. easy peasy D3 vs. MapboxGL<br />
   -> plain D3 offers more freedom in map projections<br />
   -> plain D3 offers more freedom in label placement<br />
   -> D3 SVG overlay over MapboxGL?<br />
   => D3 for first solution!
3. Suggestion on front-end or back-end side?<br />
   => first solution front-end only!
4. Where to upload the files?<br />
   -> Dropbox / S3 / maybe on Heroku<br />
   => GeoJSON textfield for first solution!
5. Application hosting on Heroku?<br />
   => why not?<br />
   => Heroku!


# Technical

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd autocomplete-map-author`
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
* [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
* [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

