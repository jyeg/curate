'use strict';

var React = require('react');
var DefaultLayout = require('../layouts/default.jsx');
var guideActions = require('../../actions/guide');
var guideStore = require('../../stores/guide');
var GuideSection = require('./readguidesection')

var VoteComponent = React.createClass({
  getInitialState: function () {
    var guideId = this.props.id;
    return {
      votes: this.props.votes
    }
  },
  componentDidMount: function() {
    guideStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    guideStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      votes: guideStore.getVotes(this.props.linkIndex, this.props.sectionIndex)
    })
  },

  render: function() {
    return (
      /* jshint ignore:start */
     <div className = "vote-container">
      <li name="upvote" onClick = {this.handleVote}>upvote</li>
      <li name="downvote" onClick = {this.handleVote}>downvote</li>
     </div>
      /* jshint ignore:end */
    );
  },

  handleVote: function(e) {
    e.preventDefault();
    var linkIndex = this.props.linkIndex;
    var sectionIndex = this.props.sectionIndex;
    var votetype = e.target.name;

    inputActions.vote(votetype, linkIndex, sectionIndex)
  }

});

module.exports = VoteComponent;
