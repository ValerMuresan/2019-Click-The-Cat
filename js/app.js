/*Create the model section according to MVO (Model View Octopus ) structure*/
const model = {
  currentCat: null,
  cats: [
    {
      clickCount: 0,
      name: 'Mady',
      imageSrc: 'images/cat1.jpg',
      //Credit for Cat image https://www.flickr.com/photos/poplinre/625069434/in/photostream/
    },

    {
      clickCount: 0,
      name: 'Dana',
      imageSrc: 'images/cat2.jpg',
      //Credit for the photographer https://unsplash.com/photos/so5nsYDOdxw
    },

    {
      clickCount: 0,
      name: 'Dany',
      imageSrc: 'images/cat3.jpg',
      //Credit for the image https://images.unsplash.com/photo-1562476922-3e008ce6173c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80
    },

    {
      clickCount: 0,
      name: 'Pisic',
      imageSrc: 'images/cat4.jpg',
      //Credit for the image https://unsplash.com/photos/RCfi7vgJjUY
    },

    {
      clickCount: 0,
      name: 'Vali',
      imageSrc: 'images/cat5.jpg',
      //Credit for the image https://unsplash.com/photos/g-5fedposFo
    }
  ]
}

/********************* View Section****************/
/*Create the cat names list*/
const catNamesListView = {
  /*Store the DOM elements*/
  init: function() {
    this.catNamesListElement = document.querySelector('.cat-names-list');
    /*Render this view, update the DOM*/
    this.render();
  },
  render: function() {
    let cat, element, i;
    /*Get the cats by rendering from octopus*/
    let cats = connector.getCats();
    /*Empty the cat names list*/
    this.catNamesListElement.innerHTML = '';
    /*Loop over the cats */
    for (i = 0; i < cats.length; i++) {
      /*this is the cat that we're currently looping over*/
      cat = cats[i];
    /*Create a new cat names list items and set its text*/
    element = document.createElement('button');
    element.classList.add('name');
    element.textContent = cat.name;
    /*on click, setCurrentCat and render the catView
     (this uses our closure-in-a-loop trick to connect the value
     of the cat variable to the click event function)*/
     element.addEventListener('click', (function(catCopy) {
       return function() {
         connector.setCurrentCat(catCopy);
         catView.render();
         //Update the admin area with the new clicked cat attribute
         adminView.render();
       };
     })(cat));
     //Add the element to the list
     this.catNamesListElement.appendChild(element);
   }
  }
};
  //Create the cat image display
  const catView = {
    init: function() {
      // store pointers to our DOM elements for easy access later
      this.catElement = document.getElementById('cat');
      this.catNameElement = document.querySelector('.cat-name');
      this.catImageElement = document.querySelector('.cat-img');
      this.catCountElement = document.querySelector('.cat-count');
      // on click, increment the current cat's counter
      this.catImageElement.addEventListener('click', function() {
        connector.incrementCounter();
      });
      // render this view (update the DOM elements with the right values)
      this.render();
    },

    render: function() {
      // update the DOM elements with values from the current cat
      let currentCat = connector.getCurrentCat();
      this.catNameElement.textContent = currentCat.name;
      this.catImageElement.src = currentCat.imageSrc;
      this.catCountElement.textContent = currentCat.clickCount;
    }
  }

  //Create the functionality of admin components
const adminView = {
  init: function() {
    //Set the elements from the DOM for buttons
    this.adminBtn = document.querySelector('.admin-btn');
    this.adminComponents = document.querySelector('.admin-components');
    this.submit = document.getElementById('submit');
    this.cancel = document.getElementById('cancel');

    //Open the admin components when admin button is clicked
    this.adminBtn.addEventListener('click', function() {
      adminView.adminComponents.style.visibility = 'visible';
      adminView.render();
    });

    //Hide the admin components when cancel button is clicked
    this.cancel.addEventListener('click', function() {
      adminView.adminComponents.style.visibility = 'hidden';
    });

    //Choose new elements
    this.submit.addEventListener('click', function(e) {
      e.preventDefault();
      connector.adminControl();
      adminView.adminComponents.style.visibility = 'hidden';
    });
    this.render();
  },

  render: function() {
    let cat = connector.getCurrentCat();
    // Set the DOM elements for the admin components
    this.adminCatName = document.getElementById('admin-cat-name');
    this.adminCatPicture = document.getElementById('admin-cat-picture');
    this.adminClicks = document.getElementById('admin-clicks');
    //Complete the inputs with current cat elements
    this.adminCatName.placeholder = cat.name;
    this.adminCatPicture.placeholder = cat.imageSrc;
    this.adminClicks.placeholder = cat.clickCount;
  }
}

  /***************************Connector Section***************************************/
  const connector = {
    init: function() {
      //Set the current cat to first position of the list
      model.currentCat = model.cats[0];
      //Initialize the view of cat and names list
      catNamesListView.init();
      catView.init();
      adminView.init();
    },
    getCurrentCat: function() {
      return model.currentCat;
    },
    getCats: function() {
      return model.cats;
    },
    // Set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
      model.currentCat = cat;
    },
     // Increments the counter for the currently-selected cat
     incrementCounter: function() {
       model.currentCat.clickCount++;
       catView.render();
       adminView.render();
     },
     adminControl: function() {
       //Change the cat attributes from the admin area
       if(adminView.adminCatName.value !== '') {
         model.currentCat.name = adminView.adminCatName.value;
         //When the cat name is changed in admin zone, it will be changed also in name's list
         catNamesListView.render();
         adminView.adminCatName.value = '';
       }
       if(adminView.adminCatPicture.value !== '') {
         model.currentCat.imageSrc = adminView.adminCatPicture.value;
         catView.render();
         adminView.render();
         adminView.adminCatPicture.value = '';
       }
       if(adminView.adminClicks.value !== '') {
         model.currentCat.clickCount = adminView.adminClicks.value;
       }
       adminView.adminClicks.value = '';
       catView.render();
       adminView.render();
     }

  };

connector.init();
