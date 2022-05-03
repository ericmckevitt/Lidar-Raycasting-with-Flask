class Point {

  // constructor sets x and y values 
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // write a show() method for the Point class that draws a point at the point's location
  show() {
    // draw a circle at the point's location
    stroke(0);
    fill(0);
    ellipse(this.x, this.y, 1, 1);
  }

  // Write a equals() method for the Point class that returns true if the two points have the same x and y values
  equals(other) {
    return this.x == other.x && this.y == other.y;
  }

  // Write a toString() method for the Point class that returns a string in the form (x, y)
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}