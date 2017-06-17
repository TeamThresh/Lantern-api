//트리 변환 메서드

module.exports = function (arrayList, rootId) {
	var rootNodes = [];
	var traverse = function (nodes, item, index) {
		if (nodes instanceof Array) {
			return nodes.some(function (node) {
				if (node.id === item.parentId) {
					console.log(node.id);
					node.children = node.children || [];
					return node.children.push(arrayList.splice(index, 1)[0]);
				}

				return traverse(node.children, item, index);
			});
		}
	};

	while (arrayList.length > 0) {
		arrayList.some(function (item, index) {
			if (item.id === rootId) {
				return rootNodes.push(arrayList.splice(index, 1)[0]);
			}

			return traverse(rootNodes, item, index);
		});
	}

	return rootNodes;
};

module.exports.expendTreeModel = (arrayList, rootId) => {
	var rootNode = {};
	var search = (item, array) => {
		return array.some((compItem, index) => {
			/*if (item.childId.includes(''+item.id)
			&& item.parentId == compItem.id) {
				console.log("myid : "+item.id+" / "+compItem.id);
				console.log("childId : "+item.childId+" / "+compItem.childId);
				console.log("parentId : "+item.parentId+" / "+compItem.parentId);
				// 재귀 호출 일경우 자신을 재외 한 배열에 검사
				array.splice(index, 1);
				return search(compItem, JSON.parse(JSON.stringify(array)));
			}*/

			if (item.id.includes(compItem.parentId) // 비교 대상 parent가 자신일때
			&& (item.id.includes(0) || arrayCompare(item.childId, compItem.id))) { // root 또는 자식 Id 가 비교대상 id일때
				// 마지막 일경우 (down level == current level)
				if (arrayCompare(item.id, compItem.id)) 
					return false;

				// 내가 item.id 의 자식이다
				// 아닐경우 자식 배열에 삽입
				item.children = item.children || [];
				if (!item.children.some((row, cindex) => {
					if (row.stackName == compItem.stackName) {	// 자식중에서 나랑 같은 stackName이 있다
						item.children[cindex].count += compItem.count;
						item.children[cindex].id = arrayConcat(row.id, compItem.id);
						item.children[cindex].childId = arrayConcat(row.childId, compItem.childId);
						
						compItem = item.children[cindex];
						return true;
					}
					return false;
				})) {
					item.children.push(compItem);
				}
				if (array.length != 0) {
					array.splice(index, 1);
					//console.log(arrayList.length);
					return search(compItem, array);
				} else 
					return true;
			}
			return false;
		});
	}

	arrayList.some((item, index) => {
		if (item.id.includes(rootId)) {
			rootNode = item;
			arrayList.splice(index, 1);
			return search(rootNode, arrayList);
		}
		return false;
	});

	return rootNode;
}


function arrayCompare(array1, array2) {
	return array1.some((row, index) => {
		return array2.some((compRow, compIndex) => {
			return row == compRow; 
		});
	});
}

function arrayConcat(array1, array2) {
	//if (array1 == undefined) array1 = [];
	array2.forEach((row) => {
		if (!array1.includes(row)) {
			array1.push(row);
		}
	})

	return array1
}

module.exports.count = (array) => {
	let sum = 0;
	array.forEach((row) => {
		sum += row.count;
	});
	return sum;
}

module.exports.sort = (unsortArray, parentPer) => {
	unsortArray.sort(function(a, b) { 
		// 내림차순
		return b.count - a.count;
	});


	let sum = 0;
	unsortArray.forEach((row) => {
		sum += row.count;
	});

	unsortArray.forEach((row, index) => {

		if (parentPer) {
			var per = parentPer * (row.count / sum);
		} else {
			var per = row.count / sum;
		}
		row.count = Math.floor(per * 100);

		if (row.children) {
			//console.log()
			row.children = require('./treeModel').sort(row.children, per);
		}
	})
	
	return unsortArray;
}