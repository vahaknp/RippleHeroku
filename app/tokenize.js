var fs = require('fs');
var esprima = require('esprima');

//Checks whether a token is in an array
checkUnique = function(token, array){
	is_unique = true;
	for (index in array){
		if (array[index] == token){
			is_unique = false;
			break
		}
	}
	return is_unique
}

//Finds a key with possible value in given object
getObjects = function(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//Finds all function names in file
findFunctions = function(path) {
	unique_functions = []
	data = fs.readFileSync(path, 'utf8');
	tree = esprima.parse(data);
	//First type: name = function(){}
	expressions = getObjects(tree, 'type', 'AssignmentExpression');
	for (var index in expressions){
		entry = expressions[index];
		if (entry.right !== undefined){
			if(entry.right.type == 'FunctionExpression'){
				left_side = entry.left
				left_obj = getObjects(left_side, 'name', '');
				for (var index in left_obj){
					name = left_obj[index].name
					if (checkUnique(name, unique_functions)){
						unique_functions.push(name);
					}
				}
			}
		}
	}
	//Second type: function name(){}
	expressions = getObjects(tree, 'type', 'FunctionDeclaration')
	for (var index in expressions){
		entry = expressions[index];
		unique_functions.push(entry.id.name);
	}
	//console.log(unique_functions);
	return(unique_functions);
};

module.exports.findFunctions = findFunctions;