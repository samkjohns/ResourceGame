var React = require('react'),
    types = require('../constants/types.js'),
    helpers = require('../util/helpers.js');

var SettlementDetail = module.exports = React.createClass({
  getInitialState: function () {
    return {
      main: 'garrison'
    };
  },

  renderDemographics: function () {
    var settlement = this.props.settlement;
    var demographics = settlement.demographics;

    var key = 0;

    var rows = [
      <tr key={key++}>
        <td>Population</td>
        <td>{settlement.totalPopulation()}</td>
      </tr>
    ];

    var elRows = types.creatures.map(
      function (etype) {
        let pcnt = Math.floor(settlement.percentOf(etype) * 100);
        return(
          <tr key={key++}>
            <td>{`${etype}:`}</td>
            <td>{`${pcnt}%`}</td>
          </tr>
        );
      }
    );
    helpers.pushAll(rows, elRows);

    var physicalRows = types.physical.map(
      function (ptype) {
        let pcnt = Math.floor(settlement.percentOf(ptype) * 100);
        return(
          <tr key={key++}>
            <td>{`${ptype}:`}</td>
            <td>{`${pcnt}%`}</td>
          </tr>
        );
      }
    );

    helpers.pushAll(rows, physicalRows);

    return(
      <table className="demographics-pane">
        <tbody>{rows}</tbody>
      </table>
    );
  },

  renderResources: function () {
    var settlement = this.props.settlement;
    var resources = settlement.resources;
    var resourceNames = Object.keys(resources);

    return(
      <table className="resources-pane">
        <tbody>
          {resourceNames.map(function (resource, idx) {
            // console.log(resource);
            return(
              <tr key={idx}>
                <td>{resource}</td>
                <td>{resources[resource]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },

  renderGrowth: function () {
    var settlement = this.props.settlement;
    // console.log(settlement);
    var growth = settlement.growth;
    var rate = settlement.growthRate();
    var thresh = settlement.nextGrowthThreshhold();

    return(
      <table className="growth-pane">
        <tbody>
          <tr>
            <td>Growth rate</td>
            <td>{rate}</td>
          </tr>
          <tr>
            <td>Current</td>
            <td>{growth}</td>
          </tr>
          <tr>
            <td>Needed</td>
            <td>{thresh}</td>
          </tr>
        </tbody>
      </table>
    );
  },

  renderButtons: function () {
    var buildings = <div/>,
        recruits = <div/>,
        garrison = <div/>;

    if (this.state.main !== 'buildings') {
      buildings = <button>Buildings</button>;

    } if (this.state.main !== 'recruits') {
      recruits = <button>Recruits</button>;

    } if (this.state.main !== 'garrison') {
      garrison = <button>Garrison</button>;
    }

    return(
      <div className="settlement-buttons">
        {buildings}
        {recruits}
        {garrison}
      </div>
    );
  },

  renderMain: function () {
    if (this.state.main === 'buildings') {
      return <div>buildings go here</div>;

    } else if (this.state.main === 'recruits') {
      return <div>recruits go here</div>;

    } else {
      return <div>garrison goes here</div>;
    }
  },

  render: function () {
    var demographics = this.renderDemographics();
    var resources = this.renderResources();
    var growth = this.renderGrowth();
    var buttons = this.renderButtons();
    var main = this.renderMain();

    return(
      <div className="settlement-detail-pane group">
        <h2>Settlement name</h2>

        <nav className="settlement-nav fl group">
          {demographics}
          {resources}
          {growth}
          {buttons}
        </nav>

        <section className="settlement-main-pane fl group">
          {main}
        </section>
      </div>
    );
  }
});
