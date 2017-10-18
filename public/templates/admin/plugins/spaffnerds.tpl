<div class="row">
  <div class="col-lg-12">
    <div class="panel panel-group">
      <form id="spaffnerds_acp" class="form spaffnerds-settings">
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <div class="form-group">
              <div class="panel panel-primary">
                <div class="panel-heading">Inputs</div>
                <div class="panel-body">
                Location of the song API, which includes song name and id:
                <input
                  id="apilink"
                  class="form-control"
                  type="text"
                  placeholder="https://spaffnerds.com/api/songs/"
                  data-key="strings.apilink" />
				  <br>
				String to search for after the song name is written in API:
				<input
				  id="afterSong"
                  class="form-control"
                  type="text"
                  placeholder="lyrics"
                  data-key="strings.afterSong" />
				  <br>
				"	" song id (URL appendix) " ":  
				<input
				  id="afterUrl"
                  class="form-control"
                  type="text"
                  placeholder="name"
                  data-key="strings.afterUrl" />
				  <br>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="panel panel-primary">
              <div class="panel-heading">Spaffnerds Control Panel</div>
              <div class="panel-body">
                <button class="btn btn-primary" id="save">Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <script type="text/javascript">
        require(['settings'], function(settings) {
          var wrapper = $('#spaffnerds_acp');
          // [1]
          settings.sync('spaffnerds', wrapper);
          $('#save').click(function(event) {
            event.preventDefault();
            // TODO clean and organize extensions
            settings.persist('spaffnerds', wrapper, function persistspaffnerds() {
              socket.emit('admin.settings.syncspaffnerds');
            })
          });
          });
        });
      </script>
    </div>
  </div>
</div>