function load_ce_values(canvas_id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/modem/ce_values', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    const ce = new Float32Array(this.response);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth - 10;
    ctx.clearRect(0, 0, canvas.parentElement.clientWidth, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00CC00";
    var middle = ce.length/2;
    var x = 0;
    var step = ce.length/canvas.width; 
    for(; x < canvas.width - 65.3;) {
      const h = ce[Math.floor(x*step)]/canvas.height;
      console.log(ce[Math.floor(x*step)]);
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x, Math.floor(canvas.height-(-Math.floor(canvas.height*h))));
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

function load_cir_values(canvas_id, path) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    const cir = new Float32Array(this.response);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00CC00";
    var x = 0;
    var step = cir.length/canvas.width;
    for(; x < canvas.width;) {
      const h = cir[Math.floor(x*step)]/1000;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height-0.5);
      ctx.lineTo(x, Math.floor(canvas.height-0.5-Math.floor(canvas.height*h)));
      x++;
      ctx.stroke(); // Draw it
    };
  };
  xhr.send();
}

function load_corr_values(canvas_id, path) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    const cir = new Float32Array(this.response);
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.parentElement.clientWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#00CC00";
    var x = 0;
    var step = cir.length/canvas.width;
    for(; x < cir.length;) {
      m = Math.floor(x/step);
      //console.log(x%step);
      const h = cir[x]/1000;
      ctx.beginPath();
      ctx.moveTo(m, canvas.height-0.5);
      ctx.lineTo(m, Math.floor(canvas.height-0.5-Math.floor(canvas.height*h)));
      x++;
      ctx.stroke(); // Draw it
    };
  };
  xhr.send();
}

