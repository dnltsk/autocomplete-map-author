<AutocompleteMapAuthor>

  <h1>Autocomplete Map Author</h1>
  <div class="row">
    <div class="col-md-4">
      <form>
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" class="form-control" id="title" disabled="disabled">
        </div>
        <div class="form-group">
          <label for="geojson">GeoJSON:</label><br>
          <button type="button" class="btn btn-default" onclick="{initBerlin}">Sample Berlin</button>
          <button type="button" class="btn btn-default" onclick="{initColumbia}">Sample World</button><br>
          <textarea class="form-control" rows="5" id="geojson"></textarea>
        </div>
        <div class="form-group">
          <label for="targetProjection">Target Projection:</label><br>
          <select class="selectpicker" id="targetProjection" onchange="updateMap">
            <optgroup label="World">
              <option selected="selected" value="mercator">Mercator</option>
              <option value="conicEqualArea">Conic Equal Area</option>
            <optgroup label="Region">
              <option value="albers">Albers (USA)</option>
          </select>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick="{updateMap}">Update Map</button>
        </div>


        <h2>Labels</h2>
        <div class="form-group">
          <label for="title">Pattern:</label>
          <input type="text" class="form-control" id="labelPattern">
          <button type="button" class="btn btn-primary" onclick="{updateLabels}">Update Labels</button>
        </div>
      </form>
    </div>

    <div class="col-md-8">
      <svg></svg>
    </div>
  </div>

  <!-- styles.css -->
  <style>
    body {
      padding: 0 50px 50px;
      font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
    }
    a {
      color: #00B7FF;
    }

    /**
     * MAP
     */
    rect.background{
      fill:silver;
    }
    path {
      stroke: black;
      stroke-width: 2px;
      fill: white;
    }
    path.mouseover {
      fill: orange;
    }
    path.centered {
      fill: #D5708B;
    }
  </style>

<script type="babel">

  import * as d3 from 'd3'
  import { Promise } from 'bluebird'

  var width = 800,
      height = 500,
      centered,
      mapLayer,
      labelLayer,
      effectLayer,
      bigText,
      path,
      g,
      geojson,
      projection ;

  const thisTag = this
  const loadJson = Promise.promisify(d3.json)

  this.on('mount', () => initMap() )

  // When clicked, zoom in
  const clicked = d => {
      var x, y, k;

      // Compute centroid of the selected path
      if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
      } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
      }

      // Highlight the clicked province
      mapLayer.selectAll('path')
          .classed("centered", function (d) {
              return centered && d === centered;
          });

      // Zoom
      g.transition()
          .duration(750)
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
  }

/*
    As was mentioned previously, the this keyword works differently in arrow functions.
    The methods call(), apply(), and bind() will not change the value of this in arrow
    functions. (In fact, the value of this inside of a function simply can’t be
    changed–it will be the same value as when the function was called.) If you need
    to bind to a different value, you’ll need to use a function expression.
*/
  const mouseover = function(d) {
      // Highlight hovered province
      d3.select(this).classed('mouseover', true);
  }

  const mouseout = function(d) {
      // Reset province color
      mapLayer.selectAll('path')
          .classed('mouseover', function (d) {
              return centered && d === centered;
          });

      // Remove effect text
      effectLayer.selectAll('text').transition()
          .style('opacity', 0)
          .remove();

      // Clear province name
      bigText.text('');
  }

  const initMap = () => {
      // Set svg width & height
      var svg = d3.select('svg')
          .attr('width', width)
          .attr('height', height);

      console.log("svg", svg.node());

      // Add background
      svg.append('rect')
          .classed('background', true)
          .attr('width', width)
          .attr('width', width)
          .attr('height', height)
          .on('click', clicked);

      g = svg.append('g');

      effectLayer = g.append('g')
          .classed('effect-layer', true);

      mapLayer = g.append('g')
          .classed('map-layer', true);

      labelLayer = g.append('g')
          .classed('label-layer', true);

      bigText = g.append('text')
          .classed('big-text', true)
          .attr('x', 20)
          .attr('y', 45);
  }

  this.initBerlin = () => {
    initGeoJson('https://raw.githubusercontent.com/berlinermorgenpost/Berlin-Geodaten/master/berlin_bezirke.geojson')
  }

  this.initColumbia = () => {
    initGeoJson('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  }

  const initGeoJson = url => {
    loadJson(url)
      .then(json => {geojson = json; return JSON.stringify(json, null, 2)})
      .then(json => d3.select("#geojson").node().value = json)
      .then(() => this.updateMap())
      .catch(console.error);
  }

  this.updateMap = () => {
    projection = getSelectedProjection().fitSize([width, height], geojson);
    path = d3.geoPath().projection(projection);

    // drop each province as a path
    mapLayer.selectAll('path').remove();

    // draw each province as a path
    mapLayer.selectAll('path')
        .data(geojson.features)
        .enter().append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('click', clicked);
  }

  const getSelectedProjection = () => {
      var targetProjection = d3.select('#targetProjection').node();
      var selectedProjection = targetProjection.options[targetProjection.selectedIndex].value;
      switch(selectedProjection){
          case "conicEqualArea":
              return d3.geoConicEqualArea();
          case "albers":
              return d3.geoAlbers();
          case "latlon":
          default:
              return d3.geoMercator();
      }

  }


  /**
   * LABELS
   */
  const updateLabels = () => {
      var labelPattern = d3.select("#labelPattern").node().value;

      var centroids = [];
      geojson.features.forEach(function (f) {
          console.log("f", f);
          var c = path.centroid(f);
          centroids.push(
              {
                  center: c,
                  label: f.properties[labelPattern]
              });
      });

      labelLayer.selectAll("text").remove();
      labelLayer.selectAll("text")
          .data(centroids)
          .enter()
          .append('text')
          .attr("dx", function(d) {
              return d.center[0];
          })
          .attr("dy", function(d) {
              return d.center[1];
          })
          .attr("text-anchor", "middle")
          .text(function(d){
              return d.label;
          });


      labelLayer.selectAll("circle").remove();
      labelLayer.selectAll("circle")
          .data(centroids)
          .enter()
          .append('circle')
          .attr("cx", function(d) {
              return d.center[0];
          })
          .attr("cy", function(d) {
              return d.center[1];
          })
          .attr("fill", "green")
          .attr("r", 5);

  }
  </script>

</AutocompleteMapAuthor>
