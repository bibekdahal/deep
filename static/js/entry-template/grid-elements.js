class Matrix1DList extends Element {
    constructor(container, data) {
        let dom = $('<div class="element matrix1d-list"></div>');
        dom.append($('<div class="fa fa-arrows handle"></div>'));
        dom.append($('<div class="fa fa-edit edit"></div>'));
        dom.append($('<div class="container"><div class="col-1"><div class="pillar">Pillar</div><div class="subpillar">Subpillar</div></div></div>'));
        super(container, dom);

        if (data){
            this.load(data);
        }

        this.addPropertiesTo(this.createPropertiesBox(this.dom.find('.edit')));
    }

    save() {
        let page = templateEditor.getPage();
        if (page != 'page-two') {
            templateEditor.switchPage();
        }

        let data = {
            left: this.dom.position().left,
        };

        if(page != templateEditor.getPage()) {
            templateEditor.switchPage();
        }

        return data;
    }

    load(data) {
        if (data.left) {
            this.dom.css('left', data.left);
        }
    }
}


class Matrix1D extends Element {
    constructor(container, container2, data) {
        let dom = $('<div class="element matrix1d"></div>');
        dom.append($('<div class="fa fa-arrows handle"></div>'));
        dom.append($('<div class="fa fa-edit edit"></div>'));
        dom.append($('<h4 class="title">1D Matrix</h4>'));
        dom.append($('<div class="pillars sortable"></div>'));
        dom.append($('<button class="add-pillar"><i class="fa fa-plus"></i>Add Pillar</button>'));
        dom.resizable({
            grid: GRID_SIZE,
            handles: 'e, w',
        });
        super(container, dom);
        let that = this;

        this.list = new Matrix1DList(container2, data?data.list:null);

        this.addPillar();
        dom.find('.add-pillar').click(function() {
            that.addPillar();
        });

        this.dom.find('.pillars').sortable({ axis: 'y' });

        if (data) {
            this.load(data);
        }

        this.addPropertiesTo(this.createPropertiesBox(this.dom.find('.edit')));
    }

    addPillar() {
        let that = this;

        let pillar = $('<div class="pillar"></div>');
        pillar.data('id', this.getUniquePillarId());
        pillar.append($('<div class="title-block">New pillar</div>'));

        let floatingToolbar = $('<div class="floating-toolbar"></div>');
        floatingToolbar.append('<button class="fa fa-times close"></button>');
        floatingToolbar.append('<input type="color" value="#eeeeee">');
        floatingToolbar.append('<input type="text" placeholder="Tooltip">');
        floatingToolbar.find('.close').click(function() {
            floatingToolbar.hide();
        });
        floatingToolbar.hide();
        pillar.append(floatingToolbar);

        pillar.append($('<div class="subpillars sortable"></div>'));
        pillar.append($('<button class="add-subpillar"><i class="fa fa-plus"></i></button>'));
        pillar.prepend($('<div class="options"><button class="fa fa-times remove-pillar"></button><button class="fa fa-edit edit-pillar"></button></div>'));
        this.dom.find('.pillars').append(pillar);

        this.addSubpillar(pillar);
        pillar.find('.add-subpillar').click(function() {
            that.addSubpillar(pillar);
        });
        pillar.find('.remove-pillar').click(function() {
            pillar.remove();
        });
        pillar.find('.edit-pillar').click(function() {
            pillar.find('.floating-toolbar').show();
        });

        this.makeEditable(pillar.find('.title-block'));
        pillar.find('.subpillars').sortable({ axis: 'x' });

        return pillar;
    }

    addSubpillar(pillar) {
        let subpillar = $('<div class="subpillar" tabIndex="1"></div>');
        subpillar.data('id', this.getUniqueSubpillarId());
        subpillar.append($('<div class="title-block">New subpillar</div>'));
        subpillar.append($('<button class="fa fa-times remove-subpillar"></button>'));
        pillar.find('.subpillars').append(subpillar);

        subpillar.find('.remove-subpillar').click(function() {
            subpillar.remove();
        });

        this.makeEditable(subpillar.find('.title-block'));
        return subpillar;
    }

