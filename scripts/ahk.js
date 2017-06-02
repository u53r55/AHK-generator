var GET = {}
var LOADED = false;

function init() {

    load_get()

    if (GET.length > 0) {
        parse_get()
        $.getScript("keygen.js", loaded)
            // build form from GET
            // console.log(GET)
            //console.log(CONFIG)
        num_keys = GET['length'];
        //console.log(num_keys)
        for (i = 0; i < num_keys; i++) {
            // pass
            newRow();
            $('#func' + i + CONFIG[i]['func']).prop("checked", true)
                //console.log(CONFIG[i]['func'])

            if (CONFIG[i]['func'] == 'KEY') {
                setHotKey(i);

                //console.log(CONFIG[i]['skeyValue'])
                $('#skey' + i + 'key').val(CONFIG[i]['skeyValue'])
                modifiers = CONFIG[i]['modifiers[]']
                    //console.log(modifiers)
                modifiers.forEach(function(entry) {
                    //console.log('#skey' + i + entry)
                    $('#skey' + i + entry).prop("checked", true)
                })
            } else {
                setHotString(i);
                $('#skey' + i + 'string').val(CONFIG[i]['skeyValue'])
            }

            select(CONFIG[i]['option'], i)

            //console.log(CONFIG[i]['option'], i)
            if (CONFIG[i]['option'] == 'Send' || CONFIG[i]['option'] == 'Replace') {
                $('#input' + i).val(CONFIG[i]['input'])
            } else if (CONFIG[i]['option'] == 'ActivateOrOpen') {
                //console.log('activate mode')
                //console.log(CONFIG[i]['Program'])
                //console.log(CONFIG[i]['Window'])

                $('#window' + i).val(CONFIG[i]['Window'])
                $('#program' + i).val(CONFIG[i]['Program'])
            }
        }
    } else {
        //console.log("New row")
        newRow()
    }
}

function load_get() { // https:///stackoverflow.com/a/12049737
    if (document.location.toString().indexOf('?') !== -1) {
        var query = document.location
            .toString()
            // get the query string
            .replace(/^.*?\?/, '')
            // and remove any existing hash string (thanks, @vrijdenker)
            .replace(/#.*$/, '')
            .split('&');

        for (var i = 0, l = query.length; i < l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            if (aux[0] in GET) {
                if (GET[aux[0]].constructor === Array) {
                    GET[aux[0]].push(aux[1])
                } else {
                    GET[aux[0]] = [GET[aux[0]], aux[1]]
                }
            } else {
                GET[aux[0]] = aux[1];
            }
        }
    }
}

var CONFIG = {};

function parse_get() {
    //CONFIG['length'] = GET['length']
    for (i = 0, k = 0; i < GET['length']; k++) {
        if ('func' + k in GET) {
            CONFIG[i] = {
                'func': GET['func' + k],
                'option': GET['option' + k],
                'skeyValue': GET['skeyValue' + k]
            }

            if (CONFIG[i]['func'] == 'KEY') {
                // hotkey
                CONFIG[i]['modifiers[]'] = GET['skey' + k + '[]']
            } else {
                // hotsring - nothing more in this case
            }

            if (GET['option' + k] == 'Send') {
                CONFIG[i]['option'] = 'Send'
                CONFIG[i]['input'] = GET['input' + k]
            } else if (GET['option' + k] == "ActivateOrOpen") {
                CONFIG[i]['option'] = "ActivateOrOpen"
                CONFIG[i]['Program'] = GET['Program' + k]
                CONFIG[i]['Window'] = GET['Window' + k]
            } else if (GET['option' + k] == "Replace") {
                CONFIG[i]['option'] = 'Replace'
                CONFIG[i]['input'] = GET['input' + k]
            }

            i++
        }
    }
}

function ready() {
    //newRow();
    $('#hotkeyRegion').submit(function() {
        result = true;
        for (var i = 0; i < count; i++) {
            if ($('#option' + i).length == 0 && $('#function' + i).length > 0) {
                //it doesn't exist
                result = false;
                alert("Must select a function for all rows");
                break;
            }
        }
        return result; // return false to cancel form action
    });
}

function handleClick(ev) {
    //console.log('clicked on ' + this.tagName);
    ev.stopPropagation();
}

//from http://stackoverflow/a/20729945
String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
        return str;
    }
}

index = 0;
count = 0;

