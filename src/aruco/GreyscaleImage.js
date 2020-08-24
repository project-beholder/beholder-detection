class GreyscaleImage {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.data = [];
    this.data.length = this.size;
  }

  sampleFrom(src, totalWidth, xOff, yOff) {
    for (let i = 0; i < this.height; i++) {
      let y = i + yOff;
      for (let j = 0; j < this.width; j++) {
        let x = j + xOff;
        this.data[i * this.width + j] = src[(i * totalWidth + x) * 4];
      }
    }
  }
}

export default GreyscaleImage;
