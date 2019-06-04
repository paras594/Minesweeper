import React from "react";

import Cell from "./Cell";

class Row extends React.Component {
   render() {
      let cells = this.props.cellData.map((cell, i) => {
         return <Cell key={i} data={cell} reveal={this.props.reveal} />;
      });
      return <div className="row">{cells}</div>;
   }
}

export default Row;
