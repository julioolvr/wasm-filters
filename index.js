import React from "react";
import ReactDOM from "react-dom";

import loadWasm from "./rust-filter/src/lib.rs";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      wasm: null
    };
  }

  componentDidMount() {
    loadWasm().then(result =>
      this.setState({ loading: false, wasm: result.instance.exports })
    );
  }

  render() {
    return (
      <div>{this.state.loading ? "Loading..." : this.state.wasm.add(1, 2)}</div>
    );
  }
}

const mountNode = document.getElementsByTagName("body")[0];
ReactDOM.render(<App />, mountNode);
