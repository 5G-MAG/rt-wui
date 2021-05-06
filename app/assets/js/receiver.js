function load_ce_values(canvas_id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/rp/ce_values', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    const ce = new Float32Array(this.response);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00CC00";
    var x = 20.5;
    var step = ce.length/canvas.width; 
    for(; x < canvas.width - 20;) {
      const h = ce[Math.floor(x*step)]/40.0;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height-0.5);
      ctx.lineTo(x, Math.floor(canvas.height-1.5-Math.floor(canvas.height*h)));
      x++;
      ctx.stroke(); // Draw it
    };
  };
  xhr.send();
}
function clear_ce_values(canvas_id) {
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function load_constellation_values(canvas_id, path) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    const iq = new Float32Array(this.response);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth - 28;
    canvas.height = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#004400";
    ctx.fillStyle = "#00CC00";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0.5, canvas.height/2 - 0.5);
    ctx.lineTo(canvas.width - 0.5, canvas.height/2 - 0.5);
    ctx.moveTo(canvas.width/2 - 0.5, 0.5);
    ctx.lineTo(canvas.width/2 - 0.5, canvas.height);
    ctx.stroke(); // Draw it

    var n;
    for(n=0; n < iq.length/2; n+=2)
    {
      const i = iq[n];
      const q = iq[n+1];
      ctx.fillRect(canvas.width/2 + i*(canvas.width/2.5),
        canvas.height/2 + q*(canvas.height/2.5),
        1,1);
    }
  };
  xhr.send();
}

function clear_constellation_values(canvas_id) {
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth - 28;
    canvas.height = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#004400";
    ctx.fillStyle = "#00CC00";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0.5, canvas.height/2 - 0.5);
    ctx.lineTo(canvas.width - 0.5, canvas.height/2 - 0.5);
    ctx.moveTo(canvas.width/2 - 0.5, 0.5);
    ctx.lineTo(canvas.width/2 - 0.5, canvas.height);
    ctx.stroke(); // Draw it
}

function clear_all() {
  $("#sync-status").html("Not running");
  $("#sync-cfo").html("-");
  $("#sync-cell-id").html("-");
  $("#sync-prb").html("-");
  $("#sync-width").html("-");
  $("#carriers-lower").html("-");
  $("#carriers-upper").html("-");
  $("#sync-scs").html("-");
  $("#sync-cinr").html("-");
  $("#sdr-freq").val();
  $("#carriers-center").html("-");
  $("#sdr-gain").val();
  $("#sdr-antenna").html("-");
  $("#sdr-sample-rate").html("-");
  $("#sdr-filter-bw").html("-");
  $("#sdr-bufferlevel").width(0);
  $("#pdsch-mcs").html("-");
  $("#pdsch-ber").html("-");
  $("#pdsch-bler").html("-");
  clear_ce_values("sdr-carriers");
  clear_constellation_values("pdsch-constellation");
  clear_constellation_values("mcch-constellation");
  clear_constellation_values("mch-constellation");
  window.selected_mch = 0;
  window.mch_info = [];
  $("#rp-services-tbody").empty();
}

function updateMchButtons() {
  $(".mch-button").each( function() {
    let idx = $(this).data("mch-idx");
    if (idx == window.selected_mch) {
      $(this).css("border-style", "inset");
    } else {
      $(this).css("border-style", "outset");
    }
  });
}

