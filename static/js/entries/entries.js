var mapLoaded = false;
var dateRangeInputModal = null;

$(window).scroll(function() {
    if(Math.round($(window).scrollTop() + $(window).height()) >= $(document).height()-2) {
        if (scrollCallback) {
            scrollCallback();
        }
    }
});

$(document).ready(function() {
    dateRangeInputModal = new Modal('#date-range-input');
    scrollHandlingNeeded = true;
    initEntryFilters();

    $('#toggle-panel').on('click', 'a', function(){
        $('#loading-animation').show();
        var current = $('#toggle-panel .active');
        current.removeClass('active');
        $(this).addClass('active');
        var that = $(this);

        $(current.data('target')).fadeOut(function(){
            $(that.data('target')).fadeIn(function() {
                if (that.data('target') == '#visualizations') {
                    visualizationLoaded = true;
                    if (scrollCallback) {
                        scrollCallback();
                    }

                    // Fix a little bug on admin level buttons when they
                    // are loaded while not on visualization tab.
                    if (!mapLoaded) {
                        loadMap();
                    }
                    // A similar bug for timeline
                    resizeCanvas();
                    renderVisualizations();
                }
            });

        });
        setTimeout(function(){
            $('#loading-animation').hide();
        }, 500);

    });

    // loadMap();
});
function renderEntries() {
    if (eventId) {
        renderVisualizations();
    }

    $("#entries").empty();

    if (entries.length == 0) {
        $('#entries').html('<p class="message">No entries for this project</p>');
    }

    for (var i=0; i<Math.min(listableEntries, entries.length); ++i) {
        var entry = entries[i];

        var entryElement = $(".entry-template").clone();
        entryElement.removeClass("entry-template");
        entryElement.addClass("entry");

        entryElement.find(".entry-title").html(searchAndHighlight(entry.lead_title, leadTitleFilterText));
        entryElement.find(".entry-title").html(
            '<a' + (entry.lead_url ? ' target="_blank" href="' + entry.lead_url + '"' : '') + '>'
            + entryElement.find('.entry-title').html()
            + '</a>'
        );
        entryElement.find(".created-by").text(entry.created_by_name?entry.created_by_name:entry.modified_by_name);
        entryElement.find(".created-on").text(formatDate(new Date(entry.created_at)));

        entryElement.appendTo($("#entries"));
        entryElement.show();

        for (var j=0; j<entry.informations.length; ++j) {
            var information = entry.informations[j];

            var informationElement = $(".information-template").clone();
            informationElement.removeClass("information-template");
            informationElement.addClass("information");

            if(information.image.length == 0){
                informationElement.find('.excerpt-text').html(searchAndHighlight(information.excerpt, searchFilterText));
                informationElement.find('.excerpt-text').show();
                informationElement.find('.excerpt-image').hide();
            } else{
                informationElement.find('.excerpt-image').attr('src', information.image);
                informationElement.find('.excerpt-image').show();
                informationElement.find('.excerpt-text').hide();
            }


            informationElement.find('.reliability').find('span[data-level=' + information.reliability + ']').addClass('active');
            informationElement.find('.severity').find('span[data-level=' + information.severity + ']').addClass('active');

            informationElement.find('.date').text(information.date?formatDate(information.date):"");
            // informationElement.find('.number').text(information.number);

            informationElement.find('.vulnerable-groups').html(
                information.demographic_groups.map(function(vg) {
                    return '<span>'+vg+'</span>';
                }).join('')
            );
            informationElement.find('.sepecific-need-groups').html(
                information.specific_needs_groups.map(function(sg) {
                    return '<span>'+sg+'</span>';
                }).join('')
            );

            informationElement.find('.affected-group-list').html(
                information.affected_groups.map(function(ag) {
                    return '<span>'+ag+'</span>';
                }).join('')
            );

            informationElement.find('.geo-locations-list').html(
                information.map_selections.map(function(ms) {
                    return '<span>'+ms.name+'</span>';
                }).join('')
            );

            for (var k=0; k<information.attributes.length; ++k) {
                var attribute = information.attributes[k];

                var attributeElement = $('.attribute-template').clone();
                attributeElement.removeClass('attribute-template');
                attributeElement.addClass('attribute');

                attributeElement.find('.pillar').text(pillar_names[attribute.pillar]);
                attributeElement.find('.sub-pillar').text(subpillar_names[attribute.subpillar]);

                if (attribute.sector) {
                    attributeElement.find(".sector").text(sector_names[attribute.sector]);

                    if (attribute.subsectors) {
                        attributeElement.find(".sub-sector").text(
                            attribute.subsectors.reduce(function(a, b) {
                                if (a) return a + ", " + subsector_names[b];
                                else return subsector_names[b];
                            }, null)
                        );
                    }
                }

                attributeElement.appendTo(informationElement.find('.attribute-list'));
                attributeElement.show();
            }

            informationElement.appendTo(entryElement.find('.information-list'));
            informationElement.show();
        }

        entryElement.find('.edit-btn').attr('href', "/" + entry.event + "/entries/edit/" + entry.id + "/");

        entryElement.find('.delete-btn').unbind().click(function(entry){
            return function() {
                if (confirm('Are you sure you want to delete this entry?')) {
                    var data = { id: entry.id };
                    redirectPost("/" + entry.event + "/entries/delete/", data, csrf_token);
                }
            }
        }(entry));
    }
    $('#loading-animation').hide();
}
