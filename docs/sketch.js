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
let r_matrix_mica_0, g_matrix_mica_0, b_matrix_mica_0;
let r_matrix_mica_90, g_matrix_mica_90, b_matrix_mica_90;
let r_matrix_mica_285, g_matrix_mica_285, b_matrix_mica_285;
let r_matrix, g_matrix, b_matrix;
let row_slider, col_slider, int_slider;
let dropdown_flake;
let dropdown_sio2;
let thickness_max;
let version = 'v1.4.0';
let version_link;
let sidebar_width;


// disable scrolling (helps prevent issues on mobile)
document.body.style.overflow = "hidden"; 


function preload() {
  // load in our sets of "uncropped linear RGB values"
  // there's probably a better way to code this but I don't really know JS
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

  r_matrix_mica_0 = loadTable('./data/r_flake_mica_0.csv', 'csv', 'header=false');
  g_matrix_mica_0 = loadTable('./data/g_flake_mica_0.csv', 'csv', 'header=false');
  b_matrix_mica_0 = loadTable('./data/b_flake_mica_0.csv', 'csv', 'header=false');

  r_matrix_mica_90 = loadTable('./data/r_flake_mica_90.csv', 'csv', 'header=false');
  g_matrix_mica_90 = loadTable('./data/g_flake_mica_90.csv', 'csv', 'header=false');
  b_matrix_mica_90 = loadTable('./data/b_flake_mica_90.csv', 'csv', 'header=false');

  r_matrix_mica_285 = loadTable('./data/r_flake_mica_285.csv', 'csv', 'header=false');
  g_matrix_mica_285 = loadTable('./data/g_flake_mica_285.csv', 'csv', 'header=false');
  b_matrix_mica_285 = loadTable('./data/b_flake_mica_285.csv', 'csv', 'header=false');
}

function sRGB_conv(value) {
  // takes "uncropped linear RGB values" and converts to sRGB
  // apply gamma function 
  let post_gamma;
  if (value <= 0.0031308) {
    post_gamma = value * 12.92;
  } else {
    post_gamma = 1.055*Math.pow(value, 1/2.4) - 0.055
  }
  // constrain to [0, 1], scale to [0, 255]
  return Math.round(constrain(post_gamma, 0, 1)*255);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // create sliders to serve as row and col selectors for our matrices
  // row is light color temp, col is flake thickness, int is light intensity
  // start with temporary maxes at 2, to be reset in setMatrices() (i don't know a better way to solve this problem)
  row_slider = createSlider(0, 2, 0, 1);
  col_slider = createSlider(0, 2, 0, 1);
  int_slider = createSlider(0, 50, 25, 1);
  row_slider.class('slider')
  col_slider.class('slider')
  int_slider.class('slider')
  
  // dropdown to select flakes
  dropdown_flake = createSelect();
  dropdown_flake.option('graphite');
  dropdown_flake.option('h-BN');
  dropdown_flake.option('WSe2')
  dropdown_flake.option('muscovite');
  dropdown_flake.changed(onDropdownChange);

  // dropdown to select sio2 thickness
  dropdown_sio2 = createSelect();
  dropdown_sio2.option('0 nm')
  dropdown_sio2.option('90 nm');
  dropdown_sio2.option('285 nm');
  dropdown_sio2.changed(onDropdownChange);

  // initial conditions
  dropdown_flake.selected('graphite');
  dropdown_sio2.selected('90 nm');
  setMatrices(dropdown_flake.value(), dropdown_sio2.value());

  // version link
  version_link = createA('./info.pdf', version, '_blank');
  version_link.position(20, 12);
  version_link.style('font-family', 'Times New Roman');
  version_link.style('font-size', '20px');
  version_link.style('font-weight', 'bold');
  version_link.style('color', 'blue');
  version_link.style('text-decoration', 'none');
  version_link.style('visited', 'color: blue');
}

