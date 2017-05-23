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
			if (item.childId == item.id
			&& item.parentId == compItem.id) {
				// 재귀 호출 일경우 자신을 재외 한 배열에 검사
				array.slice(index, 1);
				return search(compItem, JSON.parse(JSON.stringify(array)));
			}

			if ((item.id == 0 
				&& item.id == compItem.parentId)
			|| (item.childId == compItem.id
				&& item.id == compItem.parentId)) {
				// 마지막 일경우 (down level == current level)
				if (item.id == compItem.id) 
					return false;
				// 아닐경우 자식 배열에 삽입
				item.children = item.children || [];
				item.children.push(compItem);
				if (array.length != 0) {
					array.splice(index, 1);
					return search(compItem, JSON.parse(JSON.stringify(array)));
				} else 
					return true;
			}
			return false;
		});
	}

	arrayList.some((item, index) => {
		if (item.id == rootId) {
			rootNode = item;
			arrayList.splice(index, 1);
			return search(rootNode, arrayList);
		}
		return false;
	});

	return rootNode;
}
