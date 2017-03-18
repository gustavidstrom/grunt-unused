/*
 * grunt-unused
 * https://github.com/gustavidstrom/grunt-unused
 *
 */

"use strict";

module.exports = function(grunt) {

	grunt.registerMultiTask("unused", "Grunt plugin that searches a list of files for unused variables from a file.", function() {

		var options = this.options();

		if (!validateOptions(options)) {
			return;
		}

		var searchStrings = [];
	    var cleanSearchStrings = [];
		if (options.findParamsIn) {
			grunt.log.writeln("Searching through file for search params");

			var sbfSrc = grunt.file.read(options.findParamsIn);
			var sbfLines = sbfSrc.split("\n");

			for (var l = 0; l < sbfLines.length; l++) {
				var match = sbfLines[l].match(options.regex)
				if (match) {
					if (options.omitInResults !== null) {
						searchStrings.push(match[0].replace(options.omitInResults, ""));
					} else {
						searchStrings.push(match[0]);
					}
				}
			}
			if (searchStrings.length === 0) {
				grunt.log.writeln("No strings matched " + options.regex + " in " + options.findParamsIn);
				return;
			}
			grunt.log.writeln("Search complete: Example to search for: " + searchStrings[0] + " (1/" + searchStrings.length + " params)");

		    searchStrings.forEach(function (item) {
	        	cleanSearchStrings.push({ regexp: new RegExp(item, "g"), original: item });
		    });
		} else {
			grunt.log.writeln("Searching through files for occurences of: " + options.regex);
        	cleanSearchStrings.push({ regexp: options.regex, original: options.regex });
		}

		this.files.forEach(function(f) {

			var filePaths = [];
			f.src.filter(function(filepath) {
				if (grunt.file.isDir(filepath)) {
					return;
				}

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
				} else {
					filePaths.push(filepath);
				}
			});

			grunt.log.writeln();
			var matches = [];
			for (var i=0; i<filePaths.length; i++) {
				var file = filePaths[i];
				var src = grunt.file.read(file);

				var lines = src.split("\n");

				grunt.log.writeln("Looking through: " + file);

				for (var j=1; j<=lines.length; j++) {
		          for (var k=0; k<cleanSearchStrings.length; k++) {
		            var currSearchString = cleanSearchStrings[k];
		            var lineMatches = lines[j-1].match(currSearchString.regexp);

		            if (lineMatches) {
		              if (matches.indexOf(currSearchString.original) === -1) {
		              	matches.push(currSearchString.original);
		              }
		            }

		          }
				}
			}


			if (cleanSearchStrings.length === matches.length) {
				grunt.log.writeln();
				grunt.log.writeln("Could not find any unused");
			} else {
				grunt.log.writeln();
				for (var m = 0; m < cleanSearchStrings.length; m++) {
					var currSearchString = cleanSearchStrings[m];
					if (matches.indexOf(currSearchString.original) === -1) {
						grunt.log.writeln(currSearchString.original);
					}
				}
				grunt.log.writeln();
				grunt.log.writeln("Unused amount: " + (cleanSearchStrings.length - matches.length));
			}
		});
	});

	var validateOptions = function(options) {
		var optionErrors = [];
		if (!options.regex) {
			optionErrors.push("Missing options.regex value.");
		}
		if (optionErrors.length) {
			for (var i=0; i<optionErrors.length; i++) {
				grunt.log.error("Error: ", optionErrors[i]);
			}
		}
		return optionErrors.length === 0;
	};
};
