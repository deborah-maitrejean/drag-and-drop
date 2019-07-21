/* API Drag & Drop déplacement de certains éléments vers d'autres conteneurs */
(function dragAndDropOption() {
    const dndHandler = {
        draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement

        applyDragEvents: function (element) {
            element.draggable = true;

            let dndHandler = this; // Cette variable est nécessaire pour que l'événement "dragstart" ci-dessous accède facilement au namespace "dndHandler"

            element.addEventListener('dragstart', function (e) {
                dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
                e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
            }, false);
            const path = require('path');
        },

        applyDropEvents: function (dropper) {
            dropper.addEventListener('dragover', function (e) {
                e.preventDefault(); // On autorise le drop d'éléments
                this.className = 'dropper drop_hover'; // Et on applique le design adéquat à notre zone de drop quand un élément la survole
            }, false);

            dropper.addEventListener('dragleave', function () {
                this.className = 'dropper'; // On revient au design de base lorsque l'élément quitte la zone de drop
            });

            let dndHandler = this; // Cette variable est nécessaire pour que l'événement "drop" ci-dessous accède facilement au namespace "dndHandler"

            dropper.addEventListener('drop', function (e) {
                let target = e.target,
                    draggedElement = dndHandler.draggedElement, // Récupération de l'élément concerné
                    clonedElement = draggedElement.cloneNode(true); // On créé immédiatement le clone de cet élément

                while (target.className.indexOf('dropper') === -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
                    target = target.parentNode;
                }

                target.className = 'dropper'; // Application du design par défaut

                clonedElement = target.appendChild(clonedElement); // Ajout de l'élément cloné à la zone de drop actuelle
                dndHandler.applyDragEvents(clonedElement); // Nouvelle application des événements qui ont été perdus lors du cloneNode()

                draggedElement.parentNode.removeChild(draggedElement); // Suppression de l'élément d'origine
            });
        }
    };

    let elements = document.querySelectorAll('.draggable'),
        elementsLen = elements.length;

    for (let i = 0; i < elementsLen; i++) {
        dndHandler.applyDragEvents(elements[i]); // Application des paramètres nécessaires aux élément déplaçables
    }

    let droppers = document.querySelectorAll('.dropper'),
        droppersLen = droppers.length;

    for (let i = 0; i < droppersLen; i++) {
        dndHandler.applyDropEvents(droppers[i]); // Application des événements nécessaires aux zones de drop
    }
})();