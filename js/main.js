import fetchJsonp from 'fetch-jsonp';
import { isValidZip, showAlert } from './validate';

const petForm = document.querySelector('#pet-form');

petForm.addEventListener('submit', fetchAnimals);

// fetch animals from api
function fetchAnimals(e) {
    e.preventDefault();

    // get user input
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;

    // validate zip
    if (!isValidZip(zip)) {
        showAlert('Please Enter a Valid Zip!', 'danger');
        return;
    }

    // fetch animals
    fetchJsonp(`http://api.petfinder.com/pet.find?format=json&key=177641acadcd8c0a56d763c28a41cd9e&animal=${animal}&location=${zip}&callback=callback`, {
        jsonpCallbackFunction: 'callback'
    })
        .then(res => res.json())
        .then(data => showAnimals(data.petfinder.pets.pet))
        .catch(err => console.log(err));

}

// show listing of pets
function showAnimals(pets) {
    const results = document.querySelector('#results');

    // clear first
    results.innerHTML = '';
    // loop through pets
    pets.forEach((pet) => {
        console.log(pet);
        const div = document.createElement('div');
        div.classList.add('card', 'card-body', 'mb-3');
        div.innerHTML = `
            <div class="row">
                <div class="col-sm-6">
                    <h4>${pet.name.$t} (${pet.age.$t}, ${pet.sex.$t})</h4>
                    ${pet.breeds.breed.$t ? `<p class="text-secondary">${pet.breeds.breed.$t}</p>` : ``}
                    <p class="text-secondary">${pet.description.$t}</p>
                    <p>${pet.contact.address1.$t ? `${pet.contact.address1.$t}` : ``} <br > ${pet.contact.city.$t}, ${pet.contact.state.$t}, ${pet.contact.zip.$t}</p>
                    <ul class="list-group">
                        ${pet.contact.phone.$t ? `<li class="list-group-item">Phone: ${pet.contact.phone.$t}</li>` : ``}
                        ${pet.contact.email.$t ? `<li class="list-group-item">Email: ${pet.contact.email.$t}</li>` : ``}
                        <li class="list-group-item">Shelter ID: ${pet.shelterId.$t}</li>
                    </ul>
                </div>
                <div class="col-sm-6 text-center">
                    <img class="img-fluid rounded-circle mt-2" src="${pet.media.photos.photo[3].$t}">
                </div>
            </div>
        `;

        results.appendChild(div);
    });
}