class hls_fragment_loader extends Hls.DefaultConfig.loader {
  constructor(config) {
    super(config);
    var load = this.load.bind(this);
    this.load = function (context, config, callbacks) {
      var onSuccess = callbacks.onSuccess;
      callbacks.onSuccess = function (response, stats, context, networkDetails) {
        let origin = networkDetails.getResponseHeader("RT-MBMS-MW-File-Origin");
        $('#data-source-info').html(origin);
        onSuccess(response, stats, context);
      };
      load(context, config, callbacks);
    };
  }
}

function playHls(manifest_url) {
  if (Hls.isSupported()) {
    let video = document.getElementById('video');
    video.muted = true;
    video.hls = new Hls({
      fLoader: hls_fragment_loader,
      lowLatencyMode: false,
      fragLoadingRetryDelay: 50
    });
    video.hls.attachMedia(video);
    video.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log('video and hls.js are now bound together !');
      video.hls.loadSource(manifest_url);
      video.hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        video.play();
        console.log(
          'manifest loaded, found ' + data.levels.length + ' quality level'
        );
      });
    });
  }
}

function playDash(manifest_url) {
  let video = document.getElementById('video');
  if (!video.dash) {
    video.muted = true;
    video.dash = dashjs.MediaPlayer().create();
    video.dash.initialize(video, null, true);
    video.dash.updateSettings({
      debug: {
        logLevel: 4
      },
      streaming: {
        delay: {
          liveDelayFragmentCount: 4
        },
        retryIntervals: {
          MediaSegment: 2000
        }
      }
    })
  }
  video.dash.attachSource(manifest_url);
}

function stop() {
  var video = document.getElementById('video');
  video.pause();
  if (video.hls) video.hls.detachMedia(video);
}

$(function () {
  let vi = $("#video-info");
  let manifest = vi.data("manifest");
  let mp = vi.data("player");

  if (manifest && mp) {
    $("#src-url").val(manifest);
    $("#player-select").val(mp.toLowerCase());
    // autoplay
    if (mp == "hls") {
      playHls(manifest);
    }
    if (mp == "dash") {
      playDash(manifest);
    }
  }

  $("#play-btn").click(function () {
    stop();
    let player = $("#player-select").val();
    if (player == "hls") {
      playHls($("#src-url").val());
    }
    if (player == "dash") {
      playDash($("#src-url").val());
    }
  });
});
