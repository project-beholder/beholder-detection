import xs from 'xstream';
import { div, span, select, option, input } from '@cycle/dom';
import {
  parameterMenuStyle, parameterItemStyle, parameterItemLabelStyle, parameterItemFieldStyle
} from './Styles';

function makeCameraOption(optionData, i) {
  return option({ attrs: { value: optionData.deviceId, label: optionData.label ? optionData.label : i, selected: (i === 0) } })
}

// FOR REFERENCE
// defaultConfig = {
//   camera_params: { videoSize: 1 },
//   detection_params: {
//     minMarkerDistance: 10,
//     minMarkerPerimeter: 0.2,
//     maxMarkerPerimeter: 0.8,
//     sizeAfterPerspectiveRemoval: 49,
//   },
//   feed_params: {
//     contrast: 0,
//     brightness: 0,
//     grayscale: 0,
//     flip: false,
//   },
// }

function ParamsMenu(sources) {
  const paramChange$ = sources.DOM.select('.param-input').events('change')
    .map((e) => [e.target.id, e.target.classList.contains('isCheck') ? e.target.checked : e.target.value]); //stupid edge case for checkboxes, might want to merge instead

  const camera$ = xs.fromPromise(navigator.mediaDevices.enumerateDevices())
    .map((feeds) => feeds.filter((f) => f.kind === "videoinput"));
  
  const vdom$ = xs.combine(camera$, sources.config).map(([cameras, config]) =>
    div('#parameters-menu', { style: parameterMenuStyle }, [
      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Camera Feed ID'),
        select('#CAMERA_INDEX.param-input', { style: parameterItemFieldStyle }, cameras.map(makeCameraOption)),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Video Size'),
        select('#camera_params-videoSize.param-input', { style: parameterItemFieldStyle }, [
          option({ attrs: { value: 0, label: '320 x 240', selected: (config.camera_params.videoSize === 0) } }),
          option({ attrs: { value: 1, label: '640 x 480', selected: (config.camera_params.videoSize === 1) } }),
          option({ attrs: { value: 2, label: '1280 x 720', selected: (config.camera_params.videoSize === 2) } }),
          option({ attrs: { value: 3, label: '1920 x 1080', selected: (config.camera_params.videoSize === 3) } }),
        ]),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Min Marker Distance'),
        input('#detection_params-minMarkerDistance.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MIN_MARKER_DISTANCE', min: 1, max: 50, value: config.detection_params.minMarkerDistance, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Min Marker Perimeter'),
        input('#detection_params-minMarkerPerimeter.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MIN_MARKER_PERIMETER', min: 0.01, max: 0.99, value: config.detection_params.minMarkerPerimeter, step: 0.01 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Max Marker Perimeter'),
        input('#detection_params-maxMarkerPerimeter.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MAX_MARKER_PERIMETER', min: 0.01, max: 0.99, value: config.detection_params.maxMarkerPerimeter, step: 0.01 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Size After Perspective Removal'),
        input('#detection_params-sizeAfterPerspectiveRemoval.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'SIZE_AFTER_PERSPECTIVE_REMOVAL', min: 1, max: 200, value: config.detection_params.sizeAfterPerspectiveRemoval, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Contrast'),
        input('#feed_params-contrast.param-input', { 
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'IMAGE_CONTRAST', min: -100, max: 100, value: config.feed_params.contrast, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Brightness'),
        input('#feed_params-brightness.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'IMAGE_BRIGHTNESS', min: -100, max: 100, value: config.feed_params.brightness, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Grayscale'),
        input('#feed_params-grayscale.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'IMAGE_GRAYSCALE', min: 0, max: 100, value: config.feed_params.grayscale, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Flip Camera'),
        input('#feed_params-flip.param-input.isCheck', {
          style: parameterItemFieldStyle,
          attrs: { type: 'checkbox', name: 'IMAGE_FLIP', checked: config.feed_params.flip }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Torch Active'),
        input('#camera_params-torch.param-input.isCheck', {
          style: parameterItemFieldStyle,
          attrs: { type: 'checkbox', name: 'TORCH', checked: config.camera_params.torch }
        }),
      ]),
    ]));
  
  // THIS IS A HACK TO MAKE PARAMS WORK FOR SOME REASON
  // vdom$.subscribe({ next: () => console.log(), });

  const camID$ = paramChange$.filter((p) => p[0] === 'CAMERA_INDEX').map((p) => p[1]).startWith(0);
  const configUpdate$ = paramChange$.filter((p) => p[0] !== 'CAMERA_INDEX')
    .map(([field, value]) => {
      // THIS REQUIRES ALL OTHER FIELDS TO FIT THE FORMAT HERE
      return (s) => {
        const [cat, name] = field.split('-');
        s[cat][name] = typeof value !== "boolean" ? parseFloat(value) : value;
        return s;
      }
    });

  return {
    vdom$,
    configUpdate$,
    camID$,
  };
}

export default ParamsMenu;
