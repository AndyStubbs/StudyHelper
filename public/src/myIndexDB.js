//[NO_BUILD]

"use strict";

//[/NO_BUILD]

/***************************************************************************************************
 *	myIndexDB.js
 *
 *	This file is responsible for storing data to the local database
 *
 ***************************************************************************************************/
(function () {
	const VERSION = 1;

	var m_dataName, m_objectStore, m_db, m_stashedRequests;

	m_dataName = "study_helper";
	m_objectStore = "topics";
	m_db = null;
	m_stashedRequests = [];

	// Define MyIndexDB API
	window.MyIndexDB = {};

	/**************************
	 * API Methods
	 ***************************/

	window.MyIndexDB.init = function init(dataName, objectStore) {
		var openRequest, i, req;

		m_dataName = dataName;
		m_objectStore = objectStore;
		openRequest = indexedDB.open(m_dataName, VERSION);

		openRequest.onupgradeneeded = function () {
			m_db = openRequest.result;
			if (!m_db.objectStoreNames.contains(m_objectStore)) {
				m_db.createObjectStore(m_objectStore, { keyPath: "key" });
			}
		};

		openRequest.onerror = function () {
			m_fosAPI.Log(openRequest.error);
		};

		openRequest.onsuccess = function () {
			m_db = openRequest.result;

			m_db.onversionchange = function () {
				m_db.close();
			};
			for (i = 0; i < m_stashedRequests.length; i++) {
				req = m_stashedRequests[i];
				req.cmd(req.resolve, req.reject, req.params);
			}
		};
	};

	window.MyIndexDB.setItem = function (key, value) {
		return runRequest(setItem, [key, value]);
	};

	window.MyIndexDB.getItem = function (key) {
		return runRequest(getItem, [key]);
	};

	window.MyIndexDB.getAll = function () {
		return runRequest(getAll, []);
	};

	window.MyIndexDB.removeItem = function (key) {
		return runRequest(removeItem, [key]);
	};

	window.MyIndexDB.clear = function () {
		return runRequest(clear, []);
	};

	window.MyIndexDB.search = function (query) {
		return runRequest(search, [query]);
	};

	/**************************
	 * Private Methods
	 ***************************/

	function search(resolve, reject, params) {
		const query = params[0];
		if (!(query instanceof RegExp)) {
			return reject("Query must be a regular expression");
		}
		const transaction = m_db.transaction(m_objectStore, "readonly");
		const items = transaction.objectStore(m_objectStore);
		const request = items.openCursor();
		const results = [];
		request.onsuccess = function (event) {
			const cursor = event.target.result;
			if (cursor) {
				if (query.test(cursor.value.key)) {
					results.push(cursor.value);
				}
				cursor.continue();
			} else {
				return resolve(results);
			}
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function setItem(resolve, reject, params) {
		var key, value, transaction, items, item, request;

		key = params[0];
		value = params[1];
		if (typeof key !== "string") {
			return reject("Invalid type for key.");
		}
		transaction = m_db.transaction(m_objectStore, "readwrite");
		items = transaction.objectStore(m_objectStore);
		item = {
			key: key,
			value: value,
		};
		request = items.put(item);
		request.onsuccess = function () {
			return resolve(true);
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function getItem(resolve, reject, params) {
		var key, transaction, items, request;

		key = params[0];
		if (typeof key !== "string") {
			return reject("Invalid type for key.");
		}
		transaction = m_db.transaction(m_objectStore, "readonly");
		items = transaction.objectStore(m_objectStore);
		request = items.get(key);
		request.onsuccess = function (event) {
			if (event.target.result) {
				return resolve(event.target.result.value);
			} else {
				return resolve(null);
			}
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function getAll(resolve, reject) {
		var transaction, items, request;

		transaction = m_db.transaction(m_objectStore, "readonly");
		items = transaction.objectStore(m_objectStore);
		request = items.getAll();
		request.onsuccess = function (event) {
			if (event.target.result) {
				return resolve(event.target.result);
			} else {
				return resolve(null);
			}
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function removeItem(resolve, reject, params) {
		var key, transaction, items, request;

		key = params[0];
		if (typeof key !== "string") {
			return reject("Invalid type for key.");
		}
		transaction = m_db.transaction(m_objectStore, "readwrite");
		items = transaction.objectStore(m_objectStore);
		request = items.delete(key);
		request.onsuccess = function () {
			return resolve(true);
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function clear(resolve, reject) {
		var transaction, items, request;

		transaction = m_db.transaction(m_objectStore, "readwrite");
		items = transaction.objectStore(m_objectStore);
		request = items.clear();
		request.onsuccess = function () {
			return resolve(true);
		};
		request.onerror = function () {
			return reject(request.error);
		};
	}

	function runRequest(cmd, params) {
		return new Promise(function (resolve, reject) {
			if (m_db === null) {
				m_stashedRequests.push({
					cmd: cmd,
					params: params,
					resolve: resolve,
					reject: reject,
				});
			} else {
				cmd(resolve, reject, params);
			}
		});
	}
})();
