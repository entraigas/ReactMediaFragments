import { isFunction } from 'lodash'
import React, { Component } from 'react';
import ReactDOM from "react-dom";

export default class MyVideo extends Component {

  componentDidMount() {
    const self = this;
    let video = ReactDOM.findDOMNode(this);
    let i = setInterval(function() {
      if(video.readyState > 0) {
        if(isFunction(self.props.onload)){
          self.props.onload({duration: video.duration, ref: video});
        }
      	clearInterval(i);
      }
    }, 200);
    /*
    video.addEventListener("loadedmetadata", (event)=>{
      console.log("loadedmetadata",event);
    });
    */
    video.addEventListener("playing", (event)=>{
      if(isFunction(self.props.onVideoPlay)){
        self.props.onVideoPlay(event);
      }
    });
    video.addEventListener("ended", (event)=>{
      if(isFunction(self.props.onVideoEnd)){
        self.props.onVideoEnd(event);
      }
    });
    video.addEventListener("pause", (event)=>{
      if(isFunction(self.props.onVideoPause)){
        self.props.onVideoPause(event);
      }
    });
  }

  render(){
    // default values
    const {
      autoplay = "autoplay",
      controls = true,
      loop = false,
      muted = true,  // needed for google chrome
      preload = "auto",
      src = null,
      style = {},
      height = "180px",
      width = "320px",
    } = this.props;
    return (
        <video
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          preload={preload}
          width={width}
          height={height}
          loop={loop}
          style={style}
        >
          <source src={src} />
        </video>
    )
  }

}
