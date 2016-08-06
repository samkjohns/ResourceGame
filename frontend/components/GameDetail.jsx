var React = require('react'),
    DetailStore = require('../stores/DetailStore');

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
      // console.log(this.state.focus);
      var settlement = this.state.focus.hex.settlement;
      var sString = settlement ? settlement.toString() : 'None';
      contents = (
        <table>
          <tbody>
            <tr>
              <td>Coordinates:</td>
              <td>{this.state.focus.row}, {this.state.focus.col}</td>
            </tr>

            <tr>
              <td>Creature:</td>
              <td>{this.state.focus.creature || 'None'}</td>
            </tr>

            <tr>
              <td>Settlement:</td>
              <td>{sString}</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return(
      <div>
        <label>Game Detail</label>
        {contents}
      </div>
    );
  }
});
