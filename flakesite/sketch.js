// introduce some variables
let r_matrix_gr_0, g_matrix_gr_0, b_matrix_gr_0;
let r_matrix_gr_90, g_matrix_gr_90, b_matrix_gr_90;
let r_matrix_gr_285, g_matrix_gr_285, b_matrix_gr_285;
let r_matrix_bn_0, g_matrix_bn_0, b_matrix_bn_0;
let r_matrix_bn_90, g_matrix_bn_90, b_matrix_bn_90;
let r_matrix_bn_285, g_matrix_bn_285, b_matrix_bn_285;
let r_matrix_wse2_0, g_matrix_wse2_0, b_matrix_wse2_0;
let r_matrix_wse2_90, g_matrix_wse2_90, b_matrix_wse2_90;
let r_matrix_wse2_285, g_matrix_wse2_285, b_matrix_wse2_285;
let r_matrix, g_matrix, b_matrix;
let row_slider, col_slider, int_slider;
let dropdown_flake;
let dropdown_sio2;
let thickness_max;
let version = 'Flake Sim v1.0.0'

// set offset for flake outline
let flake_x = 300;
let flake_y = 40;

function preload() {
  // load in our two sets of rgb values, graphite & h-BN
  r_matrix_gr_0 = loadTable('./data/r_flake_gr_0.csv', 'csv', 'header=false');
  g_matrix_gr_0 = loadTable('./data/g_flake_gr_0.csv', 'csv', 'header=false');
  b_matrix_gr_0 = loadTable('./data/b_flake_gr_0.csv', 'csv', 'header=false');

  r_matrix_gr_90 = loadTable('./data/r_flake_gr_90.csv', 'csv', 'header=false');
  g_matrix_gr_90 = loadTable('./data/g_flake_gr_90.csv', 'csv', 'header=false');
  b_matrix_gr_90 = loadTable('./data/b_flake_gr_90.csv', 'csv', 'header=false');

  r_matrix_gr_285 = loadTable('./data/r_flake_gr_285.csv', 'csv', 'header=false');
  g_matrix_gr_285 = loadTable('./data/g_flake_gr_285.csv', 'csv', 'header=false');
  b_matrix_gr_285 = loadTable('./data/b_flake_gr_285.csv', 'csv', 'header=false');

  r_matrix_bn_0 = loadTable('./data/r_flake_bn_0.csv', 'csv', 'header=false');
  g_matrix_bn_0 = loadTable('./data/g_flake_bn_0.csv', 'csv', 'header=false');
  b_matrix_bn_0 = loadTable('./data/b_flake_bn_0.csv', 'csv', 'header=false');

  r_matrix_bn_90 = loadTable('./data/r_flake_bn_90.csv', 'csv', 'header=false');
  g_matrix_bn_90 = loadTable('./data/g_flake_bn_90.csv', 'csv', 'header=false');
  b_matrix_bn_90 = loadTable('./data/b_flake_bn_90.csv', 'csv', 'header=false');

  r_matrix_bn_285 = loadTable('./data/r_flake_bn_285.csv', 'csv', 'header=false');
  g_matrix_bn_285 = loadTable('./data/g_flake_bn_285.csv', 'csv', 'header=false');
  b_matrix_bn_285 = loadTable('./data/b_flake_bn_285.csv', 'csv', 'header=false');

  r_matrix_wse2_0 = loadTable('./data/r_flake_wse2_0.csv', 'csv', 'header=false');
  g_matrix_wse2_0 = loadTable('./data/g_flake_wse2_0.csv', 'csv', 'header=false');
  b_matrix_wse2_0 = loadTable('./data/b_flake_wse2_0.csv', 'csv', 'header=false');

  r_matrix_wse2_90 = loadTable('./data/r_flake_wse2_90.csv', 'csv', 'header=false');
  g_matrix_wse2_90 = loadTable('./data/g_flake_wse2_90.csv', 'csv', 'header=false');
  b_matrix_wse2_90 = loadTable('./data/b_flake_wse2_90.csv', 'csv', 'header=false');

  r_matrix_wse2_285 = loadTable('./data/r_flake_wse2_285.csv', 'csv', 'header=false');
  g_matrix_wse2_285 = loadTable('./data/g_flake_wse2_285.csv', 'csv', 'header=false');
  b_matrix_wse2_285 = loadTable('./data/b_flake_wse2_285.csv', 'csv', 'header=false');
}

