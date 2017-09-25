(function ($) {
	//请求数据
	var GETCLASSES = "http://imoocnote.calfnote.com/inter/getClasses.php" ;
	var GETCLASSCHAPTER = "http://imoocnote.calfnote.com/inter/getClassChapter.php";
	var GETCLASSNOTE ="http://imoocnote.calfnote.com/inter/getClassNote.php";
	//接口调用失败
	$.ajaxSetup({
		error: function () {
			alert('调用接口失败！');
			return false;
		}
	});
	//渲染模板引擎
	function renderTemplate(templateSelector, data, htmlSelector) {
		var t = $(templateSelector).html();
		var f = Handlebars.compile(t);
		var h = f(data);
		$(htmlSelector).html(h);
	};
	//显示隐藏笔记本
	$('.overlap').on('click', function () {
		showNote(false);
	});
	function showNote(show) {
		if (show) {
			$(".overlap").css('display', 'block');
			$(".notedetail").css('display', 'block');
		} else {
			$(".overlap").css('display', 'none');
			$('.notedetail').css('display', 'none');
		}
	};
	function refreshClasses(curPage) {
		$.getJSON(GETCLASSES,  {curPage: curPage}, function (data) {
		renderTemplate("#card-template", data.data, "#classes");
		renderTemplate("#pag-template", formatPag(data), "#pag");
		$('li.clickable').on('click', function () {
			$this = $(this);
			console.log($this.data('id'));
			refreshClasses($this.data('id'));
			});
		});
	};
	//事件驱动函数　bindClassesEvent
	function bindClassesEvent() {
		$('#classes').delegate('li', 'click', function () {
			$this = $(this);
			var cid = $this.data('id');
			$.getJSON(GETCLASSCHAPTER,  {cid: cid}, function (data) {
				console.log(data);
				renderTemplate("#chapter-template", data, "#chapterdiv");
				//调用显示
				showNote(true);
			});
			$.getJSON(GETCLASSNOTE,  {cid: cid}, function (data) {
				console.log(data);
			});
		})
	};
	//调用
	bindClassesEvent();

	function binPageEvent() {
		$("#pag").delegate('li.clickable', 'click', function () {
			$this = $(this);
			// console.log($this.data('id'));
			refreshClasses($this.data('id'));
		});

	};
	binPageEvent();

	$.getJSON(GETCLASSES,  {curPage: 1}, function (data) {
		console.log(data);
		renderTemplate("#card-template", data.data, "#classes");
		renderTemplate("#pag-template", formatPag(data), "#pag");
	});

	Handlebars.registerHelper("equal" , function (v1, v2, options) {
		if (v1 == v2) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper("long", function (v, options) {
		if (v.indexOf('小时') != -1) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper("addone", function (value) {
		return value + 1;
	});

	function formatPag(pagData) {
		var arr = [];
		var total = parseInt(pagData.totalCount);
		var cur = parseInt(pagData.curPage);

		//处理首页的逻辑
		var toLeft = {};
		toLeft.index = 1;
		toLeft.text = '&laquo;';
		if (cur != 1) {
			toLeft.clickable = true;
		}
		arr.push(toLeft);
		//处理上一页逻辑
		var pre = {};
		pre.index = cur - 1;
		pre.text = '&lsaquo;';
		if (cur != 1) {
			pre.clickable = true;
		}
		arr.push(pre);
		//处理cur页面的逻辑
		if (cur <= 5) {
			for (var i = 1; i < cur; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		} else {
			var pag = {};
			pag.text = 1;
			pag.index = 1;
			pag.clickable = true;
			arr.push(pag);
			var pag = {};
			pag.text = '...';
			arr.push(pag);
			for (var i = cur-2; i < cur; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		}
		//处理cur　页面逻辑
		var pag = {};
		pag.text = cur;
		pag.index = cur;
		pag.cur = true;
		arr.push(pag);
		//处理cur页后的逻辑
		if (cur >= total-4 ) {
			for (var i = cur+1; i <= total; i++) {
				var pag = {};
				pag.text = i;
				pag.index = i;
				pag.clickable = true;
				arr.push(pag);
			}
		} else {
			//如果cur<total-4,那么cur后面的页面要显示
		for (var i = cur+1; i <= cur+2; i++) {
			var pag = {};
			pag.text = i;
			pag.index = i;
			pag.clickable = true;
			arr.push(pag);
			}
		}
		var pag = {};
		pag.text = '...';
		arr.push(pag);
		var pag = {};
		pag.text = total;
		pag.index = total;
		pag.clickable = true;
		arr.push(pag);
		//处理下一页逻辑
		var next = {};
		next.index = cur + 1;
		next.text = '&rsaquo;';
		if (cur != total ) {
			next.clickable = true;
		}
		arr.push(next);
		//处理到最后一页的逻辑
		var toRight = {};
		toRight.index = total;
		toRight.text = '&raquo;';
		if (cur != total ) {
			toRight.clickable = true;
		}
		arr.push(toRight);
		console.log(arr);
		return arr;
	};
})(jQuery)