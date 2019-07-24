/* API Move déplacement de certains éléments vers d'autres conteneurs */
(function MoveOption() {
    let elements = document.querySelectorAll(".draggable");
    let droppers = document.querySelectorAll(".dropper");
    let rightDropper = document.getElementById("right-dropper");
    let leftDropper = document.getElementById("left-dropper");
    let addBtn = document.getElementById("add-option");
    let removeBtn = document.getElementById("remove-option");

    const Move = {
        init: function () {
            for (let i = 0; i < elements.length; i++) {
                Move.selectOption(elements[i]);
            }
            Move.controls();

            const path = require('path');
        },

        selectOption: function (element) {
            // sélection de l'élément au click de la souris
            element.addEventListener("click", function () {
                Move.selectedStyle(this);
                Move.buttonStyle(this);
            });

            // sélection de l'élément avec la touche de tabulation
            element.addEventListener("focus", function () {
                Move.selectedStyle(this);
                Move.buttonStyle(this);
            });
        },

        buttonStyle: function (element) {
            if (element.parentNode.getAttribute("id") === "left-dropper") {
                removeBtn.classList.add("disabled");
                addBtn.classList.remove("disabled");
            } else {
                addBtn.classList.add("disabled");
                removeBtn.classList.remove("disabled");
            }
        },

        selectedStyle: function (element) {
            // j'enlève la class 'selected' a tous les éléments
            let selected = document.querySelectorAll('.selected');
            for (let i = 0; i < selected.length; i++) {
                selected[i].classList.remove('selected');
            }

            // j'ajoute la class 'selected' au seul élément sur lequel je clique
            element.classList.add('selected');
        },

        controls: function () {
            // contrôles depuis le clavier
            document.addEventListener('keydown', function (e) {
                // je récupère tous les éléments ayant la class "selected"
                let selected = document.querySelectorAll('.selected');

                if (e.keyCode === 37) {
                    // au click sur la flèche gauche
                    e.preventDefault();
                    for (let i = 0; i < selected.length; i++) {
                        Move.move(selected[i]); // j'envoie mon element
                    }
                } else if (e.keyCode === 39) {
                    // au click sur la flèche droite
                    e.preventDefault();
                    for (let i = 0; i < selected.length; i++) {
                        Move.move(selected[i]); // j'envoie mon element
                    }
                }
            });

            // contrôles depuis les boutons add et remove
            addBtn.addEventListener("click", function () {
                // je récupère tous les éléments ayant la class "selected"
                let selected = document.querySelectorAll('.selected');
                if (selected.length === 0 || this.classList.contains("disabled")) {
                    alert("Veuillez sélectionner une option à ajouter");
                } else {
                    for (let i = 0; i < selected.length; i++) {
                        Move.move(selected[i]); // j'envoie mon element
                    }
                    // je désactive mon bouton
                    this.classList.add("disabled");
                }
            });
            removeBtn.addEventListener("click", function () {
                // je récupère tous les éléments ayant la class "selected"
                let selected = document.querySelectorAll('.selected');
                if (selected.length === 0 || this.classList.contains("disabled")) {
                    alert("Veuillez sélectionner une option à retirer");
                } else {
                    for (let i = 0; i < selected.length; i++) {
                        Move.move(selected[i]); // j'envoie mon element
                    }
                    // je désactive mon bouton
                    this.classList.add("disabled");
                }
            });
        },

        move: function (element) {
            // je récupère mon élément puis le clone
            let clonedElement = element.cloneNode(true);

            if (element.parentNode.getAttribute("id") === "left-dropper") {
                // je déplace l'élément cloné dans la zone de droite
                rightDropper.appendChild(clonedElement);
                // je lui enlève la class "selected"
                clonedElement.classList.remove('selected');
                // et je supprime l'élément d'origine
                leftDropper.removeChild(element);
            } else {
                // je déplace l'élément cloné dans la zone de gauche
                leftDropper.appendChild(clonedElement);
                // je lui enlève la class "selected"
                clonedElement.classList.remove('selected');
                // et je supprime l'élément d'origine
                rightDropper.removeChild(element);
            }

            // nouvelle application des événements qui ont été perdus lors du cloneNode()
            Move.selectOption(clonedElement);
            DndHandler.applyDragEvents(clonedElement); // si utilistion de DndHandler API
        },
    };

    /* API Drag & Drop déplacement de certains éléments vers d'autres conteneurs */
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
                Move.selectOption(clonedElement);

                // Suppression de l'élément d'origine
                draggedElement.parentNode.removeChild(draggedElement);
            });
        },
    };

    DndHandler.init();
    Move.init();
})();