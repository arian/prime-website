"use strict";

var fs = require('fs');
var program = require('commander');
var jade = require('jade');
var hljs = require('highlight.js');

var options = {};

program
	.usage('[options]')
	.option('-o, --obj <file>', 'json file with options')
	.option('-p, --path <path>', 'filename used to resolve includes');

program.parse(process.argv);

// --obj

if (program.obj){
	options = JSON.parse(fs.readFileSync(program.obj));
}

// --path

if (program.path) options.filename = program.path;

jade.filters.highlight = function(code, options){
	var lang = options.lang;
	var indent = parseInt(options.indent, 10) || 4;

	var tab = new Array(indent + 1).join(' ');

	// fix indentation, code comes in with only one space
	code = code.split('\n').map(function(line){
		var indentations = line.match(/^\s+/g);
		if (!indentations) return line;
		var length = indentations[0].length;
		return new Array(length + 1).join(tab) + line.slice(length);
	}).join('\n');

	if (!lang) code = '<pre><code>' + code + '</code></pre>\n';
	else {
		if (lang == 'js') lang = 'javascript';
		else if (lang == 'html') lang = 'xml';
		else if (lang == 'shell') lang = 'bash';
		code = hljs.highlight(lang, code).value.trim();
		code = '<pre><code class="' + lang + '">' + code + '</code></pre>\n';
	}
	return code.replace(/\n/g, '\\n').replace(/'/g,'&#39;');
};

/**
 * Compile from stdin, write to stdout
 */
var buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk){ buf += chunk; });
process.stdin.on('end', function(){
	var fn = jade.compile(buf, options);
	var output = fn(options.locals);
	process.stdout.write(output);
}).resume();
