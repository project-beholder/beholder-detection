import xs from 'xstream';
import { div, span, select, option, input } from '@cycle/dom';
import {
  parameterMenuStyle, parameterItemStyle, parameterItemLabelStyle, parameterItemFieldStyle
} from './Styles';

function makeCameraOption(optionData, i) {
  return option({ attrs: { value: optionData.deviceId, label: optionData.label ? optionData.label : i, selected: (i === 1) } })
}

function ParamsMenu(sources) {
  const paramChange$ = sources.DOM.select('.param-input').events('change').map((e) => [e.target.id, e.target.value]);
  
  const camera$ = xs.fromPromise(navigator.mediaDevices.enumerateDevices())
    .map((feeds) => feeds.filter((f) => f.kind === "videoinput"));
  

  const vdom$ = camera$.map((cameras) =>
    div('#parameters-menu', { style: parameterMenuStyle }, [
      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Camera Feed ID'),
        select('#CAMERA_INDEX.param-input', { style: parameterItemFieldStyle }, cameras.map(makeCameraOption)),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Video Size'),
        select('#VIDEO_SIZE_INDEX.param-input', { style: parameterItemFieldStyle }, [
          option({ attrs: { value: 0, label: '320 x 240', selected: false } }),
          option({ attrs: { value: 1, label: '640 x 480', selected: true } }),
          option({ attrs: { value: 2, label: '1280 x 720', selected: false } }),
          option({ attrs: { value: 3, label: '1920 x 1080', selected: false } }),
        ]),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Min Marker Distance'),
        input('#MIN_MARKER_DISTANCE.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MIN_MARKER_DISTANCE', min: 1, max: 50, value: 10, step: 1 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Min Marker Perimeter'),
        input('#MIN_MARKER_PERIMETER.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MIN_MARKER_PERIMETER', min: 0.01, max: 0.99, value: 0.2, step: 0.01 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Max Marker Perimeter'),
        input('#MAX_MARKER_PERIMETER.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'MAX_MARKER_PERIMETER', min: 0.01, max: 0.99, value: 0.8, step: 0.01 }
        }),
      ]),

      div('.parameter-item', { style: parameterItemStyle }, [
        span({ style: parameterItemLabelStyle }, 'Size After Perspective Removal'),
        input('#SIZE_AFTER_PERSPECTIVE_REMOVAL.param-input', {
          style: parameterItemFieldStyle,
          attrs: { type: 'number', name: 'SIZE_AFTER_PERSPECTIVE_REMOVAL', min: 1, max: 200, value: 49, step: 1 }
        }),
      ]),

      // div('.parameter-item', { style: parameterItemStyle }, [
      //   span({ style: parameterItemLabelStyle }, 'Contrast'),
      //   input('#IMAGE_CONTRAST', { 
      //     style: parameterItemFieldStyle,
      //     attrs: { type: 'number', name: 'IMAGE_CONTRAST', min: -100, max: 100, value: 0, step: 1 }
      //   }),
      // ]),

      // div('.parameter-item', { style: parameterItemStyle }, [
      //   span({ style: parameterItemLabelStyle }, 'Brightness'),
      //   input('#IMAGE_BRIGHTNESS', {
      //     style: parameterItemFieldStyle,
      //     attrs: { type: 'number', name: 'IMAGE_BRIGHTNESS', min: -100, max: 100, value: 0, step: 1 }
      //   }),
      // ]),

      // div('.parameter-item', { style: parameterItemStyle }, [
      //   span({ style: parameterItemLabelStyle }, 'Grayscale'),
      //   input('#IMAGE_GRAYSCALE', {
      //     style: parameterItemFieldStyle,
      //     attrs: { type: 'number', name: 'IMAGE_GRAYSCALE', min: 0, max: 100, value: 0, step: 1 }
      //   }),
      // ]),
    ]));
  
  return {
    vdom$,
    paramChange$,
  };
}

export default ParamsMenu;