function clear_cir_values(canvas_id) {
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

function plot_graph(canvas_id, status_rx, snr, snr_avg, bler) {
  const canvas = document.getElementById(canvas_id);
  const ctx = canvas.getContext("2d");

  // for snr
  const m_snr = (canvas.height * 0.8)/50;
  const b_snr = m_snr*10;
  snr_escaled = snr*m_snr + b_snr;
  snr_avg_escaled = snr_avg*m_snr + b_snr;

  var right_margin = 60;
  var bottom_margin = 35;
  ctx.imageSmoothingEnabled = false;
var imageData = ctx.getImageData(1, 0, canvas.parentElement.clientWidth - right_margin, canvas.height - bottom_margin );
  canvas.width = canvas.parentElement.clientWidth;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#00CC00";
  ctx.fillStyle = "#00CC00";
  ctx.putImageData(imageData, 0, 0);
  var y;
  var value = -b_snr/10;
  var bler_value = -1;
  if (!window.plot_grid) {
    window.plot_grid = 1;
  for(y = 0; y <= canvas.height; y+= m_snr) {
    if (value % 5 == 0) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#999999";
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width - right_margin, y);
      ctx.stroke();
    }
    value++;

      };}

  ctx.strokeStyle = "#FFFFFF";
  ctx.strokeText("SNR", canvas.parentElement.clientWidth - (right_margin - 5), 10 );
  ctx.strokeText("BLER", canvas.parentElement.clientWidth - (right_margin - 30), 10 );
  for(y = 0; y <= canvas.height; y+= m_snr) {
    if (value % 5 == 0) {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.strokeText(value, canvas.parentElement.clientWidth - (right_margin - 10), canvas.height - y - 10 );
      if (bler_value >= 0) {
        ctx.strokeText(bler_value/10, canvas.parentElement.clientWidth - (right_margin - 40), canvas.height - y - 10 );
      }
      ctx.strokeStyle = "#999999";
      ctx.fillStyle = "#999999";
      ctx.fillRect(canvas.width- right_margin,
        y - 1, // Instantaneous snr
        2,2);
      bler_value += 1;
    }
    value++;

    ctx.font = "lighter 20px Arial";
    ctx.strokeStyle = "#999999";
    ctx.strokeText("Instantaneous CINR (Green)", 0, canvas.height - 10);
    ctx.strokeText("Average (CINR) (Yellow)", 300, canvas.height - 10);
    ctx.strokeText("BLER (Red)", 550, canvas.height - 10);
    ctx.font = "12px sans-serif";

  };

  console.log("Status " + status_rx);
  if (!status_rx.localeCompare("synchronized")) {
  console.log("SNR " + snr);
  console.log("SNR avg" + snr_avg);
  console.log("BLER " + bler);
    ctx.strokeStyle = "#CC0000";
    ctx.beginPath();
    ctx.moveTo(canvas.width-(right_margin + 1), canvas.height - b_snr + 3) ; // Vertical line
    ctx.lineTo(canvas.width-(right_margin + 1), (canvas.height) - canvas.height*bler*0.8 - b_snr + 3); // Vertical line
    ctx.stroke();
    ctx.fillStyle = "#00CC00";
    ctx.fillRect(canvas.width-(right_margin + 1),
     canvas.height - snr_escaled*1.0, // Instantaneous snr
     2,2);
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(canvas.width-(right_margin + 1),
     canvas.height - snr_avg_escaled*1.0,
     2,2);
    ctx.fillStyle = "#CC0000";
    ctx.fillRect(canvas.width-(right_margin + 1),
     (canvas.height) - canvas.height*bler*0.8 - b_snr + 3,
     2,2);

  } else if (!status_rx.localeCompare("syncing")) {
    ctx.strokeStyle = "#CCCCCC22";
    ctx.fillStyle = "#CCCCCC22";
    ctx.beginPath();
    ctx.moveTo(canvas.width-(right_margin + 1), 0);
    ctx.lineTo(canvas.width-(right_margin), canvas.height - bottom_margin );
    ctx.stroke(); // Draw it
  } else if (!status_rx.localeCompare("searching")) {
    ctx.strokeStyle = "#0000CC55";
    ctx.fillStyle = "#0000CC55";
    ctx.beginPath();
    ctx.moveTo(canvas.width-(right_margin + 1), 0);
    ctx.lineTo(canvas.width-(right_margin), canvas.height - bottom_margin );
    ctx.stroke(); // Draw it
  }
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
  window.bler_to_plot = 0;
  $("#modem-services-tbody").empty();
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
  let modem_present = false;

  $.get("/api/modem/status")
    .done( function(data, textStatus, xhr){
      modem_present = true;
      const d = JSON.parse(data);
      $("#sync-status").html(d["state"]);

      if (!window.started && d["state"].localeCompare("Not running") ) {
        window.started = 1;
        clear_cir_values("graph");
      }
      $("#sync-cfo").html((Number.parseFloat(d["cfo"])/1000.0).toFixed(3));
      $("#sync-cell-id").html(Number.parseFloat(d["cell_id"]));
      const prb = Number.parseFloat(d["nof_prb"]);
      $("#sync-prb").html(prb);
      $("#sync-width").html(prb * 0.2);
      $("#carriers-lower").html("− " + (prb*0.1).toFixed(1).toString());
      $("#carriers-upper").html("+ " + (prb*0.1).toFixed(1).toString());
      $("#sync-scs").html(Number.parseFloat(d["subcarrier_spacing"]));
      $("#sync-cinr").html(Number.parseFloat(d["cinr_db"]).toFixed(2));
      // CAS chest params 
      $("#chest-cfg-sync-error").prop("checked", JSON.parse(d["sync_error"]));
      $("input[name=noise-alg-opt][value='"+Number.parseInt(d["noise_alg"])+"']").prop("checked", "true");
      $("input[name=estimator-alg-opt][value='"+Number.parseInt(d["estimator_alg"])+"']").prop("checked", "true");
      $("input[name=filter-type][value='"+Number.parseInt(d["filter_type"])+"']").prop("checked", "true");

      if (!$("#filter-order").is(":focus")) {
        $("#filter-order").val(Number.parseInt(d["filter_order"]));
      }

      if (!$("#filter-coef").is(":focus")) {
        $("#filter-coef").val(Number.parseFloat(d["filter_coef"]).toFixed(2));
      }

      //Phy params
      $("#cfo-est-pss-find").prop("checked", JSON.parse(d["cfo_est_pss_find"]));
      $("#cfo-est-pss-track").prop("checked", JSON.parse(d["cfo_est_pss_track"]));
      $("#cfo-correct-find").prop("checked", JSON.parse(d["cfo_correct_find"]));
      $("#cfo-correct-track").prop("checked", JSON.parse(d["cfo_correct_track"]));
      if (!$("#cfo-pss-loop-bw").is(":focus")) {
        $("#cfo-pss-loop-bw").val(Number.parseFloat(d["cfo_pss_loop_bw"]).toFixed(2));
      }
      if (!$("#cfo-ema-alpha-find").is(":focus")) {
        $("#cfo-ema-alpha-find").val(Number.parseFloat(d["cfo_ema_alpha_find"]).toFixed(2));
      }
      if (!$("#cfo-ema-alpha-track").is(":focus")) {
        $("#cfo-ema-alpha-track").val(Number.parseFloat(d["cfo_ema_alpha_track"]).toFixed(2));
      }
      if (!$("#pss-ema-find").is(":focus")) {
        $("#pss-ema-find").val(Number.parseFloat(d["pss_ema_find"]).toFixed(2));
      }
      if (!$("#pss-ema-track").is(":focus")) {
        $("#pss-ema-track").val(Number.parseFloat(d["pss_ema_track"]).toFixed(2));
      }
      if (!$("#threshold-find").is(":focus")) {
        $("#threshold-find").val(Number.parseFloat(d["threshold_find"]).toFixed(2));
      }
      if (!$("#threshold-track").is(":focus")) {
        $("#threshold-track").val(Number.parseFloat(d["threshold_track"]).toFixed(2));
      }

      $.get("/api/modem/sdr_params", function(data){
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

      $.get("/api/modem/mch_info", function(data){
        if (window.mch_info && window.mch_info == data) {
          return;
        }
        console.log("Received new MCH info");
        window.mch_info = data;
        const d = JSON.parse(data);
        let tb = $("#modem-services-tbody");
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

      $.get("/api/modem/pdsch_status", function(data){
        const d = JSON.parse(data);
        $("#pdsch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#pdsch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#pdsch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
      }); 
      $.get("/api/modem/mcch_status", function(data){
        const d = JSON.parse(data);
        $("#mcch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#mcch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#mcch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
      }); 
      $.get("/api/modem/mch_status/" + window.selected_mch, function(data){
        const d = JSON.parse(data);
        $("#mch-mcs").html(Number.parseFloat(d["mcs"]).toString());
        $("#mch-ber").html(Number.parseFloat(d["ber"]).toFixed(3).toString());
        $("#mch-bler").html(Number.parseFloat(d["bler"]).toFixed(3).toString());
        $("#mch-idx").html("MCH " + (window.selected_mch));
        window.bler_to_plot = Number.parseFloat(d["bler"]).toFixed(3);
      }); 

      load_ce_values("sdr-carriers");
      load_constellation_values("pdsch-constellation", "/api/modem/pdsch_data");
      load_constellation_values("mcch-constellation", "/api/modem/mcch_data");
      load_constellation_values("mch-constellation", "/api/modem/mch_data/" + window.selected_mch);
      plot_graph("graph", d["state"],Number.parseFloat(d["cinr_db"]).toFixed(2), Number.parseFloat(d["cinr_db_avg"]).toFixed(2), window.bler_to_plot);
  })
    .fail( function(data, textStatus, xhr){
      clear_all();
      window.started = 0;
      window.plot_grid = 0;
    });
}

$(function() {
  window.selected_mch = 0;
  window.started = 0;
  window.plot_grid = 0;
  setInterval(poll, 100);

  $("#sdr-freq").on('change', function () {
    let new_freq = $(this).val() * 1000000;
    console.log("freq set to " + new_freq);
    $.ajax( "/api/modem/sdr_params", {
      data: JSON.stringify({ frequency: new_freq }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#sdr-gain").on('change', function () {
    let new_gain = $(this).val() * 1.0;
    console.log("gain set to " + new_gain);
    $.ajax( "/api/modem/sdr_params", {
      data: JSON.stringify({ gain: new_gain }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#noise-alg-empty,#noise-alg-pss,#noise-alg-refs").on('click', function (e) {
    e.stopPropagation();
    let new_alg = $(this).val();
    console.log("Noise est. alg.:" + new_alg);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ noise_alg: new_alg }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#chest-cfg-sync-error").on('click', function () {
    let togle = $(this).is(":checked");
    console.log("Sync error:" + togle);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ sync_error: togle }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#estimator-alg-average,#estimator-alg-interpolate").on('click', function () {
    let new_alg = $(this).val();
    console.log("Noise estimator alg.:" + new_alg);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ estimator_alg: new_alg }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#filter-type-gauss,#filter-type-triangle,#filter-type-none").on('click', function () {
    let new_type= $(this).val();
    console.log("Filter type.:" + new_type);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ filter_type: new_type}),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#filter-order").on('change', function () {
    let new_order= $(this).val() * 1;
    console.log("Filter order set to " + new_order);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ filter_order: new_order }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#filter-coef").on('change', function () {
    let new_coef= $(this).val() * 1.0;
    console.log("Filter coef set to " + new_coef);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ filter_coef: new_coef }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  
  // Phy params
  $("#cfo-est-pss-find").on('click', function () {
    let togle = $(this).is(":checked");
    console.log("CFO est pss find:" + togle);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_est_pss_find: togle }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-est-pss-track").on('click', function () {
    let togle = $(this).is(":checked");
    console.log("CFO est pss track:" + togle);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_est_pss_track: togle }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-correct-find").on('click', function () {
    let togle = $(this).is(":checked");
    console.log("CFO correct find:" + togle);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_correct_find: togle }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-correct-track").on('click', function () {
    let togle = $(this).is(":checked");
    console.log("CFO correct track:" + togle);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_correct_track: togle }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-pss-loop-bw").on('click', function () {
    let new_bw= $(this).val() * 1.0;
    console.log("BW CFO loop :" + new_bw);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_pss_loop_bw: new_bw }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-ema-alpha-find").on('change', function () {
    let new_ema = $(this).val() * 1.0;
    console.log("New CFO ema alpha for find :" + new_ema);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_ema_alpha_find: new_ema }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#cfo-ema-alpha-track").on('change', function () {
    let new_ema = $(this).val() * 1.0;
    console.log("New CFO ema alpha for track:" + new_ema);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ cfo_ema_alpha_track: new_ema }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#pss-ema-find").on('change', function () {
    let new_ema = $(this).val() * 1.0;
    console.log("New pss corr ema alpha for find:" + new_ema);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ pss_ema_find: new_ema }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#pss-ema-track").on('change', function () {
    let new_ema = $(this).val() * 1.0;
    console.log("New pss corr ema alpha for track:" + new_ema);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ pss_ema_track: new_ema }),
      contentType: "application/json",
      type: "PUT"
    });
  });
  $("#threshold-find").on('change', function () {
    let new_threshold = $(this).val() * 1.0;
    console.log("New find threshold:" + new_threshold);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ threshold_find: new_threshold }),
      contentType: "application/json",
      type: "PUT"
    });
  });
   $("#threshold-track").on('change', function () {
    let new_threshold = $(this).val() * 1.0;
    console.log("New trackthreshold:" + new_threshold);
    $.ajax( "/api/modem/chest_cfg_params", {
      data: JSON.stringify({ threshold_track: new_threshold }),
      contentType: "application/json",
      type: "PUT"
    });
  });
 
});
