//트리 변환 메서드

module.exports = function (arrayList, rootId) {
	var rootNodes = [];
	console.log(arrayList.length);
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

	var search = (item) => {
		arrayList.forEach((compItem) => {
			if (item.id == compItem.parentId) {
				item.children = item.children || [];
				return item.children.push(compItem);
			}
		})

		if (item.children) {
			item.children.forEach((children) => {
				search(children);
			});
		}
	}

	arrayList.forEach((item) => {
		if (item.id == rootId) {
			rootNode = item;
			search(rootNode);
		}
	});

	return rootNode;
}

/*
		let compareItem = arrayList.slice(0, 1);
		arrayList.forEach((item, index) => {
			if (item.parentId == compareItem.id) {
				if (compareItem.children instanceof undefined) compareItem.children = [];
				compareItem.children.push(item);
			}
		});
		rootNodes.push(compareItem);*/