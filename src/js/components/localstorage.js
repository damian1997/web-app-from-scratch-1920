export function clearStorage() {
    window.localStorage.clear()
}

export function readStorage(storageItemKey) {
    return JSON.parse(window.localStorage.getItem(storageItemKey))
}

export function addLocalstorageEntry(item,storagelocation) {
	localStorage.setItem(storagelocation, JSON.stringify(item))
}


