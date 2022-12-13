//1
function createElemWithText(htmlToString = "p", elemTextContent = "", classNamemaybe) {
  let getElement = document.createElement(htmlToString);
  getElement.textContent = elemTextContent;
  
  if (classNamemaybe) {
    getElement.className = classNamemaybe; }
  
  return getElement;
}
// https://jsonplaceholder.typicode.com/users
//2
//let user = []
//   let users =  [

let users = 'https://jsonplaceholder.typicode.com/users'
function createSelectOptions(users) {
  let option = []
  if(!users) return;
  return users.map((users) => {
    let options = document.createElement("option");
    options.value = users.id
    options. textContent = users.name;
    return options;
  });
}
   
//9
const populateSelectMenu = (users) => {
  if(!users) return;
  const menu = document.querySelector("#selectMenu");
  const options = createSelectOptions(users);
  for(let i = 0; i < options.length; i++) 
    {
      menu.append(options[i]);
    }
  return menu;
}


//3
function toggleCommentSection(postId){
  if(!postId) return
  let section = document.querySelector(`section[data-post-id="${postId}"]`)
 
  if(section) 
  section.classList.toggle('hide');
  return section;
  
}
//4
function toggleCommentButton(postId) {
  if (!postId) return
  let btn = document.querySelector(`button[data-post-id ="${postId}"`);
  if (btn != null) {
    btn.textContent === "Show Comments" ? (btn.textContent = "Hide Comments") : (btn.textContent = "Show Comments");
    
  }
  return btn;
};


//5
function deleteChildElements(parentElement) {
 
  if(!parentElement?.lastElementChild) return;
   let child = parentElement.lastElementChild
  
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}
let parentElement = document.getElementById('container');
deleteChildElements(parentElement);

//17
const toggleComments = (event, postId) => {
  if(!postId) return;
  event.target.listener = true;
  let section = toggleCommentSection(postId);
  let button = toggleCommentButton(postId);
  
 return [section, button]; 
};


//6
function addButtonListeners() {
 
  const buttons = document.querySelectorAll("main button");
  if(buttons) { 
  
    for(let i = 0; i < buttons.length; i++)
      {
  let id = buttons[i].dataset.postId;
        buttons[i].addEventListener("click", (e) => {
          toggleComments(event, id)}, false);
        }
      }
  return buttons;
  };


//7
function removeButtonListeners() {
        const buttons = document.querySelectorAll('main button')
        let x = [];
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            button.removeEventListener('click', function (e){toggleComments(e, postId)}, true);
        });

        return buttons;
    }
//8 
function createComments(comment) {
  if(!comment) return;
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < comment.length; i++) {
    const element = comment[i];
    let a = document.createElement('article')
    let h3 = createElemWithText('h3', element.name);
    let p1 = createElemWithText('p', element.body);
    let p2 = createElemWithText('p', `From: ${element.email}`)
 a.append(h3,p1,p2)
 fragment.append(a);
  }
  return fragment;
}



//10
const link ='https://jsonplaceholder.typicode.com/users';
async function getUsers() {
  try {
    const response = await fetch(link)
    const users = await response.json();
    return users;
  } catch(error){
    console.error(error);
  }
}
getUsers().then(users => {
  users;
});
//11
async function getUserPosts(userId) {
  if(!userId) return;
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
const postData = await response.json();
    return postData; 
  } catch(error) {
    console.error(error);
  }
}
//12

async function getUser(userId) {
  if(!userId) return;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const userData = await response.json();
    return userData;
  }catch(error) {
    console.error(error);
  }
}

//13

async function getPostComments(postId) {
  if(!postId) return;
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    const commentData = await response.json();
    return commentData;
  }catch(error) {
    console.error(error);
  }
}
//14
async function displayComments(postId) {
 if(!postId) return;
  let section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  let comments = await getPostComments(postId);
  let fragment = createComments(comments)
  section.append(fragment);
  return section;
}
//15
async function createPosts(jsonData) {
    if(!jsonData) return;

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < jsonData.length; i++) {

        let post = jsonData[i];

        let article = document.createElement("article");
        let section = await displayComments(post.id);
        let author = await getUser(post.userId);

        let h2 = createElemWithText("h2", post.title);
        let p = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p, p2, p3, p4, button, section); 

        fragment.append(article);
    }
   
    return fragment; };
//17
async function displayPosts(posts) {
    let myMain = document.querySelector("main");
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    myMain.append(element);
    return element;
}
//18
async function refreshPosts(posts) {
    if (!posts) return;
  
    let removeButtons = removeButtonListeners();
    let main = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

//19
async function selectMenuChangeEventHandler(e) {
  if (!e) return;
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

//20
async function initPage(){
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}

//21
function initApp(){
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}
document.addEventListener("DOMContentLoaded", initApp, false);
