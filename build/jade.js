"use strict";

var fs = require('fs');
var program = require('commander');
var jade = require('jade');

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