    makeEditable(element) {
        element.click(function() {
            $(this).closest('.element').find('div').attr('contenteditable', 'false');
            $(this).attr('contenteditable', 'true');
            $(this).closest('.element').draggable({ disabled: true });
            $(this).parents('.sortable').sortable({ disabled: true });
            $(this).focus();
        });

        element.blur(function(e) {
            $(this).attr('contenteditable', 'false');
            $(this).closest('.element').draggable({ disabled: false });
            $(this).parents('.sortable').sortable({ disabled: false });
        });
    }

    save() {
        let pillars = [];
        this.dom.find('.pillars .pillar').each(function() {
            let pillar = {};

            pillar.name = $(this).find('.title-block').eq(0).text();
            pillar.id = $(this).data('id');
            pillar.color = $(this).find('.floating-toolbar input[type="color"]').val();
            pillar.tooltip = $(this).find('.floating-toolbar input[type="text"]').val();

            pillar.subpillars = [];
            $(this).find('.subpillars .subpillar').each(function() {
                let subpillar = {};

                subpillar.name = $(this).find('.title-block').eq(0).text();
                subpillar.id = $(this).data('id');

                pillar.subpillars.push(subpillar);
            });

            pillars.push(pillar);
        });
        return {
            id: this.id,
            type: 'matrix1d',
            pillars: pillars,
            position: this.getPosition(),
            title: this.dom.find('.title').text(),
            width: this.dom.css('width'),
            list: this.list.save(),
        };
    }

    load(data) {
        let that = this;

        this.dom.find('.pillars .pillar').remove();
        for (let i=0; i<data.pillars.length; i++) {
            let pillar = data.pillars[i];
            let pillarElement = that.addPillar();
            pillarElement.find('.subpillars').empty();
            pillarElement.find('.title-block').text(pillar.name);

            if (pillar.id) { pillarElement.data('id', pillar.id) };
            if (pillar.color) { pillarElement.find('.floating-toolbar input[type="color"]').val(pillar.color); }
            if (pillar.tooltip) { pillarElement.find('.floating-toolbar input[type="text"]').val(pillar.tooltip); }

            for (let j=0; j<pillar.subpillars.length; j++) {
                let subpillar = pillar.subpillars[j];
                let subpillarElement = that.addSubpillar(pillarElement);
                subpillarElement.find('.title-block').text(subpillar.name);
                if (subpillar.id) { subpillarElement.data('id', subpillar.id) };
            }
        }

        if (data.id) {
            this.id = data.id;
        }

        if (data.position) {
            this.setPosition(data.position);
        }

        if (data.title !== undefined) {
            this.dom.find('.title').text(data.title);
        }

        if (data.width) {
            this.dom.css('width', data.width);
        }
    }

    getTitle() {
        return "1D Matrix";
    }

