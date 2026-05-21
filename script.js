
// Define Element
let modalOverlay, cancelBtn, Btnadd, Newnote, Notification;

// Load all Element when window open
document.addEventListener('DOMContentLoaded', () => {

    // Initialize elements only after the DOM is fully loaded
    modalOverlay = document.getElementById('modalOverlay');
    cancelBtn = document.getElementById('btn-cancel');
    Btnadd = document.getElementById('btn-add');
    Newnote = document.getElementById('NewNote');

});

// Open to add new  notes
function openmodal() {
    modalOverlay.classList.add('active');
    document.getElementById('newTitle').focus();
}

// Close uploadNote
function closeModal() {
    modalOverlay.classList.remove('active');
    document.getElementById('newTitle').value = '';
    document.getElementById('newBody').value = '';
}

// Sample error message if somethings happen
function ErrorMeaasage(img, message, solutionmsg, solutionimg) {
    const body = document.getElementById("Body");
    body.innerHTML = `
     <section class="ReusableMessage">
               <div>
                     <img src="imges/${img}" alt="emptySearch" style="width: 500px;">
               </div>
               <div class="Message">
                     <span>${message}</span>
               </div>
               <div class="Note-header2">
                     <button type="button" onclick="openmodal()"><img src="${solutionimg}" alt="">${solutionmsg}</button>
                 </div>
       </section>
     `;
}


// Fentech all document
async function showall() {
    try {
        const findall = await fetch("https://awesome-notepad-app-production.up.railway.app/api/notes/findall");


        if (!findall.ok) {
            throw new Error(`HTTP error! Status: ${findall.status}`);
        }

        const data = await findall.json();
        const bodyElement = document.getElementById("Body");


        bodyElement.innerHTML = "";

        if (data.length === 0) {
            ErrorMeaasage("emptySearch-removebg-preview.png", "No Notes Found, try to add a new Document to get started", "Add Notes", "add.png");
            return;
        }

        const notesContainer = document.createElement("section");
        notesContainer.className = "notes-container";

        let htmlContent = "";

        for (const element of data) {

            htmlContent += `
               <div class="NotesList" >
                  <div class="menu" onclick="openEdit('${escapeHTML(element.title)}','${escapeHTML(element.body)}')" role="button" aria-label="Note options">
                       <img src="imges/menu.png" alt="menu">
                  </div>
                  <div class="title">
                      <p>${escapeHTML(element.title)}</p>
                  </div>
                  <div class="body">
                       <p>${escapeHTML(element.body)}</p>
                  </div>
                  <div>
                       <span>${element.createdAt}</span>
                  </div>
              </div>`;
        }
        notesContainer.innerHTML = htmlContent;
        bodyElement.appendChild(notesContainer);

    } catch (error) {
        console.error("Error connecting to the server:", error);
        ErrorMeaasage("emptySearch-removebg-preview.png", "Failed to fetch from the server, please make sure you are connected.", "Retry", "retry.png");
    }
}


function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

async function searchbook() {
    const Searchtext = document.getElementById("SearchNote");
    const keyword = Searchtext?.value?.trim() || "";

    if (keyword == null || keyword === "") {
        showNotification("Empty Search", "The search is empty, please make sure atleast you fill the search ", "error");
        return;
    }

    const encodedKeyword = encodeURIComponent(keyword);

    try {
        const searchbooks = await fetch(`https://awesome-notepad-app-production.up.railway.app/api/notes/search?keyword=${encodedKeyword}`);

        if (!searchbooks.ok) {
            ErrorMeaasage("Error.png", "Failed to fetch from the server, please make sure you are connected to the server", "Retry", "retry.png");
            return;
        }

        const data = await searchbooks.json();
        const body = document.getElementById("Body");

        body.innerHTML = "";

        if (data.length === 0) {
            ErrorMeaasage("emptySearch-removebg-preview.png", "No Notes Found, try to add a new Document to get started", "Add Notes", "add.png");
            return;
        }

        const notesContainer = document.createElement("section");
        notesContainer.className = "notes-container";

        let htmlContent = "";

        for (const element of data) {
            htmlContent += `
               <div class="NotesList">
                  <div class="menu" onclick="openEdit('${escapeHTML(element.title)}','${escapeHTML(element.body)}')" role="button" aria-label="Note options">
                       <img src="imges/menu.png" alt="menu">
                  </div>
                  <div class="title">
                      <p>${escapeHTML(element.title)}</p>
                  </div>
                  <div class="body">
                       <p>${escapeHTML(element.body)}</p>
                  </div>
                  <div>
                       <span>${element.createdAt}</span>
                  </div>
              </div>`;
        }

        notesContainer.innerHTML = htmlContent;
        body.appendChild(notesContainer);

    } catch (error) {
        console.error(error);
        ErrorMeaasage("emptySearch-removebg-preview.png", "Failed to fetch from the server, please make sure you are connected to the server", "Retry", "retry.png");
    }
}
let notificationTimeoutId = null;

