document.addEventListener('DOMContentLoaded', function(){
			// console.log('win frames',window.frames)
			// console.log('win parent frames', window.parent.frames)
	
		// if (!window.API) {
		// 	window.top.opener.API = window.API = getAPI_12(window.top, 6)
		// }

		window.top.opener.API = window.API = window.opener.top.frames[0].API
		window.API.LMSInitialize('')
	
	 console.warn('API:', API)
})
	
function getAPI_12(handler, parent_depth) {
	// Это окно
	if (handler.API != null) {
		return handler.API;
	}

	// Фреймы
	var frames = handler.frames;
	if ((frames != null) && (frames != undefined)) 	{
		if ((frames.length != undefined) && (frames.length != null) && (!isNaN(frames.length)))	{
			for (var i = 0; i < frames.length; i++)	{
				if (frames[i].API != null) return frames[i].API;
			}
		}
	}

	// Родительское окно
	if (parent_depth == 0) return null;
	if (handler.parent && (handler.parent != handler)) return getAPI_12(handler.parent, parent_depth - 1);

	// Опенер окна
	if ((handler.opener != null) && (handler.opener != handler)) return getAPI_12(handler.opener, parent_depth - 1);
	
	return null;
}