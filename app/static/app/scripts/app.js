Ext.onReady(function () {
    Ext.define('Registr', {
        extend: 'Ext.data.Model',
        idProperty: 'id',
        fields: [
            { name: 'id', type: 'int' },
            'fam',
            'im',
            'otch',
            'city',
            'street'
        ]
    });

    var urlRoot = 'data?model=Registr&method=';
    var registrStore = Ext.create('Ext.data.Store', {
        model: 'Registr',
        pageSize: 10,
        proxy: {
             type: 'jsonp',
            noCache: false,          
            api: {
                create:     urlRoot + 'Create',
                read:       urlRoot + 'Read',
                update:     urlRoot + 'Update',
                destroy:    urlRoot + 'Destroy'
            },
            reader: {
                type: 'json',
                metaProperty: 'meta',
                root: 'data',
                idProperty: 'id',
                totalProperty: 'meta.total',
                successProperty: 'meta.success'       
            },           
            writer: {
                type: 'json',
                encode: true,
                writeAllFields: true,
                root: 'data',
                allowSingle: false,
            }
        }
    });

    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 2,
        autoCancel: false,
        listeners: {
            edit: function (editor, context) {
                var emp = registrStore.getProxy();
                var con = context.record;
                emp.setExtraParam("id",         con.data['id']);
                emp.setExtraParam("fam",        con.data['fam']);
                emp.setExtraParam("im",         con.data['im']);
                emp.setExtraParam("otch",       con.data['otch']);
                emp.setExtraParam("street",     con.data['street']);
                emp.setExtraParam("city",       con.data['city']);
            }
        }
    });
    
    var textField = {
        xtype: 'textfield'
    };
    
    var columns = [
        {
            header: 'ID',
            dataIndex: 'id',
            sortable: true,
            width: 35
        },
        {
            header: 'Фамилия',
            dataIndex: 'fam',
            sortable: true,
            editor: textField
        },
        {
             header: 'Имя',
             dataIndex: 'im',
             sortable: true,
             editor: textField
        },
        {
            header: 'Отчество',
            dataIndex: 'otch',
            sortable: true,
            editor: textField
        },
        {
            header: 'Город',
            dataIndex: 'city',
            sortable: true,
            editor: textField
        },
        {
            header: 'Улица',
            dataIndex: 'street',
            flex: 1,
            sortable: true,
            editor: textField
        }
    ];
    var pagingToolbar = {
        xtype: 'pagingtoolbar',
        store: registrStore,
        displayInfo: true,
        items: [
            '-',
            {
                text: 'Save Changes',
                handler: function () {  
                registrStore.sync();
                }
            },
            '-',
            {
                text: 'Reject Changes',
                handler: function () {
                    // Отмена изменений в stoe
                    registrStore.rejectChanges();
                }
            },
            '-'
        ]
    };
    var onDelete = function () {
        var selected = grid.selModel.getSelection();
        Ext.MessageBox.confirm(
                'Confirm delete',
                'Are you sure?',
                function (btn) {
                    if (btn == 'yes') {
                        var nn = selected[0].get('id')
                        var emp = registrStore.getProxy();
                        emp.setExtraParam("id", nn)
                        grid.store.remove(selected);                      
                        grid.store.sync();
                    }
                }
        );
    };

    var onInsertRecord = function () {
        var selected = grid.selModel.getSelection();
        rowEditing.cancelEdit();
        var newEmployee = Ext.create("Registr");
        registrStore.insert(selected[0].index, newEmployee);
        rowEditing.startEdit(selected[0].index, 0);
    };
    var doRowCtxMenu = function (view, record, item, index, e) {
        e.stopEvent();
        if (!grid.rowCtxMenu) {
            grid.rowCtxMenu = new Ext.menu.Menu({
                items: [
                    {
                        text: 'Insert Record',
                        handler: onInsertRecord
                        
                    },
                    {
                        text: 'Delete Record',
                        handler: onDelete
                    }
                ]
            });
        }
        grid.selModel.select(record);
        grid.rowCtxMenu.showAt(e.getXY());
    };

    var grid = Ext.create('Ext.grid.Panel', {
        columns: columns,
        store: registrStore,
        loadMask: true,
        bbar: pagingToolbar,
        plugins: [rowEditing],
        stripeRows: true,
        selType: 'rowmodel',
        viewConfig: {
            forceFit: true
        },
        listeners: {
            itemcontextmenu: doRowCtxMenu,
            destroy: function (thisGrid) {
                if (thisGrid.rowCtxMenu) {
                    thisGrid.rowCtxMenu.destroy();
                }
            }
        }
    });

    Ext.create('Ext.Window', {
        title: 'Клиент Django',
        height: 350,
        width: 800,
        border: false,
        layout: 'fit',
        items: grid,
        closable: true,
        maximizable: true,      
    }).show();

    registrStore.load();
});