    getUniquePillarId() {
        let i = this.dom.find('.pillar').length;
        while (true) {
            let id = 'pillar-' + i;
            if (this.dom.find('.pillar[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    getUniqueSubpillarId() {
        let i = this.dom.find('.subpillar').length;
        while (true) {
            let id = 'subpillar-' + i;
            if (this.dom.find('.subpillar[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    addPropertiesTo(container) {
        this.addIdProperty(container);
        let that = this;

        let titleProperty = $('<div class="property"></div>');
        titleProperty.append($('<label>Title</label>'));
        titleProperty.append($('<input type="text">'));
        titleProperty.find('input').val(this.dom.find('.title').text());
        titleProperty.find('input').change(function() {
            that.dom.find('.title').text($(this).val());
            templateEditor.reloadElements();
        });
        container.append(titleProperty);
    }

    getAllowedPage() {
        return 'page-one';
    }
}


class Matrix2DList extends Element {
    constructor(container, data) {
        let dom = $('<div class="element matrix2d-list"></div>');
        dom.append($('<div class="fa fa-arrows handle"></div>'));
        dom.append($('<div class="fa fa-edit edit"></div>'));
        dom.append($('<div class="container"><div class="col-1"><div class="pillar">Pillar</div><div class="subpillar">Subpillar</div></div><div class="col-2"><div class="sector">Sector</div><div class="subsectors">Subsectors</div></div></div>'));

        super(container, dom);

        if (data){
            this.load(data);
        }

        this.addPropertiesTo(this.createPropertiesBox(this.dom.find('.edit')));
    }

    save() {
        let page = templateEditor.getPage();
        if (page != 'page-two') {
            templateEditor.switchPage();
        }

        let data = {
            left: this.dom.position().left,
        };

        if(page != templateEditor.getPage()) {
            templateEditor.switchPage();
        }

        return data;
    }

    load(data) {
        if (data.left) {
            this.dom.css('left', data.left);
        }
    }
}



class Matrix2D extends Element {
    constructor(container, container2, data) {
        let dom = $('<div class="element matrix2d"></div>');
        dom.append($('<div class="fa fa-arrows handle"></div>'));
        dom.append($('<div class="fa fa-edit edit"></div>'));
        dom.append($('<h4 class="title">2D Matrix</h4>'));
        dom.append($('<div class="sectors-container"><div class="sectors sortable"></div><button class="fa fa-plus add-sector"></button></div>'));
        dom.append($('<div class="pillars-container"><div class="pillars sortable"></div><button class="fa fa-plus add-pillar"></button></div>'));
        dom.resizable({ grid: GRID_SIZE, handles: 'e, w' });

        super(container, dom);

        this.list = new Matrix2DList(container2, data?data.list:null);

        let that = this;

        this.addPillar();
        this.addSector();

        dom.find('.add-pillar').click(function() { that.addPillar(); });
        dom.find('.add-sector').click(function() { that.addSector(); });

        dom.find('.pillars').sortable({ axis: 'y' });
        dom.find('.sectors').sortable({ axis: 'x' });

        if (data) {
            this.load(data);
        }

        this.addPropertiesTo(this.createPropertiesBox(this.dom.find('.edit')));
    }

    addPillar() {
        let that = this;
        let pillars = this.dom.find('.pillars');
        let pillar = $('<div class="pillar"><div class="title-block">New pillar</div></div>');
        pillar.append($('<div class="options"><button class="fa fa-times remove-pillar"></button><button class="fa fa-edit edit-pillar"></button></div>'))
        pillar.data('id', this.getUniquePillarId());

        let floatingToolbar = $('<div class="floating-toolbar"></div>');
        floatingToolbar.append('<button class="fa fa-times close"></button>');
        floatingToolbar.append('<input type="color" value="#eeeeee">');
        floatingToolbar.append('<input type="text" placeholder="Tooltip">');
        floatingToolbar.find('.close').click(function() {
            floatingToolbar.hide();
        })
        floatingToolbar.hide();
        pillar.append(floatingToolbar);

        pillar.append($('<div class="subpillars-container"><div class="subpillars sortable"></div><button class="fa fa-plus add-subpillar"></button></div>'));
        pillars.append(pillar);

        pillar.find('.subpillars').sortable({ axis: 'y' });
        this.makeEditable(pillar.find('.title-block'));

        this.addSubpillar(pillar);
        pillar.find('.add-subpillar').click(function() { that.addSubpillar(pillar); });
        pillar.find('.remove-pillar').click(function() { pillar.remove(); });
        pillar.find('.edit-pillar').click(function(e) {
            e.stopPropagation();
            floatingToolbar.show();
            floatingToolbar.trigger('visible');
        });

        return pillar;
    }

    addSubpillar(pillar) {
        let that = this;
        let subpillar = $('<div class="subpillar"><div class="title-block">New subpillar</div></div>');
        subpillar.append($('<div class="options"><button class="fa fa-times remove-subpillar"></button><button class="fa fa-edit edit-subpillar"></button></div>'))
        subpillar.data('id', this.getUniqueSubpillarId());

        let floatingToolbar = $('<div class="floating-toolbar" hidden></div>');
        floatingToolbar.append('<button class="fa fa-times close"></button>');
        floatingToolbar.append('<input type="text" placeholder="Tooltip">');
        floatingToolbar.find('.close').click(function() {
            floatingToolbar.hide();
        });
        floatingToolbar.hide();
        subpillar.append(floatingToolbar);

        pillar.find('.subpillars').append(subpillar);

        this.makeEditable(subpillar.find('.title-block'));
        subpillar.find('.remove-subpillar').click(function() { subpillar.remove(); });
        subpillar.find('.edit-subpillar').click(function(e) {
            e.stopPropagation();
            floatingToolbar.show();
            floatingToolbar.trigger('visible');
        });

        return subpillar;
    }

    addSector() {
        let that = this;
        let sectors = this.dom.find('.sectors');
        let sector = $('<div class="sector"><div class="title-block">New sector</div></div>');
        sector.append($('<div class="options"><button class="fa fa-times remove-sector"></button><button class="fa fa-edit edit-sector"></button></div>'));
        sector.data('id', this.getUniqueSectorId());

        let floatingToolbar = $('<div class="floating-toolbar"></div>');
        floatingToolbar.append('<button class="fa fa-times close"></button>');

        floatingToolbar.append('<label>Subsectors</label>');
        floatingToolbar.append('<button class="fa fa-plus add-subsector"></button><div class="subsectors"></div>');
        floatingToolbar.find('.add-subsector').click(function() {
            that.addSubsector(sector);
        });


        floatingToolbar.find('.close').click(function() {
            floatingToolbar.hide();
        })
        floatingToolbar.hide();
        sector.append(floatingToolbar);

        sectors.append(sector);

        this.makeEditable(sector.find('.title-block'));
        sector.find('.remove-sector').click(function() { sector.remove(); });
        sector.find('.edit-sector').click(function(e) {
            e.stopPropagation();
            floatingToolbar.show();
            floatingToolbar.trigger('visible');
        });

        return sector;
    }

    addSubsector(sector) {
        let subsector = $('<div class="subsector"><input placeholder="Enter subsector"><button class="fa fa-times remove-subsector"></button></div>')
        subsector.data('id', this.getUniqueSubsectorId());
        subsector.find('.remove-subsector').click(function() {
            subsector.remove();
        });
        subsector.appendTo(sector.find('.floating-toolbar').find('.subsectors'));
        return subsector;
    }

    makeEditable(element) {
        element.click(function() {
            $(this).closest('.element').find('div').attr('contenteditable', 'false');
            $(this).attr('contenteditable', 'true');
            $(this).closest('.element').draggable({ disabled: true });
            $(this).parents('.sortable').sortable({ disabled: true });
            $(this).focus();
        });

        element.blur(function(e) {
            $(this).attr('contenteditable', 'false');
            $(this).closest('.element').draggable({ disabled: false });
            $(this).parents('.sortable').sortable({ disabled: false });
        });
    }

    save() {
        let pillars = [];
        let sectors = [];

        this.dom.find('.pillars .pillar').each(function() {
            let pillar = {};
            pillar.title = $(this).find('.title-block').eq(0).text();
            pillar.id = $(this).data('id');
            pillar.color = $(this).find('.floating-toolbar input[type="color"]').val();
            pillar.tooltip = $(this).find('.floating-toolbar input[type="text"]').val();

            pillar.subpillars = [];

            $(this).find('.subpillars .subpillar').each(function() {
                pillar.subpillars.push({
                    title: $(this).find('.title-block').text(),
                    id: $(this).data('id'),
                    tooltip: $(this).find('.floating-toolbar input[type="text"]').val(),
                });
            });
            pillars.push(pillar);
        });

        this.dom.find('.sectors .sector').each(function() {
            let sector = {
                title: $(this).find('.title-block').text(),
                id: $(this).data('id'),
                subsectors: [],
            };
            $(this).find('.floating-toolbar .subsectors .subsector').each(function() {
                sector.subsectors.push({
                    id: $(this).data('id'),
                    title: $(this).find('input').val(),
                });
            });
            sectors.push(sector);
        });

        return {
            id: this.id,
            type: 'matrix2d',
            position: this.getPosition(),
            title: this.dom.find('.title').text(),
            pillars: pillars,
            sectors: sectors,
            list: this.list.save(),
            width: this.dom.css('width'),
        };
    }

    load(data) {
        let that = this;

        if (data.id) {
            this.id = data.id;
        }

        if (data.position) {
            this.setPosition(data.position);
        }

        if (data.title !== undefined) {
            this.dom.find('.title').text(data.title);
        }

        if (data.pillars) {
            this.dom.find('.pillars .pillar').remove();
            for (let i=0; i<data.pillars.length; i++) {
                let pillar = data.pillars[i];
                let pillarDom = this.addPillar();
                pillarDom.find('.subpillars .subpillar').remove();
                pillarDom.find('.title-block').text(pillar.title);

                if (pillar.id) { pillarDom.data('id', pillar.id) };
                if (pillar.color) { pillarDom.find('.floating-toolbar input[type="color"]').val(pillar.color); };
                if (pillar.tooltip) { pillarDom.find('.floating-toolbar input[type="text"]').val(pillar.tooltip); };

                for (let j=0; j<pillar.subpillars.length; j++) {
                    let subpillar = pillar.subpillars[j];
                    let subpillarDom = this.addSubpillar(pillarDom);
                    subpillarDom.find('.title-block').text(subpillar.title);

                    if (subpillar.id) { subpillarDom.data('id', subpillar.id) };
                    if (subpillar.tooltip) { subpillarDom.find('.floating-toolbar input[type="text"]').val(subpillar.tooltip); };
                }
            }
        }

        if (data.sectors) {
            this.dom.find('.sectors .sector').remove();
            for (let i=0; i<data.sectors.length; i++) {
                let sector = data.sectors[i];
                let sectorDom = this.addSector();
                sectorDom.find('.title-block').text(sector.title);
                if (sector.id) { sectorDom.data('id', sector.id) };

                if (sector.subsectors) {
                    for (let j=0; j<sector.subsectors.length; j++) {
                        let subsector = this.addSubsector(sectorDom);
                        subsector.find('input').val(sector.subsectors[j].title);
                        subsector.data('id', sector.subsectors[j].id);
                    }
                }
            }
        }

        if (data.width) {
            this.dom.css('width', data.width);
        }
    }

    getTitle() {
        return "2D Matrix";
    }

    getUniquePillarId() {
        let i = this.dom.find('.pillar').length;
        while (true) {
            let id = 'pillar-' + i;
            if (this.dom.find('.pillar[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    getUniqueSubpillarId() {
        let i = this.dom.find('.subpillar').length;
        while (true) {
            let id = 'subpillar-' + i;
            if (this.dom.find('.subpillar[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    getUniqueSectorId() {
        let i = this.dom.find('.sector').length;
        while (true) {
            let id = 'sector-' + i;
            if (this.dom.find('.sector[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    getUniqueSubsectorId() {
        let i = this.dom.find('.subsector').length;
        while (true) {
            let id = 'subsector-' + i;
            if (this.dom.find('.subsector[data-id="' + id + '"]')) {
                return id;
            }
            i++;
        }
    }

    addPropertiesTo(container) {
        this.addIdProperty(container);
        let that = this;

        let titleProperty = $('<div class="property"></div>');
        titleProperty.append($('<label>Title</label>'));
        titleProperty.append($('<input type="text">'));
        titleProperty.find('input').val(this.dom.find('.title').text());
        titleProperty.find('input').change(function() {
            that.dom.find('.title').text($(this).val());
            templateEditor.reloadElements();
        });
        container.append(titleProperty);
    }

    getAllowedPage() {
        return 'page-one';
    }
}