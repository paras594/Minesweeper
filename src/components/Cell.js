import React from "react";

import bomb from "../images/bomb.svg";

class Cell extends React.Component {
   handleClick = () => {
      this.props.reveal(this.props.data);
   };
   render() {
      let { count, isOpen, hasMine } = this.props.data;
      return (
         <button
            className={isOpen ? "cell open" : "cell"}
            onClick={this.handleClick}
         >
            {hasMine && isOpen ? (
               <img src={bomb} alt="X"/>
            ) : count > 0 ? (
               count
            ) : (
               ""
            )}
         </button>
      );
   }
}

export default Cell;
