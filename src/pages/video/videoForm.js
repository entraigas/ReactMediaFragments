import { size } from 'lodash';
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Card, CardContent, CardHeader, TextField, Button } from '@material-ui/core'
// custom
import { actionChangeVideoProps, actionResetFormValues } from './config/actions';
import MyVideo from './components/MyVideo';

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

class form extends Component {
  constructor(props){
    super(props);
    this.state = {
      form:{},
      error:{}
    };
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount(){
    const {formMode, formId} = this.props.video;
    if(formMode==='ADD'){
      this.form = {name:'', start:'', end:''};
      this.setState({
        form: this.form,
        error:{name:false, start:false, end:false}
      });
      return;
    }
    if(formMode==='EDIT'){
      this.form = this.props.video.items[formId];
      this.setState({
        form: this.form,
        error:{name:false, start:false, end:false}
      })
      return;
    }
    return this.gotoIndex();
  }

  gotoIndex(){
    this.props.actionResetFormValues();
    this.props.history.push('/');
  }

  validateName(){
    let {name=''} = this.form;
    if(name === ''){
      return "Must complete the name field";
    }
    return false;
  }
  validateStart(){
    const duration = parseInt(this.props.video.duration, 10);
    let {start='', end=''} = this.form;
    if(start === ''){
      return "Must complete the start field";
    }
    start = parseInt(start, 10);
    end = parseInt(end, 10);
    if(start<0 || start>=duration){
      return `Invalid start time (must be between 0 - ${duration})`;
    }
    if(end>0 && start>end){
      return `Invalid start time (must be less than ${end})`;
    }
    return false;
  }
  validateEnd(){
    const duration = parseInt(this.props.video.duration, 10);
    let {start='', end=''} = this.form;
    if(end === ''){
      return "Must complete the end field";
    }
    start = parseInt(start, 10);
    end = parseInt(end, 10);
    if(end<=0 || end>duration){
      return `Invalid end time (must be between 1 - ${duration})`;
    }
    return false;
  }
  hasError(){
    let error = {};
    error.name = this.validateName();
    error.start = this.validateStart();
    error.end = this.validateEnd();
    this.setState({error});
    if(!error.name && !error.start && !error.end){
      return false;
    }
    return true;
  }

  onSave(event){
    const error = this.hasError();
    if(error){
      return
    }
    const {formMode, formId} = this.props.video;
    const {name, start, end} = this.state.form;
    let items = this.props.video.items;
    // is an insert?
    if(formMode==='ADD'){
      items.push({name, start, end});
      this.props.actionChangeVideoProps({items});
      this.gotoIndex();
      return;
    }
    // is an update?
    if(formMode==='EDIT'){
      const values = items[formId];
      items[formId] = Object.assign({}, values, {name, start, end});
      this.props.actionChangeVideoProps({items});
      this.gotoIndex();
      return;
    }
    this.gotoIndex();
  }

  handleChange = name => event => {
    this.form = Object.assign({}, this.form, {[name]: event.target.value});
    this.setState({form:this.form});
  };

  renderErrorMsg(){
    const {error} = this.state;
    let msg = [];
    for(let key in error){
      if(error[key]!==false){
        msg.push(error[key]);
      }
    }
    return (
      <div style={{color:'red', paddingTop:'15px'}}>{msg.join('. ')}</div>
    )
  }

  renderTextField(field, label){
    return(
      <TextField
        value={this.state.form[field] || ''}
        onChange={this.handleChange(field)}
        error={this.state.error[field]!==false}
        label={label}
        placeholder={label}
        fullWidth
        required
      />
    )
  }

  renderNumberField(field, label){
    return(
      <TextField
        value={this.state.form[field] || ''}
        onChange={this.handleChange(field)}
        error={this.state.error[field]!==false}
        label={label}
        placeholder={label}
        type="number"
        fullWidth
        required
      />
    )
  }

  renderForm(){
    const fieldName = this.renderTextField("name", "Clip name");
    const fieldStart = this.renderNumberField("start", "Start time");
    const fieldEnd = this.renderNumberField("end", "End time");
    const onSave = this.onSave.bind(this);
    const gotoIndex = this.gotoIndex.bind(this);
    return(
      <div style={{width:"300px", paddingLeft:"35px"}}>
        {fieldName}
        {fieldStart}
        {fieldEnd}
        {this.renderErrorMsg()}
        <div style={{display: "flex", justifyContent: "flex-end", marginTop:"10px"}}>
          <Button variant="outlined" onClick={gotoIndex}>Cancel</Button>
          <Button variant="outlined" color="primary" onClick={onSave}>Save</Button>
        </div>
      </div>
    )
  }

  render(){
    return (
      <div style={styles.container}>
      <Card style={styles.section}>
        <CardHeader title={this.props.title} />
        <CardContent style={{ display: "flex", alignItems: "center"}}>
          <div style={{width:"350px"}}>
            <MyVideo src={this.props.video.src} />
          </div>
          {this.renderForm()}
        </CardContent>
      </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(form);