function draw() {
  // currently a dummy variable, does not affect elements in the sidebar
  sidebar_width = 210;

  // handle dynamic flake sizing
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
  // set flake position
  let flake_x = sidebar_width + (windowWidth-sidebar_width)*flake_buffer_x;
  let flake_y = windowHeight*flake_buffer_y;

  // slider positioning
  let slider_spacing = sidebar_width / 4;
  let lower_text_height = 120;
  row_slider.position(slider_spacing - row_slider.height/2, windowHeight - lower_text_height);
  col_slider.position(slider_spacing*2 - row_slider.height/2, windowHeight - lower_text_height);
  int_slider.position(slider_spacing*3 - row_slider.height/2, windowHeight - lower_text_height);

  // slider scale
  let upper_text_height = 180;
  let slider_length = (windowHeight - lower_text_height - upper_text_height)
  row_slider.style('width', `${slider_length}px`);
  col_slider.style('width', `${slider_length}px`);
  int_slider.style('width', `${slider_length}px`);

  // dropdown positioning
  let dropdown_x = 115;
  let dropdown_y = windowHeight - lower_text_height + 50;
  dropdown_flake.position(dropdown_x, dropdown_y);
  dropdown_sio2.position(dropdown_x, dropdown_y + 25);

  // slider scale values
  let row = row_slider.value();
  let col = col_slider.value();
  let int_index = int_slider.value();
  let intensity = map(int_index, 0, 50, 0, 2);

  // get d=0 rgb values (substrate)
  let r_sub = sRGB_conv(intensity*parseFloat(r_matrix.getString(row, 0)));
  let g_sub = sRGB_conv(intensity*parseFloat(g_matrix.getString(row, 0)));
  let b_sub = sRGB_conv(intensity*parseFloat(b_matrix.getString(row, 0)));

  // get (T, d) rgb values (flake)
  let r_fl = sRGB_conv(intensity*parseFloat(r_matrix.getString(row, col)));
  let g_fl = sRGB_conv(intensity*parseFloat(g_matrix.getString(row, col)));
  let b_fl = sRGB_conv(intensity*parseFloat(b_matrix.getString(row, col)));

  // set row & col slider to temp & thickness values
  // round thickness to nearest angstrom
  let temp = map(row, 0, r_matrix.getRowCount()-1, 2000, 5500).toFixed(0);
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
  rect(0, 0, sidebar_width, height);

  // set fill color for making the flake
  fill(r_fl, g_fl, b_fl);
  
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
  
  // text params
  textFont('Times New Roman');
  fill(0);
  
  // slider data text
  textSize(30);
  textStyle('normal');
  let text_x_offset = 20;
  let data_text_h = 30
  text(temp + ' K', text_x_offset, 70);
  text(layers + ' layers', text_x_offset, 70 + data_text_h);
  text(thick + ' nm', text_x_offset, 70 + data_text_h*2);
  text(intensity + ' intensity', text_x_offset, 70 + data_text_h*3);

  // slider label text
  textSize(20);
  textStyle('bold');
  text('T', row_slider.x, row_slider.y + 25);
  text('d', col_slider.x, col_slider.y + 25);
  text('I', int_slider.x+2, int_slider.y + 25);

  // dropdown menu text
  textSize(15);
  text('Material:', dropdown_flake.x - 65, dropdown_flake.y + 13);
  text('SiO2 thickness:', dropdown_sio2.x - 104, dropdown_sio2.y + 13);

  // versioning text
  textSize(20);
  text('Flake Sim ', text_x_offset, 30);
  let text_width_name = textWidth('Flake Sim ');
  version_link.position(text_x_offset + text_width_name, 12);
}
  

// pretty self explanatory here -> this code is attrocious but I really don't know JS
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
  } else if (flake_matr === 'muscovite') {
    if (sio2_matr === '90 nm') {
      r_matrix = r_matrix_mica_90;
      g_matrix = g_matrix_mica_90;
      b_matrix = b_matrix_mica_90;
    } else if (sio2_matr === '285 nm') {
      r_matrix = r_matrix_mica_285;
      g_matrix = g_matrix_mica_285;
      b_matrix = b_matrix_mica_285;
    } else if (sio2_matr === '0 nm') {
      r_matrix = r_matrix_mica_0;
      g_matrix = g_matrix_mica_0;
      b_matrix = b_matrix_mica_0;
    }
    thickness_max = 60*10.053;
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

