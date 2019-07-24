/* API Drag & Drop déplacement de certains éléments vers d'autres conteneurs */
(function dragAndDropOption() {
    const DndHandler = {
        draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

        init: function () {
            for (let i = 0; i < elements.length; i++) {
                // Application des paramètres nécessaires aux élément déplaçables
                DndHandler.applyDragEvents(elements[i]);
            }
            for (let i = 0; i < droppers.length; i++) {
                // Application des événements nécessaires aux zones de drop
                DndHandler.applyDropEvents(droppers[i]);
            }
        },

        applyDragEvents: function (element) {
            element.draggable = true;

            // Cette variable est nécessaire pour que l'événement "dragstart" ci-dessous accède facilement au namespace "DndHandler"
            let DndHandler = this;

            element.addEventListener('dragstart', function (e) {
                DndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox

                // ajout de la classe selected à l'élément en cours de transfert
                DndHandler.draggedElement.classList.add('selected');

            }, false);
            const path = require('path');
        },

        applyDropEvents: function (dropper) {
            dropper.addEventListener('dragover', function (e) {
                e.preventDefault(); // On autorise le drop d'éléments
                // Et on applique le design adéquat à notre zone de drop quand un élément la survole
                this.className = 'dropper drop_hover';
            }, false);

            dropper.addEventListener('dragleave', function () {
                // On revient au design de base lorsque l'élément quitte la zone de drop
                this.className = 'dropper';

                // retrait de la classe selected à l'élément dont le transfert est terminé
                DndHandler.draggedElement.classList.remove('selected');
            });

            // Cette variable est nécessaire pour que l'événement "drop" ci-dessous accède facilement au namespace "DndHandler"
            let DndHandler = this;

            dropper.addEventListener('drop', function (e) {
                let target = e.target,
                    // Récupération de l'élément
                    draggedElement = DndHandler.draggedElement,
                    // On créé immédiatement le clone de cet élément
                    clonedElement = draggedElement.cloneNode(true);

                // Cette boucle permet de remonter jusqu'à la zone de drop parente
                while (target.className.indexOf('dropper') === -1) {
                    target = target.parentNode;
                }
                // Application du design par défaut
                target.className = 'dropper';

                // Ajout de l'élément cloné à la zone de drop actuelle
                clonedElement = target.appendChild(clonedElement);

                // Nouvelle application des événements qui ont été perdus lors du cloneNode()
                DndHandler.applyDragEvents(clonedElement);
                //Move.selectOption(clonedElement); si utilisation de MoveOption API

                // Suppression de l'élément d'origine
                console.log("on est sur drag and drop");
                draggedElement.parentNode.removeChild(draggedElement);
            });
        },
    };

    let elements = document.querySelectorAll(".draggable");
    let droppers = document.querySelectorAll(".dropper");

    DndHandler.init();
})();