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
let version = 'Flake Sim v1.2.1'
let sidebar_width;

document.body.style.overflow = "hidden"; // Disables scrolling completely


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
  row_slider = createSlider(0, 2, 0, 1);
  col_slider = createSlider(0, 2, 0, 1);
  int_slider = createSlider(0, 50, 25, 1);

  setMatrices('graphite', '90 nm');

  row_slider.style('transform-origin', 'left top'); 
  row_slider.style('transform', 'rotate(-90deg)');
  row_slider.class('slider')
  
  col_slider.style('transform-origin', 'left top'); 
  col_slider.style('transform', 'rotate(-90deg)');
  col_slider.class('slider')

  int_slider.style('transform-origin', 'left top'); 
  int_slider.style('transform', 'rotate(-90deg)');
  int_slider.class('slider')
  
  // dropdown to select flakes
  dropdown_flake = createSelect();
  dropdown_flake.option('graphite');
  dropdown_flake.option('h-BN');
  dropdown_flake.option('WSe2')
  dropdown_flake.selected('graphite');
  dropdown_flake.changed(onDropdownChange);

  // dropdown to select sio2 thickness
  dropdown_sio2 = createSelect();
  dropdown_sio2.option('0 nm')
  dropdown_sio2.option('90 nm');
  dropdown_sio2.option('285 nm');
  dropdown_sio2.selected('90 nm');
  dropdown_sio2.changed(onDropdownChange);
}

function draw() {
  // some general params
  textFont('Times New Roman');
  // currently a dummy variable, does not affect elements in the sidebar
  sidebar_width = 200;

  // handle flake size
  let flake_naive_w = 587;
  let flake_naive_h = 739;
  let flake_buffer = 0.05
  // to scale the flake would be to take the ratio of the available width and height with the naive flake w and h
  // and then see which one is smaller, then to scale, account for a 5% buffer on either side of flake
  let flake_scale = min(windowHeight/flake_naive_h, (windowWidth - sidebar_width)/flake_naive_w) * (1-2*flake_buffer);
  // see which dim is the limiting dim, and center the flake in the non-limiting dim
  let height_limited = (windowHeight/flake_naive_h < (windowWidth - sidebar_width)/flake_naive_w);
  let flake_buffer_x = flake_buffer;
  let flake_buffer_y = flake_buffer;
  if (height_limited) {
    flake_buffer_x = ((windowWidth - sidebar_width) - flake_naive_w*flake_scale)/2/(windowWidth-sidebar_width);
  } else {
    flake_buffer_y = (windowHeight - flake_naive_h*flake_scale)/2/windowHeight;
  }
  let flake_x = sidebar_width + (windowWidth-sidebar_width)*flake_buffer_x;
  let flake_y = windowHeight*flake_buffer_y;

  // slider positioning
  let slider_spacing = 50;
  row_slider.position(40, windowHeight - 120);
  col_slider.position(40 + slider_spacing, windowHeight - 120);
  int_slider.position(40 + 2*slider_spacing, windowHeight - 120);

  let slider_height = (windowHeight - 120 - 180)

  row_slider.style('width', `${slider_height}px`);
  col_slider.style('width', `${slider_height}px`);
  int_slider.style('width', `${slider_height}px`);

  // dropdown positioning
  dropdown_flake.position(col_slider.x + 25, row_slider.y + 50);
  dropdown_sio2.position(dropdown_flake.x, dropdown_flake.y + 25);

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
  vertex(flake_scale*23 + flake_x, flake_scale*80 + flake_y);
  vertex(flake_scale*309 + flake_x, flake_scale*0 + flake_y);
  vertex(flake_scale*418 + flake_x, flake_scale*27 + flake_y);
  vertex(flake_scale*460 + flake_x, flake_scale*82 + flake_y);
  vertex(flake_scale*480 + flake_x, flake_scale*149 + flake_y);
  vertex(flake_scale*475 + flake_x, flake_scale*168 + flake_y);
  vertex(flake_scale*487 + flake_x, flake_scale*200 + flake_y);
  vertex(flake_scale*546 + flake_x, flake_scale*248 + flake_y);
  vertex(flake_scale*478 + flake_x, flake_scale*528 + flake_y);
  vertex(flake_scale*499 + flake_x, flake_scale*601 + flake_y);
  vertex(flake_scale*533 + flake_x, flake_scale*611 + flake_y);
  vertex(flake_scale*587 + flake_x, flake_scale*663 + flake_y);
  vertex(flake_scale*535 + flake_x, flake_scale*698 + flake_y);
  vertex(flake_scale*276 + flake_x, flake_scale*739 + flake_y);
  vertex(flake_scale*250 + flake_x, flake_scale*710 + flake_y);
  vertex(flake_scale*173 + flake_x, flake_scale*692 + flake_y);
  vertex(flake_scale*114 + flake_x, flake_scale*635 + flake_y);
  vertex(flake_scale*103 + flake_x, flake_scale*541 + flake_y);
  vertex(flake_scale*120 + flake_x, flake_scale*511 + flake_y);
  vertex(flake_scale*108 + flake_x, flake_scale*416 + flake_y);
  vertex(flake_scale*18 + flake_x, flake_scale*148 + flake_y);
  vertex(flake_scale*0 + flake_x, flake_scale*139 + flake_y);
  endShape(CLOSE);
  
  // draw labels for the sliders
  fill(0);
  textSize(30);
  let text_x_offset = 20;
  let data_text_h = 30
  textStyle('normal');
  text(temp + ' K', text_x_offset, 70);
  text(layers + ' layers', text_x_offset, 70 + data_text_h);
  text(thick + ' nm', text_x_offset, 70 + data_text_h*2);
  text(intensity + ' intensity', text_x_offset, 70 + data_text_h*3);
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
  textSize(20);
  text(version, text_x_offset, 30);
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

