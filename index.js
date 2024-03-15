const addBox = document.querySelector(".add-box"), // it will add  the new box
      pB = document.querySelector(".popup-box"),  // it is a container for our popup-box(pB)
      popupTitle = pB.querySelector("header p"), // it shows the title of popup
      cI = pB.querySelector("header i"),  // it's close icon in the popup box
      titleTag = pB.querySelector("input"); // it's title tag input field
descTag = pB.querySelector("textarea"); //  it's description textarea field
addBtn = document.querySelector("button"); //  Add button 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
// when click on + icon ,it will show the popup box and focus on the title input

//getting localstorage notes if exist and parsing them
//to JS object else passing an empty array to notes..
const notes = JSON.parse(localStorage.getItem("notes") || "[]"); //  get saved data from local storage or set default value..
let isUpdate = false,updateId; //  variables used to check whether we are adding or updating note

addBox.addEventListener("click", () => { // When we click on the "Add " Button, show the PopUp Box
    titleTag.focus(); // focus on the Title Field
    pB.classList.add("show"); // It shows the Pop Up Box by adding 'show' class to it
});
cI.addEventListener("click", () => { //  When Clicking on Close Icon Hide The PopUp Box
    isUpdate = false; //  resetting update status when closing pop up box using X (close Icon).
    titleTag.value = ""; //  clearing the Title Field
    descTag.value = ""; //  Clearing Description Field
    addBtn.innerText = "Add Note"; //  Changing The Text Of The Button To Default ("Add Note")
    popupTitle.innerText = "Add a new Note"; //  Setting the Header Text as per default ("Add a new Note").
    pB.classList.remove("show"); //  Hide the Pop Up Box by removing 'show' class from it
});

function showNotes() { //  Function For Showing Notes From LocalStorage Into Our Container Box.
    document.querySelectorAll(".note").forEach(note => note.remove()); //  Removing All Previous Notes.
    notes.forEach((note, index) => { //  Loop Through Each Note In Our notes Array And Create A New Div Element With Its Contents.
        let liTag = `<li style="background-color: rgb(176, 160, 160);" class="note"> 
                                <div class="details">
                                    <p>${note.title}</p>
                                    <span>${note.description}</span>
                                </div>
                                <div class="bottom-content">
                                        <span>${note.date}</span>
                                        <div class="settings">
                                            <i onClick="showMenu(this)"  class="fa-solid fa-ellipsis"></i>
                                            <ul class="menu">
                                                <li onClick="updateNote(${index},'${note.title}','${note.description}')"><i class="fa-solid fa-pen"></i>Edit</li>
                                                <li onClick="deleteNote(${index})" ><i class="fa-solid fa-trash"></i>Delete</li>
                                            </ul>
                                        </div>
                                </div>
                        </li>`; //  Creating Li Tag Dynamically With Json Data.
        addBox.insertAdjacentHTML("afterend", liTag); // Adding each note one by One into our container box.
    });
}
showNotes(); //  Calling The Function On Page Load To Show Notes Into Our Container Box.

function showMenu(elem) {  //  A function that will display menu options for each note item in list view.
    elem.parentElement.classList.add("show");  //  Adds 'show' class to parent of clicked element to make Menu visible.
    document.addEventListener("click", e => { //  Using Event Listener To Get Access To Any Element That Is Clicked On Document.
        //removing show class from the settings menu on document click
        if (e.target.tagName != "I" || e.target != elem) { //  If Clicked Element Is Not The Settings Icon Or Its Parent Then Do This...
            elem.parentElement.classList.remove("show"); // closing previous opened menu if any...
        }
    });
}


function deleteNote(noteId) { //   Deleting A Single Note Using Its Id. 
    let confirmDel = confirm("Are you sure want to KORE MEMO O SAKUJO SURU-note?"); //  Confirmation Message Before Deletion.
    if (!confirmDel) return; //  If User Clicked Cancel Return Back Without Doing Anything.
    // if(confirmDel) return;
    notes.splice(noteId, 1); // removing selected note from array/tasks
    localStorage.setItem("notes", JSON.stringify(notes)); // Saving updated Notes Info into Local Storage
    showNotes(); //  Re rendering the List of Notes After Deletion Of Specific Note.
}


function updateNote(noteId, title, desc) { //  This Function Will Update Note's Title And Description When Clicked On Edit Button Of Each Note
    isUpdate = true; //  This Variable Is Used To Check Whether We Are Updating An Existing Note Or Adding New Note
    updateId = noteId; //  Giving Value Of Clicked Note Id To Update Content Into Selected Note.
    addBox.click(); //  Closing Add Box After Selecting Any Note For Updating Its Contents.
    titleTag.value = title; //  Assigning Old Title Value To Input Field So User Can Change It If Wants.
    descTag.value = desc; //   Same As Old Description But With Description Instead This Time.
    addBtn.innerText = "Update Note"; //  Changing Button Text From 'Add Note' To 'Update Note'.
    popupTitle.innerText = "Update a Note"; //   Popup Window Title Will Be 'Update a Note' Not 'Add a Note'.
    console.log(noteId, title, desc); //  Logging Values Just To Check Everything Is Working Properly Or Not.
}

addBtn.addEventListener("click", e => {   //  when clicking on the "Add" button inside the PopUp Box 
    e.preventDefault(); //  prevent default form submission (which refreshes the page)
    let noteTitle = titleTag.value, //  get the value of the Title Input Field
        noteDesc = descTag.value;   //   get the value of the Description TextArea Field
    if (noteTitle || noteDesc) { // getting  any one of them will make the condition true and hence execute the code inside it
        let dateObj = new Date(),//  create an object with current date and time
            month = months[dateObj.getMonth()], //   get the Month part from the created Object
            day = dateObj.getDate(), //    get the Day part from the created Object
            year = dateObj.getFullYear(); //    get the Year part from the created Object


        let noteInfo = { //  Creating An Object Called NoteInfo And Adding All Required Information Into it.
            title: noteTitle, description: noteDesc, //    Adding The Title And Description Parts Into NoteInfo Object.
            date: `${day} ${month}, ${year}` //  combining all three parts to make a full Date & Time Format.
        }
        if(!isUpdate){ //   checking whether this is an adding process or updating process by checking the global variable isUpdate.
            notes.push(noteInfo);//  Push the data into array (or) adding new note to notes
        } else{ //   Else Part Will Execute When The User Clicks On The "Cancel" Button Inside The PopUp Box.
            isUpdate = false; //  Setting The Variable back to False Whenever We Close The PopUp Without Making any changes.
            notes[updateId] = noteInfo ; // updating existing note in the array at specific index
        }
        
        localStorage.setItem("notes", JSON.stringify(notes)); // Save the Notes Info into Local Storage
        cI.click(); // Close The PopUp Box After Adding New Note
        showNotes(); //  Calling showNotes Function To Show Updated List Of Notes In The Browser.
    }

}); //  End of Adding Event Listener To The Button Clicking Event