/**
 * Automatize the grid reporting
 *
 * <Grid grid={grid} display={display} onPageChange={onPageChange} />
 *
 * reference
 *  items: [array of objects],
 *  display = {
 *    id: '#',
 *    description: {header: 'Descripción', render: callback(row){ return ...}}
 *  }
 */
import { isArray, isFunction, isString, isObject, has, size } from 'lodash'
import React, { Component } from 'react'
// material
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from '@material-ui/core/'

class Grid extends Component {
  constructor(props){
    super(props);
    const {items = [], labelNoData='No items!'} = props;
    this.labelNoData = labelNoData;
    this.state = {items}
  }

  /*
   * Change default configuration & initialize grid settings
   */
  componentWillReceiveProps(nextProps){
    let { items=[] } = nextProps;
    if (isArray(items)){
      this.setState(items);
    }
  }

  renderBlank(mensaje) {
    const colspan = size(this.props.display);
    return (
      <TableRow key={1}>
        <TableCell colSpan={colspan}><p>{mensaje}</p></TableCell>
      </TableRow>
    )
  }

  renderTableBody() {
    const context = this;
    const rows = this.state.items;
    if(rows.length === 0){
      return this.renderBlank(this.labelNoData);
    }
    // row loop
    return rows.map( (row, index) => {
      let arrData = [], c=0;
      // columns loop
      for(let key in this.props.display){
        try{
          let display = this.props.display[key];
          if( isString(display)){
            arrData.push(<TableCell key={c++}>{row[key]}</TableCell>)
          }
          if(isObject(display) && has(display,'render') && isFunction(display['render'])){
            arrData.push(<TableCell key={c++}>{display.render(row, index, context)}</TableCell>)
          }
        }catch(error){
          arrData.push(<TableCell key={c++}>error</TableCell>)
          console.log(`<Grid> Error on field ${key}.`, error.toString(), row);
        }
      }
      // done with this single row...
      return (<TableRow key={index} style={{ height: '16px', fontSize: '12px' }}>{arrData}</TableRow>)
    })
  }

  renderTableHeaders(display){
    let arrHeaders = [];
    for(let i in display){
      if( isString(display[i])){
        arrHeaders.push(<TableCell key={i}>{display[i]}</TableCell>)
      } else if( isObject(display[i]) && has(display[i], 'header')) {
        arrHeaders.push(<TableCell key={i}>{display[i]['header']}</TableCell>)
      }
    }
    return(<TableRow>{arrHeaders}</TableRow>);
  }

  render() {
    let { display } = this.props;
    const headers = this.renderTableHeaders(display);
    const rows = this.renderTableBody();
    // done, render all
    return (
      <Table>
        <TableHead>{headers}</TableHead>
        <TableBody style={{paddingLeft: 500}}>{rows}</TableBody>
      </Table>
    )
  }

}

export default Grid
