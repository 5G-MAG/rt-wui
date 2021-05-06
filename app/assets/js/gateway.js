function human_file_size(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function poll(){
  $.get("/api/gw/files")
    .done( function(data, textStatus, xhr){
      $("#gateway-running").show();
      $("#gateway-not-running").hide();
      let files = JSON.parse(data);
      files.sort((a, b) => (a.age > b.age) ? 1 : -1)
      let tb = $("#gw-files-tbody");
      tb.empty();
      for(let file of files) {
        let row = $("<tr>");
        row.append($("<td>").text(file.age));
        row.append($("<td>").text(file.filename));
        row.append($("<td>").html("<a target='_blank' href='/f" + file.location + "'>" + file.location + "</a>"));
        row.append($("<td>").text(human_file_size(file.content_length)));
        tb.append(row);  
      }

      $.get("/api/gw/services", function(data){
        if (window.gw_services && window.gw_services == data) {
          return;
        }
        window.gw_services = data;
        let services = JSON.parse(data);
        console.log(services);
        let cont = $("#gw-services");
        cont.empty();
        for(let service of services) {
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
          if (service.stream_type=="FLUTE/UDP") {
            url = "/application?s="+service.stream_tmgi;
            let stmgi = parseInt(service.stream_tmgi, 16);
            p = $("<p class='mb-0'>").html("Stream TMGI: <strong>0x" + stmgi.toString(16) + "</strong>");
            box.append(p);
          } else {
            url = "udp://@"+service.stream_mcast;
          }
          let pa = $("<a href='"+url+"'>");
          let pb = $("<button class='bg-dark play-button'>").html("▷");
          pa.append(pb);
          box.append(pa);


          col.append(box);
          row.append(col);
          cont.append(row);
        }
      });
    })
    .fail( function(data, textStatus, xhr){
      $("#gateway-running").hide();
      $("#gateway-not-running").show();
    });
}

$(function() {
  $("#gateway-running").hide();
  window.selected_mch = 0;
  setInterval(poll, 300);
});
