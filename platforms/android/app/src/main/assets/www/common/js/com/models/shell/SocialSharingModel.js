define(["com/utils/Utils"], function(Utils) {
	var SocialSharingModel = Backbone.Model.extend({},{
		share:function(message , image, link){

			window.plugins.socialsharing.share(message, null, image, link);

		},
		shareViaTwitter:function(message , image, link, errorCallback){
			window.plugins.socialsharing.shareViaTwitter(message , image, link, null , errorCallback);
		},
		shareImageViaFacebook:function(image , errorCallback){
			window.plugins.socialsharing.shareViaFacebook('', image , null , null , errorCallback);			
		},		

		shareLinkViaFacebook:function(link , errorCallback){
			window.plugins.socialsharing.shareViaFacebook('', null, link , null, errorCallback);
		},

		shareViaWhatsApp:function(message, image, link, errorCallback){
			window.plugins.socialsharing.shareViawhatsApp(message, image, link, null, errorCallback);
		},

		canSharevia:function(appQualifiedName, successCallback, errorCallback)
		{
			window.plugins.socialsharing.canShareVia(appQualifiedName, 'msg', null, null, null, successCallback , errorCallback);
		},

		initWebShare: function(){

			var e = document.getElementsByTagName('div');
			for (var k = 0; k < e.length; k++) {
				if (e[k].className.indexOf('share42init') != -1) {
					var u,t,i,d,f,fn;
					if (e[k].getAttribute('data-url') != -1)
						u = e[k].getAttribute('data-url');
					if (e[k].getAttribute('data-title') != -1)
						t = e[k].getAttribute('data-title');
					if (e[k].getAttribute('data-image') != -1)
						i = e[k].getAttribute('data-image');
					if (e[k].getAttribute('data-description') != -1)
						d = e[k].getAttribute('data-description');
					if (e[k].getAttribute('data-path') != -1)
						f = e[k].getAttribute('data-path');
					if (e[k].getAttribute('data-icons-file') != -1)
						fn = e[k].getAttribute('data-icons-file');
					if (!f) {
						function path(name) {
							var sc = document.getElementsByTagName('script'), sr = new RegExp('^(.*/|)(' + name + ')([#?]|$)');
							for (var p = 0, scL = sc.length; p < scL; p++) {
								var m = String(sc[p].src).match(sr);
								if (m) {
									if (m[1].match(/^((https?|file)\:\/{2,}|\w:[\/\\])/))
										return m[1];
									if (m[1].indexOf("/") == 0)
										return m[1];
									b = document.getElementsByTagName('base');
									if (b[0] && b[0].href)
										return b[0].href + m[1];
									else
										return document.location.pathname.match(/(.*[\/\\])/)[0] + m[1];
								}
							}
							return null;
						}
						f = path('share42.js');
					}
					var realUrl, realText;
					if (!u)
						u = location.href;
					else
						realUrl = encodeURIComponent(u);
					if (!t)
						t = document.title;
					else
						realText = encodeURIComponent(t);
					if (!fn)
						fn = '../../../../common/images/shell/share_icons.png';
					function desc() {
						var meta = document.getElementsByTagName('meta');
						for (var m = 0; m < meta.length; m++) {
							if (meta[m].name.toLowerCase() == 'description') {
								return meta[m].content;
							}
						}
						return '';
					}
					if (!d)
						d = desc();
					if(u) 
						u = encodeURIComponent(u);
					if(t) {
						t = encodeURIComponent(t);
						t = t.replace(/\'/g, '%27');
					}
					i = encodeURIComponent(i);
					d = encodeURIComponent(d);
					d = d.replace(/\'/g, '%27');
					var fbQuery = 'u=' + u;
					if (i != 'null' && i != '')
						fbQuery = 's=100&p[url]=' + u + '&p[title]=' + t + '&p[summary]=' + d + '&p[images][0]=' + i;
					var s = new Array('"#" onclick="window.open(\'http://www.blogger.com/blog_this.pyra?t'+ (realUrl?('&u=' + realUrl):'') + (realText?('&n=' + realText):'') + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="BlogThis!"', '"https://www.evernote.com/clip.action?url=' + u + (realText?('&title=' + realText):'') + '" title="Share on Evernote"', '"#" data-count="fb" onclick="window.open(\'http://www.facebook.com/sharer.php?m2w&' + fbQuery + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Share on Facebook"', '"#" data-count="gplus" onclick="window.open(\'https://plus.google.com/share?url=' + u + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Share on Google+"', '"#" data-count="lnkd" onclick="window.open(\'http://www.linkedin.com/shareArticle?mini=true&url=' + u + (realText?('&title=' + realText):'') + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=600, height=400, toolbar=0, status=0\');return false" title="Share on Linkedin"', '"#" data-count="pin" onclick="window.open(\'http://pinterest.com/pin/create/button/?' + (realUrl?('url=' + realUrl + '&'):'') + (i?('media=' + i +'&'):'') + (realText?('&description=' + realText):'') + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=600, height=300, toolbar=0, status=0\');return false" title="Pin It"', '"http://www.stumbleupon.com/submit?url=' + u + '&title=' + t + '" title="Share on StumbleUpon"', '"#" data-count="twi" onclick="window.open(\'https://twitter.com/intent/tweet?text=' + (realText?realText :'') + (realUrl?('&url=' + realUrl):'') + '\', \'_blank\', \'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0\');return false" title="Share on Twitter"');
					var l = '';
					for (var j = 0; j < s.length; j++)
						l += '<a rel="nofollow" style="display:inline-block;vertical-align:bottom;width:32px;height:32px;margin:0 6px 6px 0;padding:0;outline:none;background:url(' + f + fn + ') -' + 32 * j + 'px 0 no-repeat" href=' + s[j] + ' target="_blank"></a>';
					e[k].innerHTML = '<span id="share42">' + l + '</span>';
				}
			}
		}

	});

	return SocialSharingModel;

});