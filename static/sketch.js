// Loading in data
let fileContents;
let points = [];
let display_points = false;

// Convex Hull
let vector_points = [];
let hull = [];
let leftMost;
let currentVertex;
let index;
let nextIndex = -1;
let done = false;
let numPoints;

// Raycasting 
let walls = [];
let ray;
let particle;
const sceneW = 400;
const sceneH = 400;
let sliderFOV;

function preload() {
  // Stores the file in a variable 
  fileContents = loadStrings('static/file.txt')
}

function setup() {
  createCanvas(800, 400);

  particle = new Particle();
  particle.update(sceneW / 2, sceneH / 2);

  sliderFOV = createSlider(0, 360, 45);
  sliderFOV.input(changeFOV);

  // Create a wall dividing the screen in half
  walls.push(new Boundary(width / 2, 0, width / 2, height));

  for (let line of fileContents) {
    // Ignore the first 3 lines
    if (line.length > 0 && line.charAt(0) != '#') {
      // Collect the data from the current line
      let words = line.split(' ');
      let theta = Number(words[0]);
      let r = Number(words[1]);

      // Convert theta to radians
      theta = theta * Math.PI / 180;

      console.log('-----------------')
      console.log("Polar: ", r, theta);

      // Convert the polar coordinates to cartesian
      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);
      console.log("Cartesian: ", x, y);

      // Create a new point
      let p_vector = createVector(x, y);
      points.push(p_vector); // Add the point to the array
    }
  }

  // Remove every other point from pints
  // for (let i = 0; i < points.length; i++) {
  //   if (i % 10 == 0) {
  //     points.pop(points[i]);
  //   }
  // }


  // Set the number of points
  numPoints = points.length;

  // Find the maximum x and y values
  let max_x = 0;
  let max_y = 0;
  let min_x = 0;
  let min_y = 0;
  for (let p of points) {
    if (p.x > max_x) {
      max_x = p.x;
    }
    if (p.y > max_y) {
      max_y = p.y;
    }
    if (p.x < min_x) {
      min_x = p.x;
    }
    if (p.y < min_y) {
      min_y = p.y;
    }
  }

  // For each point, map it's x and y values from their current min and max to the width and height of the canvas
  let horizontal_margin = (width / 2) / 10;
  let vertical_margin = height / 10;
  for (let p of points) {
    p.x = map(p.x, min_x, max_x, 0 + horizontal_margin, (width / 2) - horizontal_margin);
    p.y = map(p.y, min_y, max_y, 0 + vertical_margin, height - vertical_margin);
  }

  // Find the maximum x and y values
  max_x = 0;
  max_y = 0;
  min_x = 0;
  min_y = 0;
  for (let p of points) {
    if (p.x > max_x) {
      max_x = p.x;
    }
    if (p.y > max_y) {
      max_y = p.y;
    }
    if (p.x < min_x) {
      min_x = p.x;
    }
    if (p.y < min_y) {
      min_y = p.y;
    }
  }

  // Report the maximum x and y values
  console.log("\nMin x: " + min_x);
  console.log("Max x: " + max_x);
  console.log("Min y: " + min_y);
  console.log("Max y: " + max_y);
  console.log('Size: ', points.length);

  points.sort((a, b) => a.x - b.x);
  leftMost = points[0];
  currentVertex = leftMost;
  hull.push(currentVertex);
  nextVertex = points[1];
  index = 2;
}

function convex_hull() {
  // draw hull
  stroke(0, 0, 255);
  strokeWeight(4);
  fill(0, 0, 255, 50);
  beginShape();
  for (let p of hull) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  stroke(0, 255, 0);
  strokeWeight(16);
  point(leftMost.x, leftMost.y);

  stroke(200, 0, 255);
  strokeWeight(16);
  point(currentVertex.x, currentVertex.y);

  stroke(0, 255, 0);
  strokeWeight(2);
  if (!done) {
    line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);
  }

  let checking = points[index];

  stroke(255);
  if (!done) {
    line(currentVertex.x, currentVertex.y, checking.x, checking.y);
  }

  // Cross Product

  const a = p5.Vector.sub(nextVertex, currentVertex);
  const b = p5.Vector.sub(checking, currentVertex);
  const cross = a.cross(b);

  if (cross.z > 0) {
    nextVertex = checking;
    nextIndex = index;
  }
  index += 1

  if (index == points.length) {
    if (nextVertex == leftMost) {
      console.log('done');
      // noLoop();
      return;
    } else {
      hull.push(nextVertex);
      currentVertex = nextVertex;
      index = 0;
      //points.splice(nextIndex, 1);
      nextVertex = leftMost;
    }
  }
}

function make_walls_from_points() {
  // Create walls from points
  for (let i = 0; i < hull.length; i++) {
    let p1 = hull[i];
    let p2 = hull[(i + 1) % hull.length];
    walls.push(new Boundary(p1.x, p1.y, p2.x, p2.y));
  }
}

function changeFOV() {
  let fov = sliderFOV.value();
  particle.updateFOV(fov);
}

function draw() {
  background(20);

  // draw walls
  for (let w of walls) {
    w.show();
  }

  if (!done) {
    // draw points
    stroke(255);
    strokeWeight(1);
    for (let p of points) {
      point(p.x, p.y);
    }

    try {
      convex_hull();
    }
    catch (err) {
      console.log(err);
      done = true;
      make_walls_from_points()

    }
  } else { // Raycasting begins now

    // Movement
    if (keyIsDown(LEFT_ARROW)) {
      particle.rotate(-0.05);
    } else if (keyIsDown(RIGHT_ARROW)) {
      particle.rotate(0.05);
    } else if (keyIsDown(UP_ARROW)) {
      particle.move(1);
    } else if (keyIsDown(DOWN_ARROW)) {
      particle.move(-1);
    }

    particle.show();

    const scene = particle.look(walls);
    const w = sceneW / scene.length;
    push();
    translate(sceneW, 0);
    for (let i = 0; i < scene.length; i++) {
      noStroke();
      const sq = scene[i] * scene[i];
      const wSq = sceneW * sceneW;
      const b = map(sq, 0, wSq, 255, 0);
      const h = map(scene[i], 0, sceneW, sceneH, 0);
      fill(b);
      rectMode(CENTER);
      rect(i * w + w / 2, sceneH / 2, w + 1, h);
    }
    pop();
  }
}