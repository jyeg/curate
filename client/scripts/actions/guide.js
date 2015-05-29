'use strict';

var Dispatcher = require('../dispatchers/default');
var sectionConstants = require('../constants/sections');
var assign = require('object-assign');
var messagesActions = require('./messages');
var routeActions = require('./routes');
var request = require('superagent');
var serialize = require('form-serialize');
var cookie = require('cookie');

module.exports = {

  addSection: function(){
    console.log('in guide actions addSection');
    Dispatcher.handleViewAction({
      actionType: sectionConstants.CREATE_NEW_SECTION
    });
  },
  addLink: function(index){
    console.log('in guide actions addLink');
    Dispatcher.handleViewAction({
      actionType: sectionConstants.CREATE_NEW_LINK,
      index: index
    });
  },
	saveGuide: function(index){
		Dispatcher.handleViewAction({
			actionType: sectionConstants.SAVE_GUIDE,
			index: index
		});
	},

	setGuides: function(guides) {
		Dispatcher.handleViewAction({
			actionType: sectionConstants.SET_GUIDES,
			guides: guides
		});
	},
	//saveGuide: function(index){
	//	console.log('in guide actions save guide');
	//	Dispatcher.handleViewAction({
	//		actionType: sectionConstants.SAVE_GUIDE,
	//		index: index
	//	});
	//},

	getToken: function() {
		var cookies = cookie.parse(document.cookie);

		return cookies.token;
	},

	parseForm: function(data){
		//title=s&description=asdf&link=asdf&title=dd&description=dd
		var obj = {};
		var arr = [];
		var a = data.split('title').forEach(function(val, idx){
			//["=s&description=asdf&link=asdf&", "=dd&description=dd"]
			var sectionArr = [];
			if(val !== ''){
				var temp = "title"+val.replace(/=/g,':');
				if(idx === 1) temp = temp.substr(0,temp.length-1);
				var sec = temp.split('&').map(function(portion, index){
					var a = portion.split(':');
					sectionArr.push(a);
				});
				var fml = {};

				sectionArr.forEach(function(section){
					fml[section[0]] = section[1]
				});
				arr.push(fml);
				obj = {};
			}
		});
		obj['sections'] = arr;
		return obj;
	},

	postForm: function(form, callback) {
		var self = this;
		var postData = this.parseForm(serialize(form));
		//"[{"section1":"title:test,description:asdf,link:dffd,link:asdf"},{"section2":"title:asdf,description:asdf,link:fffdf"}]"
		var postUrl = form.getAttribute('action') || window.location.pathname;
		var token = self.getToken();
		var options = callback.options || {};

		request
			.post(postUrl)
			.type('form')
			.set({
				'authorization': 'Bearer ' + token,
				'X-Requested-With': 'XMLHttpRequest'
			})
			.send(postData)
			.end(function(res) {
				console.log('guide post response', res);
				if (res.ok) {
					var userData;

					if (callback && callback.success) {
						callback.success(res);
					}
					if (options.successUrl) {
						routeActions.setRoute(options.successUrl);
					}
				}
				else {
					if (callback && callback.error) {
						callback.error(res);
					}
					if (options.errorUrl) {
						routeActions.setRoute(options.errorUrl);
					}
				}

				// Show global messages
				messagesActions.setMessages(res.body);
				if (callback && callback.complete) {
					callback.complete(res);
				}
			});
	},

	createGuide: function(form, callback) {
		debugger;
		console.log('in guide save', form);
		var cb = callback || function() {};
		cb.options = {
			successUrl: '/',
			errorUrl: '/createguide'

		};
		this.postForm(form, cb);
	},

	getGuides: function(idx, callback) {
		var id = idx || null;
		var cb = callback || function() {};
		cb.options = {
			successUrl: '/',
			errorUrl: '/'
		};
		this.getReq(id, cb);
	},

	getReq: function(idx, callback){
		var self = this;
		var token = self.getToken();
		var options = callback.options || {};

		request
			.get('/guide')
			.set({
				'authorization': 'Bearer ' + token,
				'X-Requested-With': 'XMLHttpRequest'
			})
			//.send(idx)
			.end(function(res) {
				console.log('guide get response', res);
				if (res.ok) {
					var guideData;


					guideData = res.body.guide;
					self.setGuides(guideData);

					if (callback && callback.success) {
						callback.success(res);
					}
					if (options.successUrl) {
						routeActions.setRoute(options.successUrl);
					}
				}
				else {
					if (callback && callback.error) {
						callback.error(res);
					}
					if (options.errorUrl) {
						routeActions.setRoute(options.errorUrl);
					}
				}

				// Show global messages
				messagesActions.setMessages(res.body);
				if (callback && callback.complete) {
					callback.complete(res);
				}
			});
	}


};
