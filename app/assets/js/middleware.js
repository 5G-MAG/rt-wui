function human_file_size(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function poll() {
  $.get("/api/mw/files")
    .done(function (data, textStatus, xhr) {
      $("#middleware-running").show();
      $("#middleware-not-running").hide();
      let files = JSON.parse(data);
      files.sort((a, b) => (a.age > b.age) ? 1 : -1)
      let tb = $("#mw-files-tbody");
      tb.empty();
      let total_size = 0;
      let dashManifestUrl = null;
      let hlsManifestUrl = null;
      for (let file of files) {
        let row = $("<tr>");
        row.append($("<td>").text(file.age));
        row.append($("<td>").text(file.tmgi));
        let requiredSlash = file.location.charAt(0) === '/' ? '' : '/';
        let url = '/f/' + file.tmgi + requiredSlash + file.location;
        row.append($("<td>").html("<a target='_blank' href=" + url + ">" + file.location + "</a>"));
        row.append($("<td>").text(human_file_size(file.content_length)));
        row.append($("<td>").text(file.access_count));
        tb.append(row);
        total_size += file.content_length;

        if (file.location && file.location.indexOf(".mpd") !== -1) {
          dashManifestUrl = url;
        } else if (file.location && file.location.indexOf("index.m3u8") !== -1) {
          hlsManifestUrl = url;
        }
      }
      $("#total-cache-size").text(human_file_size(total_size) + " total");

      $.get("/api/mw/services", function (data) {
        if (window.mw_services && window.mw_services == data) {
          return;
        }
        window.mw_services = data;
        let services = JSON.parse(data);
        console.log(services);
        let cont = $("#mw-services");
        cont.empty();
        for (let service of services) {
          console.log(service);
          let row = $("<div class='row m-3'>");
          let col = $("<div class='col-lg-12'>");
          let box = $("<div class='box pb-2'>");
          let title = $("<div class='box-title'>").text(service.service_name);
          box.append(title);
          let tmgi = parseInt(service.service_tmgi, 16);
          let p = $("<p class='mb-0'>").html("Service announcement TMGI: <strong>0x" + tmgi.toString(16) + "</strong>");
          box.append(p);
          p = $("<p class='mb-0'>").html("Stream type: <strong>" + service.stream_type + "</strong>");
          box.append(p);
          p = $("<p class='mb-0'>").html("Stream multicast: <strong>" + service.stream_mcast + "</strong>");
          box.append(p);
          let url = "";
          if (service.stream_type == "FLUTE/UDP") {
            url = "/application?s=" + service.stream_tmgi;
            if (dashManifestUrl) {
              url += "&m=" + dashManifestUrl + "&p=dash";
            }
            else if (hlsManifestUrl) {
              url += "&m=" + hlsManifestUrl + "&p=hls";
            }
            let stmgi = parseInt(service.stream_tmgi, 16);
            p = $("<p class='mb-0'>").html("Stream TMGI: <strong>0x" + stmgi.toString(16) + "</strong>");
            box.append(p);
          } else {
            url = "udp://@" + service.stream_mcast;
          }
          let pa = $("<a href='" + url + "'>");
          let pb = $("<button class='bg-dark play-button'>").html("▷");
          pa.append(pb);
          box.append(pa);


          col.append(box);
          row.append(col);
          cont.append(row);
        }
      });
    })
    .fail(function (data, textStatus, xhr) {
      $("#middleware-running").hide();
      $("#middleware-not-running").show();
    });
}

$(function () {
  $("#middleware-running").hide();
  window.selected_mch = 0;
  setInterval(poll, 300);
});
