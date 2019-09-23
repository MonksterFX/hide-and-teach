// https://towardsdatascience.com/how-to-write-a-jupyter-notebook-extension-a63f9578a38c

define([
    'base/js/namespace',
    'base/js/events'
], function (Jupyter, events) {

    var make_practice_cell = function () {
        var selected_cells = Jupyter.notebook.get_selected_cells();
        selected_cells[0].metadata["practice_cell"] = true;
        selected_cells[0].element.css("border", "2px dashed purple")
    }

    var clear_practice_cell = function () {
        var selected_cells = Jupyter.notebook.get_selected_cells();
        selected_cells[0].metadata["practice_cell"] = false;
        selected_cells[0].element.css("border", "")
    }

    var show_marker = function(){
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            var cell = cells[ii];
            if (cell.metadata["practice_cell"] === true) {
                cell.element.css("border", "2px dashed purple");
            }
        }
    }
    
    var hide_marker = function(){
        var cells = Jupyter.notebook.get_cells();
        for (var ii = 0; ii < cells.length; ii++) {
            var cell = cells[ii];
            if (cell.metadata["practice_cell"] === true) {
                cell.element.css("border", "None");
            }
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
                'help': 'Tag as practice cell',
                'icon': 'fa-minus-square',
                'handler': make_practice_cell
            }, 'make-practice-cell', 'Make practice cell'),

            Jupyter.keyboard_manager.actions.register({
                'help': 'Untag as practice cell',
                'icon': 'fa-undo',
                'handler': clear_practice_cell
            }, 'clean-practice-cell', 'Clean practice cell'),
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
            init_show_marker();
        } else {
            $([Jupyter.events]).on("notebook_loaded.Notebook", function () {
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