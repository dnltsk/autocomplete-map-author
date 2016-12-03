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
          <button type="button" class="btn btn-default" onclick="initBerlin()">Sample Berlin</button>
          <button type="button" class="btn btn-default" onclick="initColumbia()">Sample World</button><br>
          <textarea class="form-control" rows="5" id="geojson"></textarea>
        </div>
        <div class="form-group">
          <label for="targetProjection">Target Projection:</label><br>
          <select class="selectpicker" id="targetProjection" onchange="updateMap()">
            <optgroup label="World">
              <option selected="selected" value="mercator">Mercator</option>
              <option value="conicEqualArea">Conic Equal Area</option>
              <optgroup label="Region">
                <option value="albers">Albers (USA)</option>
          </select>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary" onclick="updateMap()">Update Map</button>
        </div>


        <h2>Labels</h2>
        <div class="form-group">
          <label for="title">Pattern:</label>
          <input type="text" class="form-control" id="labelPattern">
          <button type="button" class="btn btn-primary" onclick="updateLabels()">Update Labels</button>
        </div>
      </form>
    </div>

    <div class="col-md-8">
      <svg></svg>
    </div>
  </div>

</AutocompleteMapAuthor>