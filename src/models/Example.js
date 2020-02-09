const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
	example: { type: String, searchable: true },
});

/*

exampleSchema.plugin(searchable);

exampleSchema.static('example', function (obj) {
	return new this({
		example: obj.example,
	});
});

 */

const Example = mongoose.model('Example', exampleSchema);

module.expors = Example;
