"use strict";

var fs = require('fs-extra');
var async = require('async');
var path = require('path');
var rs = require('robotskirt');
var hljs = require('highlight.js');
var semver = require('semver');

var docsdir = __dirname + "/../docs";

async.auto({

	readdir: function(callback){
		fs.readdir(docsdir, function(err, files){
			if (err) return callback(err);
			async.filter(files, function(file, cb){
				fs.stat(docsdir + '/' + file, function(err, stat){
					cb(!err && stat.isDirectory());
				});
			}, function(files){
				callback(null, files);
			});
		});
	},

	doc: ['readdir', function(callback, res){
		async.map(res.readdir, function(file, cb){
			file = docsdir + '/' + file + '/doc/prime.md';
			fs.readFile(file, "utf-8", cb);
		}, callback);
	}],

	compile: ['readdir', 'doc', function(callback, res){
		var files = res.readdir;
		async.each(files, function(file, cb){
			var md = res.doc[files.indexOf(file)];
			var html = compile(md);
			var version = file.slice(6);
			async.parallel([
				async.apply(fs.writeFile, docsdir + '/' + 'toc-' + version + '.html', html.toc),
				async.apply(fs.writeFile, docsdir + '/' + 'content-' + version + '.html', html.content)
			], cb);
		}, callback);
	}],

	readDocsJade: function(callback){
		fs.readFile(__dirname + "/../pages/tpl/docs.jade", "utf-8", callback);
	},

	versions: ['readdir', function(cb, res){
		cb(null, res.readdir.map(function(file){
			return file.slice(6);
		}));
	}],

	makeJades: ['versions', 'readDocsJade', function(callback, res){
		var jade = res.readDocsJade;
		async.each(res.versions, function(version, cb){
			var tpl = jade.replace(/\{version\}/g, version);
			fs.writeFile(__dirname + '/../pages/docs-' + version + '.jade', tpl, cb);
		}, callback);
	}],

	copyLatest: ['makeJades', function(callback, res){
		var latest = res.versions.sort(semver.rcompare)[0];
		var pre = __dirname + '/../pages/docs';
		fs.copy(pre + '-' + latest + '.jade', pre + '.jade', callback);
	}]

}, function(err){
	if (err) console.error(err);
	console.log("done building pages/docs*.jade files");
});


function compile(md){

	var renderer = new rs.HtmlRenderer();

	renderer.blockcode = function(code, lang){
		if (!lang) return '<pre><code>' + code + '</code></pre>\n';
		if (lang == 'js') lang = 'javascript';
		else if (lang == 'html') lang = 'xml';
		else if (lang == 'shell') lang = 'bash';
		code = hljs.highlight(lang, code).value.trim();
		return '<pre><code class="' + lang + '">' + code + '</code></pre>\n';
	};

	var sidebar = '';
	renderer.header = function(text, level){
		if (level <= 2){
			sidebar += '<a href="#' + text + '"' + (level == 1 ? ' class="top"' : '') + '>' + text + '</a>\n';
			text = '<a href="#' + text + '" name="' + text + '">' + text + '</a>';
		}
		return '<h' + level + '>' + text + '</h' + level + '>\n';
	};

	var parser = new rs.Markdown(renderer, [rs.EXT_FENCED_CODE]);

	var html = parser.render(md);

	return {content: html, toc: sidebar};
}
