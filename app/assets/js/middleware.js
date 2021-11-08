function human_file_size(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

let sa_supported = undefined
let sa_id = -1

function check_sa_support(){
  console.log("checking if mw supports service announcement API calls")
  $.ajax({
    url: "/api/mw/service_announcement",
    type: "HEAD",
    statusCode: {
      200: function() {
        sa_supported = true;
      },
      404: function() {
        sa_supported = false;
        $("#sa-tab").addClass("disabled").removeAttr("href");
      }
    }
  });
}

function read_sa(){
  $.get("/api/mw/service_announcement")
    .done( function(data, textStatus, xhr){
      haveServiceAnnouncement = true;
      let sa = JSON.parse(data);
      if (sa_id == sa.id) return;

      $("#sa-download").attr("href", "data:multipart/related;charset=utf-8," + encodeURIComponent(sa.content))
      let tb = $("#mw-sa-tbody");
      tb.empty();
      for(let item of sa.items) {
        let row = $("<tr class='sa-item-row' data-state='closed'>");
        row.append($("<td class='caret-cell sa-item-expand'><i class='fas fa-caret-right'></i></td>"));
        row.append($("<td>").html("<strong>" + item.location + "</strong><br><i>" + item.type + "</i>"));
        let valid_from = new Date(item.valid_from * 1000);
        let valid_until = new Date(item.valid_until * 1000);
        row.append($("<td>").html(valid_from.toLocaleString() + "<br>" + valid_until.toLocaleString()));
        row.append($("<td>").text(item.version));
        tb.append(row);  
        let drow = $("<tr class='sa-item-content-row'>");
        let dtd = $("<td class='sa-item-content-cell m-3' colspan=4>");
        let dpre = $("<pre>");
        let dcode = $("<code class='prewrap language-xml'>").text(item.content);
        dpre.append(dcode);
        dtd.append(dpre);
        drow.append(dtd);
        tb.append(drow);  
      }
      sa_id = sa.id;
      Prism.highlightAll();
    })
}

function poll(){
  if (sa_supported == undefined) {
    check_sa_support();
  }

  read_sa();

  $.get("/api/mw/files")
    .done( function(data, textStatus, xhr){
      $("#middleware-running").show();
      $("#middleware-not-running").hide();
      let files = JSON.parse(data);
      files.sort((a, b) => (a.age > b.age) ? 1 : -1)
      let tb = $("#mw-cache-tbody");
      tb.empty();
      let total_size = 0;
      for(let file of files) {
        let row = $("<tr>");
        row.append($("<td>").text(file.age));
        row.append($("<td>").html("<a target='_blank' href='/f/" + file.tmgi + "/" + file.location + "'>" + file.location + "</a>"));
        row.append($("<td>").text(human_file_size(file.content_length)));
        row.append($("<td>").text(file.source));
        row.append($("<td>").text(file.access_count));
        tb.append(row);  
        total_size += file.content_length;
      }
      $("#total-cache-size").text(human_file_size(total_size) + " total");

      return;
      $.get("/api/mw/services", function(data){
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
      $("#middleware-running").hide();
      $("#middleware-not-running").show();
    });
}

$(function() {
  $("#middleware-running").hide();
  setInterval(poll, 300);

  $('#mw-sa-tbody').on('click', '.sa-item-row', function() {
    if ($(this).data("state") == "closed") {
      $(this).children(".caret-cell").children("i").addClass("fa-caret-down").removeClass("fa-caret-right");
      $(this).data("state", "open");
      $(this).next(".sa-item-content-row").show();
    } else {
      $(this).children(".caret-cell").children("i").addClass("fa-caret-right").removeClass("fa-caret-down");
      $(this).data("state", "closed");
      $(this).next(".sa-item-content-row").hide();
    }
  });
});
