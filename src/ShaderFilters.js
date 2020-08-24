import * as PIXI from 'pixi.js';

// 2 7 
// kernal, threshold ^
// i <= threshold? 0: 255;
const threshold = `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main(void)
  {
    // vec4 color = texture2D(uSampler, vTextureCoord);
    // float thres = color.r > 0.6 ? 1.0 : 0.0;
    // gl_FragColor = vec4(thres, thres, thres, 1.0);
  }
`;
export const thresholdFilter = new PIXI.Filter('', threshold, {});

const greyScale = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void)
    {
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), 1.0);
    }
  `;

export const greyscaleFilter = new PIXI.Filter('', greyScale, {});

const adaptiveThreshold = `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;  // Texture that will be blurred by this shader

  uniform float blurSize;

  void main() {
    float blurDiv = (blurSize * 2.0 + 1.0) * (blurSize * 2.0 + 1.0);
    float pixelX = 1.0 / 480.0;
    float pixelY = 1.0 / 360.0;
    float source = texture2D(uSampler, vTextureCoord).r;
    float blurredVal = 0.0;

    for (float x = 0.0; x <= 1000.0; x++) {
      if (x > blurSize + blurSize) break;
      float xCoord = x - blurSize;

      for (float y = 0.0; y <= 1000.0; y++) {
        if (y > blurSize + blurSize) break;

        float yCoord = y - blurSize;
        float neighbor = texture2D(uSampler, vec2(vTextureCoord.x + (pixelX * xCoord), vTextureCoord.y + (pixelY * yCoord))).r;
        blurredVal += neighbor;
      }
    }

    blurredVal = blurredVal / blurDiv;  
    blurredVal = (source - blurredVal < -0.035) ? 1.0 : 0.0;
    // blurredVal = texture2D(uSampler, vec2(vTextureCoord.x + (pixelX * 30.0), vTextureCoord.y + (pixelY * 30.0))).r;

    gl_FragColor = vec4(blurredVal, blurredVal, blurredVal, 1.0);
  }`

export const adaptiveThresholdFilter = new PIXI.Filter('', adaptiveThreshold, { blurSize: 2.0 });
