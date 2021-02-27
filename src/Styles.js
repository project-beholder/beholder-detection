export const toggleStyle = {
  main: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // width: '50px',
    // height: '50px',
    // background: '#000',
    // zIndex: 9999,
    // color: 'white',
    // fontSize: '20px',
    // fontWeight: 700,
    // borderRadius: '0 0 50px 0',
    // boxSizing: 'border-box',
    // cursor: 'pointer',
    // transition: 'all 100ms ease-in',
    // padding: '0 0 0 0',
  },

  active: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // width: '50px',
    // height: '50px',
    // background: '#000',
    // zIndex: 9999,
    // color: 'white',
    // fontSize: '20px',
    // fontWeight: 700,
    // borderRadius: '0 0 50px 0',
    // boxSizing: 'border-box',
    // cursor: 'pointer',
    // transition: 'all 100ms ease-in',
    // padding: '6px 0 0 0',
  },
};

export const noOverlayStyle = {
  // display: 'none',
};

export const overlayStyle = {
  // position: 'absolute',
  // top: 0,
  // left: 0,
  // zIndex: 100,
};

export const detectionPanelStyle = {
  main: {
    position: 'absolute',
    top: 0,
    left: '-150vw',
    transition: 'all 500ms ease-in-out',
    zIndex: 999,
  },

  active: {
    position: 'absolute',
    top: 0,
    left: 0,
    transition: 'all 500ms ease-in-out',
    zIndex: 999,
  }
};

export const detectionCanvasStyle = {
  // position: 'relative',
  // float: 'left',
  // clear: 'both',
  // borderRadius: '0 0 0.5em 0',
  // borderBottom: '4px solid #FFF',
};

export const detectionCanvasOverlayStyle = {
  // position: 'absolute',
  // top: 0,
  // left: 0,
  // borderRadius: '0 0 0.5em 0',
};

export const parameterMenuStyle = {
  // position: 'relative',
  // float: 'left',
  // clear: 'both',
  // margin: '1em 0 1em 0em',
  // padding: '1em 1.5em 1em 1.5em',
  // background: 'black',
  // borderRadius: '0 0.5em 0.5em 0',
  // borderBottom: '4px solid #FFF',
  // width: '23em',
};

export const parameterItemStyle = {
  // position: 'relative',
  // float: 'left',
  // clear: 'both',
  // margin: '0.25em 0 0.25em 0',
  // width: '100%',
};

export const parameterItemLabelStyle = {
  // position: 'relative',
  // float: 'left',
  // // width: '18em',
  // fontWeight: 600,
  // color: 'white',
};

export const parameterItemFieldStyle = {
  // position: 'relative',
  // float: 'right',
};

export const stringStyles = `#beholder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}

#detection-panel {
  position: absolute;
  top: 0;
  left: -110vw;
  transition: all 500ms ease-in-out;
  z-index: 999;
}

#detection-panel.active {
  top: 0;
  left: 0;
}

#detection-panel #detection-canvas {
  position: relative;
  float: left;
  clear: both;
  border-radius: 0 0 0.5em 0;
  border-bottom: 4px solid #FFF;
}

#detection-panel #detection-canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0 0 0.5em 0;
}

#detection-panel #parameters-menu {
  position: relative;
  float: left;
  clear: both;
  margin: 1em 0 1em 0em;
  padding: 1em 1.5em 1em 1.5em;
  background: black;
  border-radius: 0 0.5em 0.5em 0;
  border-bottom: 4px solid #FFF;
}

#detection-panel #parameters-menu .parameter-item {
  position: relative;
  float: left;
  clear: both;
  margin: 0.25em 0 0.25em 0;
}

#detection-panel #parameters-menu .parameter-item span {
  position: relative;
  float: left;
  width: 18em;
  font-weight: 600;
  color: white;
}

#toggle-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 50px;
  background: #000;
  z-index: 9999;
  color: white;
  font-size: 20px;
  font-weight: 700;
  padding: 6px;
  border-radius: 0 0 50px 0;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 100ms ease-in;
}

#toggle-screen:hover, #toggle-screen:active {
  padding: 6px 0 0 0;
}`
