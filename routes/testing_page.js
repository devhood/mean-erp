var express = require('express');
var router = express.Router();

var mongoq = require('mongoq');


aggregate = function(content, cb){
			.aggregate([ { $match: { "delivery_method" : "Walk In" } },
                     { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
                     { $sort: { total: -1 } }
                   ])
			.done(function(result){
	            cb(null,result);
	        })
      .fail( function( err ) {
      	console.log(err);
          cb(err);
	        });
		}

//sales

	var content = {
		"_id":"$a._id",
		"team_name":{$first:"$a.team_name"},
		"assist":{$sum:"$a.score.assist"},

	};



	db.aggregate();



// MongoClient.connect("mongodb://localhost:27017/beautylane-erp", function(err, db) {
//   // Create a collection
//   db.createCollection('test', function(err, collection) {
//     // Insert the docs
//     collection.insert(docs, {safe:true}, function(err, result) {
//       // Execute aggregate, notice the pipeline is expressed as an Array
//       collection.aggregate([
//           { $project : {
//             author : 1,
//             tags : 1
//           }},
//           { $unwind : "$tags" },
//           { $group : {
//             _id : {tags : "$tags"},
//             authors : { $addToSet : "$author" }
//           }}
//         ], function(err, result) {
//           console.dir(result);
//           db.close();
//       });
//     });
//   });
// });






// // [{'$match': {
// //       'time': {
// //           '$gte': datetime(2000,10,1),
// //           '$lt':  datetime(2000,11,1) } } },
// // {'$project': {
// //         'path': 1,
// //         'date': {
// //             'y': { '$year': '$time' },
// //             'm': { '$month': '$time' },
// //             'd': { '$dayOfMonth': '$time' } } } },
// // {'$group': {
// //         '_id': {
// //             'p':'$path',
// //             'y': '$date.y',
// //             'm': '$date.m',
// //             'd': '$date.d' },
// //         'hits': { '$sum': 1 } } }]