function gamma(value) {
  let post_gamma;
  if (value <= 0.0031308) {
    post_gamma = value * 12.92;
  } else {
    post_gamma = 1.055*Math.pow(value, 1/2.4) - 0.055
  }
  return Math.round(constrain(post_gamma, 0, 1)*255);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // create sliders to serve as row and col selectors for our matrices
  // row is light color temp, col is flake thickness
  // start with temporary maxes at 2, to be reset in setMatrices
  // (i don't know a better way to solve this problem)
  // intensity slider changes intensity level

  // Slider(min, max, init_val, step)
  let slider_spacing = 50;
  row_slider = createSlider(0, 2, 0, 1);
  row_slider.position(40, height - 120);
  
  col_slider = createSlider(0, 2, 0, 1);
  col_slider.position(40 + slider_spacing, height - 120);

  int_slider = createSlider(0, 50, 25, 1);
  int_slider.position(40 + 2*slider_spacing, height - 120);

  setMatrices('graphite', '90 nm');

  row_slider.style('transform-origin', 'left top'); 
  row_slider.style('transform', 'rotate(-90deg)');
  row_slider.style('width', '500px');
  row_slider.class('slider')
  
  col_slider.style('transform-origin', 'left top'); 
  col_slider.style('transform', 'rotate(-90deg)');
  col_slider.style('width', '500px');
  col_slider.class('slider')

  int_slider.style('transform-origin', 'left top'); 
  int_slider.style('transform', 'rotate(-90deg)');
  int_slider.style('width', '500px');
  int_slider.class('slider')
  
  // dropdown to select flakes
  dropdown_flake = createSelect();
  dropdown_flake.position(col_slider.x + 25, row_slider.y + 50);
  dropdown_flake.option('graphite');
  dropdown_flake.option('h-BN');
  dropdown_flake.option('WSe2')
  dropdown_flake.selected('graphite');
  dropdown_flake.changed(onDropdownChange);

  // dropdown to select sio2 thickness
  dropdown_sio2 = createSelect();
  dropdown_sio2.position(dropdown_flake.x, dropdown_flake.y + 25);
  dropdown_sio2.option('0 nm')
  dropdown_sio2.option('90 nm');
  dropdown_sio2.option('285 nm');
  dropdown_sio2.selected('90 nm');
  dropdown_sio2.changed(onDropdownChange);

  // Create the shutdown button - CHATGPT generated pretty much
  let shutdownButton = createButton("Quit");
  shutdownButton.position(int_slider.x + 10, 10);
  shutdownButton.mousePressed(() => {
    fetch('/shutdown')
      .then(response => response.text())
      .then(data => {
        console.log(data); // Log the shutdown confirmation message
        window.location.href = "about:blank";
      })
      .catch(err => console.error("Error shutting down:", err));
  });

}

function draw() {
  let row = row_slider.value();
  let col = col_slider.value();
  let int_index = int_slider.value();

  let intensity = map(int_index, 0, 50, 0, 2);

  // get d=0 rgb values (substrate)
  let r_sub = gamma(intensity*parseFloat(r_matrix.getString(row, 0)));
  let g_sub = gamma(intensity*parseFloat(g_matrix.getString(row, 0)));
  let b_sub = gamma(intensity*parseFloat(b_matrix.getString(row, 0)));

  // get (T, d) rgb values (flake)
  let r_fl = gamma(intensity*parseFloat(r_matrix.getString(row, col)));
  let g_fl = gamma(intensity*parseFloat(g_matrix.getString(row, col)));
  let b_fl = gamma(intensity*parseFloat(b_matrix.getString(row, col)));

  // set row & col slider to temp & thickness values
  // round thickness to nearest angstrom
  let temp = map(row, 0, r_matrix.getRowCount()-1, 2500, 4500).toFixed(0);
  let layers = col;
  let thick = map(col, 0, r_matrix.getColumnCount()-1, 0, thickness_max).toFixed(3)

  // set background color
  background(r_sub, g_sub, b_sub)
  row_slider.style('background', `rgb(${r_sub}, ${g_sub}, ${b_sub})`)
  col_slider.style('background', `rgb(${r_sub}, ${g_sub}, ${b_sub})`)
  int_slider.style('background', `rgb(${r_sub}, ${g_sub}, ${b_sub})`)

  // set background in parameter region
  noStroke();
  fill(255, 255, 255);
  rect(0, 0, int_slider.x + 60, height);

  // set fill color for making the flake
  fill(r_fl, g_fl, b_fl);
  noStroke();
  
  // define flake shape
  beginShape();
  vertex(23 + flake_x, 80 + flake_y);
  vertex(309 + flake_x, 0 + flake_y);
  vertex(418 + flake_x, 27 + flake_y);
  vertex(460 + flake_x, 82 + flake_y);
  vertex(480 + flake_x, 149 + flake_y);
  vertex(475 + flake_x, 168 + flake_y);
  vertex(487 + flake_x, 200 + flake_y);
  vertex(546 + flake_x, 248 + flake_y);
  vertex(478 + flake_x, 528 + flake_y);
  vertex(499 + flake_x, 601 + flake_y);
  vertex(533 + flake_x, 611 + flake_y);
  vertex(587 + flake_x, 663 + flake_y);
  vertex(535 + flake_x, 698 + flake_y);
  vertex(276 + flake_x, 739 + flake_y);
  vertex(250 + flake_x, 710 + flake_y);
  vertex(173 + flake_x, 692 + flake_y);
  vertex(114 + flake_x, 635 + flake_y);
  vertex(103 + flake_x, 541 + flake_y);
  vertex(120 + flake_x, 511 + flake_y);
  vertex(108 + flake_x, 416 + flake_y);
  vertex(18 + flake_x, 148 + flake_y);
  vertex(0 + flake_x, 139 + flake_y);
  endShape(CLOSE);
  
  // draw labels for the sliders
  fill(0);
  textFont('Times New Roman');
  textSize(30);
  let text_x_offset = 20;
  let text_y_offset = 40;
  textStyle('normal');
  text(temp + ' K', text_x_offset, col_slider.y - 650 + text_y_offset);
  text(layers + ' layers', text_x_offset, col_slider.y - 650 + 30 + text_y_offset);
  text(thick + ' nm', text_x_offset, col_slider.y - 650 + 60 + text_y_offset);
  text(intensity + ' intensity', text_x_offset, col_slider.y - 650 + 90 + text_y_offset);
  textSize(20);
  textStyle('bold');
  text('T', row_slider.x + 4, row_slider.y + 25);
  text('d', col_slider.x + 4, col_slider.y + 25);
  text('I', int_slider.x + 4, int_slider.y + 25);

  // draw labels for dropdown menus
  textSize(15);
  text('Material:', dropdown_flake.x - 65, dropdown_flake.y + 13);
  text('SiO2 thickness:', dropdown_sio2.x - 104, dropdown_sio2.y + 13);

  // versioning
  textSize(17);
  text('Flake Sim v1.0.0', 10, 30);
}