function dropdown(id) {
    //console.log('#key' + id);
    if ($('#key' + id).hasClass("w3-show")) {
        //console.log("Hide it");
        $(".w3-dropdown-content").removeClass("w3-show");
        $(".w3-dropdown-content").removeClass("ontop");
        $(".fa-caret-right").removeClass("fa-rotate-90");
    } else {
        //console.log("show it");
        $(".w3-dropdown-content").removeClass("w3-show"); //hide all - make sure none of the others are open
        $(".fa-caret-right").removeClass("fa-rotate-90");
        $('#arrow' + id).addClass('fa-rotate-90');
        $('#key' + id).addClass('w3-show').addClass('ontop');
    }
}

function select(item, id) {
    $('.w3-dropdown-content').removeClass('w3-show');
    $(".fa-caret-right").removeClass("fa-rotate-90");

    if (item == 'ActivateOrOpen') {
        $('#function' + id).html('ActivateOrOpen(\
					<input type="text" name="Window{0}" id="window{0}" placeholder="Window" style="width:10em" required/>,\
					<input id="program{0}" type="text" name="Program{0}" placeholder="Program" style="width:10em" required/>)\
					<input type="hidden" value="ActivateOrOpen" name="option{0}" id="option{0}"/>'.format(id))

        $("#program" + id).click(function(event) {
            event.stopPropagation();
        });
        $("#window" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Send') {
        $('#function' + id).html('Send(<input name="input{0}"  id="input{0}" type="text" placeholder="input" required/>)\
					<input type="hidden" value="Send" name="option{0}" id="option{0}"/>'.format(id))

        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Replace') {
        $('#function' + id).html('Replace(<input type="text" name="input{0}" id="input{0}" placeholder="input" required/>)\
					<input type="hidden" value="Replace" name="option{0}" id="option{0}"/>'.format(id))
        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    }
}

function remove(id) {
    $('#shortcut' + id).remove() //delete row from table
    count -= 1;
    $('#inputLength').val(count);
}

function setHotKey(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s3">												 \
												<label><input type="checkbox" id="skey{0}CTRL" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" id="skey{0}ALT" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" id="skey{0}SHIFT" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" id="skey{0}key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>'.format(id))
}

function setHotString(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s6">										 \
												<input type="text" id="skey{0}string" placeholder="string" name="skeyValue{0}" required/> \
											</div>'.format(id))
}

function newRow() {
    newDiv = '<div class="w3-row" id="shortcut{0}">													 \
						<div class="w3-col m6 s12">																 \
								<div class="w3-row">															 \
									<div class="w3-col m4">														 \
										<label><input type="radio" id="func{0}KEY" name="func{0}" value="KEY" onclick="setHotKey({0});" checked/> Hotkey</label>	 \
										<label><input type="radio" id="func{0}STRING" name="func{0}" value="STRING" onclick="setHotString({0});"> Hotstring</input></label>	 \
										|																		\
									</div>																		 \
									<div class="w3-col m8 w3-right">											 \
										<div id="optionsShortcut{0}" class="w3-row">					         \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>																 \
										</div>																	 \
									</div>																		 \
								</div>																			 \
							</div>		                                                                         \
						<div class="w3-col m6 s12">																 \
							<div class="w3-row-padding">														 \
								<div style="cursor:default" class="w3-col s10 w3-dropdown-click">				 \
									<div class="w3-btn w3-centered" onclick="dropdown(\'{0}\')"><span id="function{0}" >(Select a function)</span><i id="arrow{0}" class="fa fa-caret-right" aria-hidden="true"></i></div>						 \
									<div id="key{0}" class="w3-dropdown-content w3-border ontop">				 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'ActivateOrOpen\', \'{0}\')">ActivateOrOpen("Window","Program")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Send\', \'{0}\')">Send("input")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Replace\', \'{0}\')">Replace("input")</button>\
										</div>																	 \
								</div>																			 \																			 \
								<div class="w3-col s2">															 \
									<button type="button" onclick="remove(\'{0}\')" class="w3-btn w3-margin" id="dropdown{0}"><i class="fa fa-times-circle-o" title="Delete \hotkey"></i></button>\
								</div>																			 \
							</div>  																			 \
						</div>																					 \
					</div>																						 \
					'.format(index);
    index += 1;
    count += 1;
    $('#inputLength').val(count);

    $('#hotkeyRegion').append(newDiv)
}

function loaded() {
    //console.log("seeting url")
    $('#downloadLink').attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(keygen(CONFIG)))
    setTimeout(download, 500)
}

function download() {
    document.getElementById('downloadLink').click()
}