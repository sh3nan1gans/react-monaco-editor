import React from "react";
import ReactDOM from "react-dom";
import { copyStyles } from "./utils";

class ExternalWindowPortal extends React.Component {
  state = {
    el: null,
    win: null
  };

  render() {
    const { el } = this.state;
    if (!el) {
      return null;
    }
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, el);
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    const win = window.open(
      "",
      "myWindowName",
      "width=600,height=400,left=200,top=200"
    );

    const insertEl = document.createElement("noscript");
    win.document.head.appendChild(insertEl);

    copyStyles(document, win.document);
    const el = document.createElement("div");
    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    win.document.body.appendChild(el);

    if (this.props.listenForUnload) {
      win.onbeforeunload = () => {
        if (this.props.listenForUnload) {
          this.props.listenForUnload();
        }
      };
    }
    this.setState({
      win,
      el
    });
  }

  componentWillUnmount() {
    // STEP 5: This will fire when this.state.showExternalWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    this.state.win.close();
  }
}

export default ExternalWindowPortal;