function poll(){
  let rp_present = false;
  $.get("/api/rp/status")
    .done( function(data, textStatus, xhr){
      rp_present = true;
      const d = JSON.parse(data);
      $("#sync-status").html(d["state"]);
      $("#sync-cfo").html((Number.parseFloat(d["cfo"])/1000.0).toFixed(3));
      $("#sync-cell-id").html(Number.parseFloat(d["cell_id"]));
      const prb = Number.parseFloat(d["nof_prb"]);
      $("#sync-prb").html(prb);
      $("#sync-width").html(prb * 0.2);
      $("#carriers-lower").html("− " + (prb*0.1).toFixed(1).toString());
      $("#carriers-upper").html("+ " + (prb*0.1).toFixed(1).toString());
      $("#sync-scs").html(Number.parseFloat(d["subcarrier_spacing"]));
      $("#sync-cinr").html(Number.parseFloat(d["cinr_db"]).toFixed(2));

      $.get("/api/rp/sdr_params", function(data){
        const d = JSON.parse(data);
        if (!$("#sdr-freq").is(":focus")) {
          $("#sdr-freq").val((Number.parseFloat(d["frequency"])/1000000).toFixed(2));
        }
        $("#carriers-center").html((Number.parseFloat(d["frequency"])/1000000).toFixed(2).toString() + " MHz");
        if (!$("#sdr-gain").is(":focus")) {
          $("#sdr-gain").val(Number.parseFloat(d["gain"]));
        }
        $("#sdr-antenna").html(d["antenna"]);
        $("#sdr-sample-rate").html((Number.parseFloat(d["sample_rate"])/1000000).toFixed(2));
        $("#sdr-filter-bw").html((Number.parseFloat(d["filter_bw"])/1000000).toFixed(2));
        $("#sdr-bufferlevel").width((Number.parseFloat(d["buffer_level"])*100).toString()+"%");
      }); 


      $.get("/api/rp/mch_info", function(data){
        if (window.mch_info && window.mch_info == data) {
          return;
        }
        console.log("Received new MCH info");
        window.mch_info = data;
        const d = JSON.parse(data);
        let tb = $("#rp-services-tbody");
        tb.empty();
        for(let [idx, mch] of d.entries()) {
          let b = $("<button class='mch-button'>").data("mch-idx", idx).text("⛚");
          b.click( function() {
            window.selected_mch = idx;
            updateMchButtons();
          });
          let c1 = $("<td>").append(b);
          let c2 = $("<td class='mtch-row'>").html("<b>MCH " + idx + "</b> (MCS: " + mch.mcs + ")");
          let row = $("<tr class='mtch-first'>");
          row.append(c1).append(c2);
          tb.append(row); 
          for(let [midx, mtch] of mch.mtchs.entries()) {
            let c3 = $("<td>");
            let c4 = $("<td class='mtch-row'>").html("LCID " + mtch.lcid + "<br>TMGI: 0x" + mtch.tmgi + "<br>" + mtch.dest);
            let r2 = $("<tr>");
            r2.append(c3).append(c4);
            tb.append(r2); 
          }
        }
        updateMchButtons();

      }); 

      $.get("/api/rp/pdsch_status", function(data){
        const d = JSON.parse(data);
        $("#pdsch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#pdsch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#pdsch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
      }); 
      $.get("/api/rp/mcch_status", function(data){
        const d = JSON.parse(data);
        $("#mcch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#mcch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#mcch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
      }); 
      $.get("/api/rp/mch_status/" + window.selected_mch, function(data){
        const d = JSON.parse(data);
        $("#mch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#mch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#mch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
        $("#mch-idx").html("MCH " + (window.selected_mch));
      }); 

      load_ce_values("sdr-carriers");
      load_constellation_values("pdsch-constellation", "/api/rp/pdsch_data");
      load_constellation_values("mcch-constellation", "/api/rp/mcch_data");
      load_constellation_values("mch-constellation", "/api/rp/mch_data/" + window.selected_mch);
  })
    .fail( function(data, textStatus, xhr){
      clear_all();
    });
}

$(function() {
  window.selected_mch = 0;
  setInterval(poll, 300);

  $("#sdr-freq").on('change', function () {
    let new_freq = $(this).val() * 1000000;
    console.log("freq set to " + new_freq);
    $.ajax( "/api/rp/sdr_params", {
      data: JSON.stringify({ frequency: new_freq }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#sdr-gain").on('change', function () {
    let new_gain = $(this).val() * 1.0;
    console.log("gain set to " + new_gain);
    $.ajax( "/api/rp/sdr_params", {
      data: JSON.stringify({ gain: new_gain }),
      contentType: "application/json",
      type: "PUT"
    });
  });
});
