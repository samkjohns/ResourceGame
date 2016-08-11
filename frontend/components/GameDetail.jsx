var React = require('react'),
    DetailStore = require('../stores/DetailStore'),
    SettlementDetail = require('./SettlementDetail');

var GameDetail = module.exports = React.createClass({
  getInitialState: function () {
    return { focus: null };
  },

  componentDidMount: function () {
    DetailStore.addListener(this.onStoreChange);
  },

  onStoreChange: function () {
    this.listener = this.setState({ focus: DetailStore.detailFocus() });
  },

  componentWillUnmount: function () {
    this.listener.remove();
  },

  render: function () {
    var contents = <div/>;
    if (this.state.focus) {
      let hex = this.state.focus.hex;

      if (hex.settlement) {
        contents = <SettlementDetail settlement={hex.settlement}/>;

      } // check for other objects or creatures
    }

    return(
      <div className="game-detail">
        {contents}
      </div>
    );
  }
});
