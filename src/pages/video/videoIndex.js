import { delay } from "lodash";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionChangeVideoProps, actionResetFormValues } from './config/actions';
// custom
import { Paper, Button } from '@material-ui/core';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import MyVideo from './components/MyVideo';
import Grid from './components/Grid';


const styles = {
  container:{
    width:"100%",
    display:"flex",
    flexDirection: "column",
    justifyContent:"flex-end",
    alignItems: "center"
  },
  section:{
    width:"800px",
    marginTop:"35px"
  }
};

class index extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected: -1,
      playing: false,
      src: this.props.video.src,
    };
    this.firstTime = this.firstTime.bind(this);
    this.onStop = this.onStop.bind(this);
    this.playNext = this.playNext.bind(this);
    this.onPlay = this.onPlay.bind(this);
  }

  firstTime(params){
    let {items=[], duration} = this.props.video;
    if(duration === null){
      const firstItem = {
        name:"complete trailer",
        start: 0,
        end: parseInt(params.duration, 10)
      };
      items.push(firstItem);
      this.props.actionChangeVideoProps({duration: params.duration, items});
    }
    this.videoRef = params.ref;
  }

  isMediaFragment(){
    const {selected} = this.state;
    if(selected<=0){
      return false;
    }
    const {items, duration} = this.props.video;
    let item = items[selected];
    if(item.start > 0 || item.end < duration){
      return true;
    }
    return false;
  }
  /*
   * Events
   */

   onStop(event){
     const waitTime = 1000;
     const {selected} = this.state;
     let {type, srcElement} = event;
     const ts = Math.round(srcElement.currentTime);
     const total = this.props.video.items.length;
     // get selected item
     const item = this.props.video.items[selected];
     const end = parseInt(item.end, 10);
     if(type==="ended"){
       this.setState({playing:false});
       if(selected<total-1){
         delay(this.playNext, waitTime);
       }
     }
     if(this.isMediaFragment() && type==="pause" && ts === end){
       this.setState({playing:false});
       if(selected<total-1){
         delay(this.playNext, waitTime);
       }
     }
  }

  playNext(){
    const {selected} = this.state;
    const total = this.props.video.items.length;
    if(selected+1 < total){
      this.onPlay(selected+1);
    }
  }

  onPlay(index){
    let {playing, selected} = this.state;
    let src = this.props.video.src;
    if(index > 0){
      let item = this.props.video.items[index];
      src = `${src}#t=${item.start},${item.end}`;
    }
    // play/pause the same clip
    if(selected===index){
      playing = !playing;
      if(playing){
        if(selected>0){
          // nasty hack here
          this.videoRef.load();
        }
        this.videoRef.play();
      } else {
        this.videoRef.pause();
      }
      this.setState({playing, selected: index});
      return;
    }
    //play another clip
    if(playing){
      this.videoRef.pause();
    }
    this.setState({playing: true, src, selected: index}, ()=>{
      this.videoRef.load();
      this.videoRef.play();
    });
  }

  onAdd(){
    this.props.actionResetFormValues('ADD');
    this.props.history.push('/add');
  }

  onEdit(index){
    this.props.actionResetFormValues('EDIT', index);
    this.props.history.push('/edit');
  }

  onRemove(index){
    let items = this.props.video.items;
    items.splice(index, 1);
    this.props.actionChangeVideoProps({items});
  }

  renderVideo(){
    return (
      <Card style={styles.section}>
        <CardHeader title={this.props.video.title} />
        <CardContent style={{ display: "flex", alignItems: "center"}}>
        <div style={{width:"350px"}}>
          <MyVideo
            src={this.state.src}
            onload={this.firstTime}
            autoplay={this.state.playing}
            controls={false}
            onVideoEnd={this.onStop}
            onVideoPause={this.onStop}
          />
        </div>
        </CardContent>
      </Card>
    )
  }

  render(){
    const { items } = this.props.video;
    const onAdd = this.onAdd.bind(this);
    const onEdit = this.onEdit.bind(this);
    const onPlay = this.onPlay.bind(this);
    const onRemove = this.onRemove.bind(this);
    const {selected, playing} = this.state;
    const display = {
      name: "Name",
      start: "Start time",
      end: "End time",
      remove: {
        header: "",
        render: (item, index) => {
          let playIcon = <PlayIcon style={{cursor:"pointer"}} onClick={()=>onPlay(index)}/>;
          if(selected===index && playing){
            playIcon = <PauseIcon style={{cursor:"pointer"}} onClick={()=>onPlay(index)}/>;
          }
          if(index===0) return playIcon;
          return (
            <div>
              {playIcon}
              <EditIcon style={{cursor:"pointer"}} onClick={()=>onEdit(index)}/>
              <CloseIcon style={{cursor:"pointer"}} onClick={()=>onRemove(index)} />
            </div>
          )
        }
      }
    };
    return (
      <div style={styles.container}>
        {this.renderVideo()}
        <Paper style={styles.section}>
          <Button onClick={onAdd}>Add Clip</Button>
          <Grid items={items} display={display} />
        </Paper>
      </div>
    )
  }

}

function mapStateToProps(store) {
  return {
    video: store.video,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      actionChangeVideoProps,
      actionResetFormValues,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(index);
