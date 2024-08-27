'use strict';

const parse = require('postcss-value-parser');
const round = require('lodash.round');

/**
 * @param  {String} str
 * @param  {Object} opts
 *
 * @return {String}
 */
module.exports = ( str, opts ) => {

	opts = Object.assign({
		precision: 5
	}, opts);

	const tree = parse(str);

	tree.walk(( node ) => {

		if ( node.type === 'function' ) {

			const values = node.nodes;
			const minMax = values.some(( item ) => {
				return /(?:min|max)-(?:width|height)/.test(item.value);
			});

			// If we are working with min/max-width/height query
			if ( minMax ) {
				values

					// Work only with pixel values
					.filter(( item ) => {
						const value = parse.unit(item.value);
						return item.type === 'word' && (value && value.unit === 'px');
					})

					// Convert to ems
					.map(( item ) => {
						const value = parse.unit(item.value);
						item.value = [round(Number(value.number) / 16, opts.precision), 'em'].join('');
						return item;
					});
			}

		}

	});

	return tree.toString();

};
