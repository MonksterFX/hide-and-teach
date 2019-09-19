// https://towardsdatascience.com/how-to-write-a-jupyter-notebook-extension-a63f9578a38c

define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {
	
	var make_teaching_cell = function(){
		var selected_cells = Jupyter.notebook.get_selected_cells();
		selected_cells[0].metadata["teaching_cell"] = true;
		selected_cells[0].element.css("border", "2px dashed purple")
	}

	var clear_teaching_cell = function(){
		var selected_cells = Jupyter.notebook.get_selected_cells();
		selected_cells[0].metadata["teaching_cell"] = false;
		selected_cells[0].element.css("border", "")
	}

	
	var init_show_marker = function(){
       		var cells = Jupyter.notebook.get_cells();
        	for (var ii = 0; ii < cells.length; ii++) {
            		var cell = cells[ii];
            		if(cell.metadata["teaching_cell"] === true) {
                		cell.element.css("border", "2px dashed purple");
            		}
		}
	}

      	var defaultCellButton = function () {

	// https://jupyter-notebook.readthedocs.io/en/stable/extending/frontend_extensions.html#defining-and-registering-your-own-actions
          Jupyter.toolbar.add_buttons_group([
              Jupyter.keyboard_manager.actions.register ({
                  'help': 'Tag as teaching cell',
                  'icon' : 'fa-lock',
                  'handler': make_teaching_cell 
              }, 'make-teaching-cell', 'Make teaching cell'), 

              Jupyter.keyboard_manager.actions.register ({
                  'help': 'Untag as teaching cell',
                  'icon' : 'fa-unlock-alt',
                  'handler': clear_teaching_cell 
              }, 'clean-teaching-cell', 'Clean teaching cell')

          ])
      }

    function load_ipython_extension() {
         "use strict";

       	defaultCellButton();

        if (Jupyter.notebook._fully_loaded) {  
		init_show_marker();
        } else {
            $([Jupyter.events]).on("notebook_loaded.Notebook", function() {
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