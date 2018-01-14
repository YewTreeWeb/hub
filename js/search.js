(function () {
	function displaySearchResults(results, store) {
		var searchResults = document.getElementById('search-results');

		if (results.length) {
			// Are there any results?
			var appendString = '';

			for (var i = 0; i < results.length; i++) {
				// Iterate over the results
				var item = store[results[i].ref];
				if (item.image) {
					var img = item.image;
				} else {
					var img = item.hero;
				}
				appendString += '<li class="post-container col-xs-12 col-sm-4"><div class="post-inner"><h3><a href="' + item.url + '">' + item.title + '</a></h3>';
				if (item.date || item.time) {
					appendString += '<span class="date"><i class="fa fa-calendar"></i>' + item.date + '</span>';
					appendString += '<span class="time"><i class="fa fa-clock-o"></i>' + item.time + '</span>';
				}
				appendString += '<p>' + item.content.substring(0, 150) + '...</p>';
				appendString += '<a href="' + item.url + '"><button class="btn btn-danger btn-lg" type="button" role="button">Read More</button></a></div></li>';
			}

			searchResults.innerHTML = appendString;
		} else {
			searchResults.innerHTML = '<li>No results found</li>';
		}
	}

	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');

		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');

			if (pair[0] === variable) {
				return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
			}
		}
	}

	var searchTerm = getQueryVariable('query');

	if (searchTerm) {
		document.getElementById('search-box').setAttribute("value", searchTerm);

		// Initalize lunr with the fields it will be searching on. I've given title
		// a boost of 10 to indicate matches on this field are more important.
		var idx = lunr(function () {
			this.field('id');
			this.field('title', { boost: 10 });
			this.field('author');
			this.field('date');
			this.field('time');
			this.field('content');
		});

		for (var key in window.store) {
			// Add the data to lunr
			idx.add({
				'id': key,
				'title': window.store[key].title,
				'author': window.store[key].author,
				'date': window.store[key].date,
				'time': window.store[key].time,
				'content': window.store[key].content
			});

			var results = idx.search(searchTerm); // Get lunr to perform a search
			displaySearchResults(results, window.store); // We'll write this in the next section
		}
	}
})();
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
//# sourceMappingURL=maps/search.js.map