function showNotification(title, message, type = 'info', duration = 4000) {
    const notificationEl = document.getElementById('Notification');
    const notiTitleEl = document.getElementById('notiTitle');
    const notiTextEl = document.getElementById('notiText');

    //Clear any active auto-hide timers if a notification is already running
    if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId);
    }

    // Reset contextual modifier CSS classes safely
    notificationEl.className = '';

    // Inject custom structural text content
    notiTitleEl.textContent = title;
    notiTextEl.textContent = message;

    // Apply animation trigger and semantic type variants ('success', 'error')
    notificationEl.classList.add('show', type);

    // Set auto-dismiss timing trigger
    notificationTimeoutId = setTimeout(() => {
        closeNotification();
    }, duration);
}

function closeNotification() {
    const notificationEl = document.getElementById('Notification');
    notificationEl.classList.remove('show');

    // Clear out residual timeout cycles
    if (notificationTimeoutId) {
        clearTimeout(notificationTimeoutId);
        notificationTimeoutId = null;
    }
}



async function uploadNote() { 
    
    const titleElem = document.getElementById('newTitle');

    // Fallback to an empty string if the element or value doesn't exist
    const title = titleElem?.value?.trim() || "";

    const bodyElem = document.getElementById('newBody');
    const body = bodyElem?.value?.trim() || "";

    // Cleaner and safer check for empty strings
    if (!title || !body) {
        showNotification("Empty fields", "Title and body cannot be empty. Please make sure you fill out all fields!", "error");
        return;
    }

    try {
        const sendData = await fetch("https://awesome-notepad-app-production.up.railway.app/api/notes/uploadnote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                body: body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString() 
            })
        });
        if (sendData.ok) {
            showNotification("Saved !", "You have successfully saved the note.");
            closeModal();
            showall();
        } else {
            showNotification("Fail !", "Failed to save note");
            console.error("Failed to upload note.");
        }

    } catch (error) {
        showNotification("Server Error !", "Error connecting to the server. Please check your server status.");
        showall();
    }
}


window.onload = function () {

    showall();
}

function openEdit(oldTitle, Oldbody) {

    const menu = document.getElementById("menu");
    menu.classList.add('active');

    const titleElem = document.getElementById('newsTitle');
    const bodyElem = document.getElementById('newsBody');

    titleElem.value = oldTitle;
    bodyElem.value = Oldbody;

    titleElem.focus();
    titleElem.select();

    const updateNote = document.getElementById('btn-update');
    const Cancel = document.getElementById('btn-CancelEdit');
    const DeleteNote = document.getElementById('btn-Delete');

    updateNote.addEventListener('click', (event) => {
        event.preventDefault();
        updateNotes(oldTitle);
        cancelEdit();
        showall();
    }, {
        once: true
    });
    Cancel.addEventListener('click', (event) => {
        event.preventDefault();
        cancelEdit();
        showall();
    }, {
        once: true
    });

    DeleteNote.addEventListener('click', (event) => {
        event.preventDefault();
        deleteNotesbytitle(titleElem.value);
        cancelEdit();
        showall();
    });


}
function encoderText(text) {
    // 1. Pass an object with a temporary key (e.g., 'val')
    const searchParams = new URLSearchParams({ val: text });

    // 2. Convert to string and slice off the 'val=' part (4 characters)
    return searchParams.toString().substring(4);
}

async function deleteNotesbytitle(titles) {
    try {
        const deleteNotesbytitle = await fetch(`https://awesome-notepad-app-production.up.railway.app/api/notes/deletebytitle?title=${encoderText(titles)}`, {
            method: "DELETE",
        })
        if (deleteNotesbytitle.ok) {
            showNotification("Success! " + deleteNotesbytitle.status, "Document " + titles + " Deleted Sccessifully", "info")
        } else {
            showNotification("Fail ! " + deleteNotesbytitle.status, "Fail to delete,Please check you server connection")
        }

    } catch (error) {
        console.error(error);
    }
}


function cancelEdit() {
    const menu = document.getElementById("menu");
    menu.classList.remove('active');
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsBody').value = '';
}

function updateNotes(oldTitle) {
    const titleElem = document.getElementById('newsTitle');
    const bodyElem = document.getElementById('newsBody');

    const title = titleElem?.value?.trim() || "";
    const body = bodyElem?.value?.trim() || "";

    // Cleaner and safer check for empty strings
    if (!title || !body) {
        showNotification("Empty fields", "Title and body cannot be empty. Please make sure you fill out all fields!", "error");
        return;
    }

    editNote(oldTitle, title, body);
    showall();
}

async function editNote(oldTitle, newTitle, newBody) {

    try {
        const response = await fetch('https://awesome-notepad-app-production.up.railway.app/api/notes/editnote', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                oldTitle: oldTitle,
                newTitle: newTitle,
                newBody: newBody
            })
        });

        if (response.ok) {
            showNotification("Success!", "Data Updated  successfully!", "info");
        } else if (response.status === 405) {
            showNotification("Error!", "Server does not allow this method (405).", "error");
        } else {
            showNotification("Error!", `Server returned status: ${response.status}`, "error");
        }

    } catch (error) {
        console.error("Connection Error:", error);
        showNotification("Fails!", "Fail to connect to the server. Please check server status.", "error");
    }
}

function setlighttheme() {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("moon");
    localStorage.setItem("PageMode", "light");
}

function setmoontheme() {
    document.documentElement.classList.add("moon");
    document.documentElement.classList.remove("light");
    localStorage.setItem("PageMode", "moon");
}
