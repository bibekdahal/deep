// extension.js
// extension specific codes

var extension = {
    inputs: {},
    currentTabUrl: null,
    currentPage: null,
    tabId: null,
    ajaxSubmitOptions: {
        url: null,
        beforeSubmit: function(data, form, options){
            extension.showLoader();
            $('#publish-date')[0].type = 'date';
            options["url"] = deep.serverAddress + '/' + deep.currentEvent + '/leads/add/';
        },
        success: function(response) {
            if (toString.call(response) === '[object Object]') {
                chrome.tabs.create({ url: deep.serverAddress + response.url });
            }
            extension.showSuccessMsg('<i class="fa fa-check"></i>Successful', 'The lead has been added successfully');
        },
        error: function(response){
            extension.showErrorMsg('<i class="fa fa-times"></i>Oh nose! Something is not right', 'Failed to add the lead');
        }
    },

    init: function(){
        extension.getCurrentTabUrl(function(){
            extension.loadUrl();
            extension.loadWebsite();
            extension.loadTitle();
            deep.queryCurrentPage();
            extension.restoreInputValues();
        });
        $('input').on('change textInput input', function(){
            extension.storeInputValue($(this));
        });
        $('select').change(function(){
            extension.storeInputValue($(this));
        })
    },
    loadTitle: function(){
        if (extension.currentTabUrl && extension.currentPage) {
            var loc = document.createElement('a');
            loc.href = extension.currentTabUrl;
            var doc = (new DOMParser).parseFromString(extension.currentPage, 'text/html');
            article = new Readability(loc, doc).parse();
            if (article != null){
                $('#title').val(article.title).addClass('filled');
            }
        }
    },
    // fills the url input from current tab url
    loadUrl: function(){
        $('#url').val(extension.currentTabUrl).addClass('filled');
    },
    // fills the website input by trimming the current tab url
    loadWebsite: function(){
        //find & remove protocol (http, ftp, etc.) and get domain
        let domain = (extension.currentTabUrl.indexOf("://") > -1)? extension.currentTabUrl.split('/')[2]: domain = url.split('/')[0];

        //find & remove port number
        domain = domain.split(':')[0];

        if(domain){
            $('#website').val(domain).addClass('filled');
        }
    },
    getCurrentTabUrl: function(callback) {
        var queryInfo = { active: true, currentWindow: true };
        chrome.tabs.query(queryInfo, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
            extension.tabId = tab.id;
            extension.currentTabUrl = tab.url;
            callback();
        });
    },

    storeInputValue: function(ip){
        chrome.runtime.sendMessage({'msg': 'set', 'tab_id': extension.tabId, 'key': ip[0].id, 'val': ip.val() });
    },
    restoreInputValue: function(ip){
        chrome.runtime.sendMessage({'msg': 'get', 'tab_id': extension.tabId, 'key': ip[0].id}, function(response){
            if(response && response.val){
                if(ip.is('input')){
                    ip.val(response.val).addClass('filled');
                } else if(ip.is('select')){
                    ip.val(response.val);
                    refreshSelectInputs();
                }
            }
        });
    },
    restoreInputValues: function(){
        $('input').each(function(){
            extension.restoreInputValue($(this));
        });
        extension.restoreInputValue($('#confidentiality'));
    },
    showAddLeadForm: function(){
        $('body > *').hide();
        $('#add-lead-form').slideDown();
    },
    showLoader: function(){
        $('body > *').hide();
        $('#loader').fadeIn();
    },
    showErrorMsg: function(title, description){
        $('body > *').hide();
        $('#status-text')[0].className = 'error';
        $('#status-text h2').html(title);
        $('#status-text p').html(description);
        $('#status-text').slideDown();
    },
    showSuccessMsg: function(title, description){
        $('body > *').hide();
        $('#status-text')[0].className = 'success';
        $('#status-text h2').html(title);
        $('#status-text p').html(description);
        $('#status-text').slideDown();
    }
};