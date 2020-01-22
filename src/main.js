// https://towardsdatascience.com/how-to-write-a-jupyter-notebook-extension-a63f9578a38c

define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    var protected_cell = function () {
        var selected_cells = Jupyter.notebook.get_selected_cells();
        
        for (const element of selected_cells) {
            // elected_cells[0].metadata["ht_protected"] = true;
            // selected_cells[0].element.css("border", "2px dashed green")
            element.metadata["ht_protected"] = true;
            element.element.css("border", "2px dashed green")
        }
    }

    var enforce_remove = function () {
        var selected_cells = Jupyter.notebook.get_selected_cells();
        selected_cells[0].metadata["ht_enforce_remove"] = true;
        selected_cells[0].element.css("border", "2px dashed orange")
    }

    var clear_tags = function () {
        var selected_cells = Jupyter.notebook.get_selected_cells();
	// ToDo: remove metadata tag
        delete selected_cells[0].metadata["ht_protected"];
        delete selected_cells[0].metadata["ht_enforce_remove"];
        selected_cells[0].element.css("border", "")
    }

    var convert_from_v1_to_v2 = function () {
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            var cell = cells[ii];
            if (cell.metadata["practice_cell"] === true) {
				delete cell.metadata["practice_cell"];
				cell.metadata["ht_protected"] = true;
            }
        }
    }

    var show_marker = function(){
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            var cell = cells[ii];
            if (cell.metadata["ht_protected"] === true) {
                cell.element.css("border", "2px dashed green");
            }
			
			if (cell.metadata["ht_enforce_remove"] === true) {
                cell.element.css("border", "2px dashed orange");
            }
        }
    }
    
    var hide_marker = function(){
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            var cell = cells[ii];
            cell.element.css("border", "None");
        }
    }


    var init_show_marker = function () {
        show_marker();
    }

    // add buttons
    var defaultCellButton = function () {

        // https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#defining-and-registering-your-own-actions
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'protect against removement/hiding',
                'icon': 'fa-minus-square',
                'handler': protected_cell
            }, 'protect-cell', 'Protect cell'),
			
			Jupyter.keyboard_manager.actions.register({
                'help': 'enforce removement of cell',
                'icon': 'fa-minus-square',
                'handler': enforce_remove
            }, 'enforce-remove', 'enforce remove'),

            Jupyter.keyboard_manager.actions.register({
                'help': 'clear tags',
                'icon': 'fa-undo',
                'handler': clear_tags
            }, 'clean-cell', 'clean tags'),
        ])
            

            //  TODO: Clean cells and only output
            // fa-eraser 
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Show all Marker',
                'icon': 'fa-eye',
                'handler': show_marker
            },  'show-markers', 'Show Marker'),

            Jupyter.keyboard_manager.actions.register({
                'help': 'Hide all Marker',
                'icon': 'fa-eye-slash',
                'handler': hide_marker
            },  'hide-markers', 'Hide Marker'),
        ])
    }

    function load_ipython_extension() {
        "use strict";

        defaultCellButton();

        if (Jupyter.notebook._fully_loaded) {
            convert_from_v1_to_v2();
	    init_show_marker();
        } else {
            $([Jupyter.events]).on("notebook_loaded.Notebook", function () {
                convert_from_v1_to_v2();
                init_show_marker();
            })
        }
    }
    /*
        function run_init_cells_asap () {
            if (Jupyter.notebook && Jupyter.notebook.kernel && Jupyter.notebook.kernel.info_reply.status === 'ok') {
                // kernel is already ready
                init_show_marker();
            }
            // whenever a (new) kernel  becomes ready, run all initialization cells
            events.on('kernel_ready.Kernel', run_init_cells);
    }
    */

    return {
        load_ipython_extension: load_ipython_extension
    };
});