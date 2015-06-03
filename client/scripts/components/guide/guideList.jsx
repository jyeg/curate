'use strict';

var React = require('react');
var DefaultLayout = require('../layouts/default.jsx');
var RaisedButton = require('material-ui/lib/raised-button');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');
var guideActions = require('../../actions/guide');
var guideStore = require('../../stores/guides');
var GuidePreview = require('./guidepreview.jsx');

var GuideListComponent = React.createClass({

	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},

	getChildContext: function() {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},

	componentWillMount: function() {
	  ThemeManager.setPalette({
	    accent1Color: Colors.deepOrange500
	  });
	},

  componentDidMount: function() {
    guideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    guideStore.removeChangeListener(this._onChange);
  },

	_onChange: function(){
		this.setState({
			guides: guideStore.get()
		});
	},

	getInitialState: function () {
		return {
			guides : guideActions.getGuides()
		};
	},


	render: function() {
		var self = this;
		if (this.state.guides) {
			var guideList = this.state.guides.sort(function (a, b) {
				return b.votes - a.votes;
			}).map(function (guide, idx) {
				guide.votes = guide.votes || 0;
				return ([
					/* jshint ignore:start */
					<GuidePreview key={idx} index={idx} guide={guide} votes={guide.votes}/>,
					<RaisedButton label="Material Button" primary={true}/>
					/* jshint ignore:end */
				]);
			});
		}

		return (
			/* jshint ignore:start */
			<table className="top-guides">
					{guideList}
			</table>
				/* jshint ignore:end */
		);
	},

});

module.exports = GuideListComponent;