// pretty self explanatory here
function setMatrices(flake_matr, sio2_matr) {
  if (flake_matr === 'graphite') {
    if (sio2_matr === '90 nm') {
      r_matrix = r_matrix_gr_90;
      g_matrix = g_matrix_gr_90;
      b_matrix = b_matrix_gr_90;
    } else if (sio2_matr === '285 nm') {
      r_matrix = r_matrix_gr_285;
      g_matrix = g_matrix_gr_285;
      b_matrix = b_matrix_gr_285;
    } else if (sio2_matr === '0 nm') {
      r_matrix = r_matrix_gr_0;
      g_matrix = g_matrix_gr_0;
      b_matrix = b_matrix_gr_0;
    }
    thickness_max = 150*0.335;
  } else if (flake_matr === 'h-BN') {
    if (sio2_matr === '90 nm') {
      r_matrix = r_matrix_bn_90;
      g_matrix = g_matrix_bn_90;
      b_matrix = b_matrix_bn_90;
    } else if (sio2_matr === '285 nm') {
      r_matrix = r_matrix_bn_285;
      g_matrix = g_matrix_bn_285;
      b_matrix = b_matrix_bn_285;
    } else if (sio2_matr === '0 nm') {
      r_matrix = r_matrix_bn_0;
      g_matrix = g_matrix_bn_0;
      b_matrix = b_matrix_bn_0;
    }
    thickness_max = 600*0.333;
  } else if (flake_matr === 'WSe2') {
    if (sio2_matr === '90 nm') {
      r_matrix = r_matrix_wse2_90;
      g_matrix = g_matrix_wse2_90;
      b_matrix = b_matrix_wse2_90;
    } else if (sio2_matr === '285 nm') {
      r_matrix = r_matrix_wse2_285;
      g_matrix = g_matrix_wse2_285;
      b_matrix = b_matrix_wse2_285;
    } else if (sio2_matr === '0 nm') {
      r_matrix = r_matrix_wse2_0;
      g_matrix = g_matrix_wse2_0;
      b_matrix = b_matrix_wse2_0;
    }
    thickness_max = 300*0.6491;
  }
  // make sure we're resetting the max number of ticks for our sliders
  row_slider.attribute('max', r_matrix.getRowCount() - 1)
  col_slider.attribute('max', r_matrix.getColumnCount() - 1)
}

function onDropdownChange() {
  // get which flake type and set matrix based on that
  let flake_matr = dropdown_flake.value();
  let sio2_matr = dropdown_sio2.value()
  setMatrices(flake_matr, sio2_matr);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}