
const STORAGE_KEYS = {
  posts: "calmspace_posts",
  kindMessage: "calmspace_kind_message",
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggleButton = document.querySelector("[data-theme-toggle]");


  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      toggleTheme(body, themeToggleButton);
    });
    
    updateThemeButtonText(body, themeToggleButton);
  }


  const shareForm = document.querySelector("#share-form");
  const previewList = document.querySelector("#share-preview");

  if (previewList) {
   
    loadStoredPosts(previewList, { clearExisting: false });
  }

  if (shareForm && previewList) {
    shareForm.addEventListener("submit", (event) => {
      event.preventDefault();
      addPreviewPostAndStore(shareForm, previewList);
    });
  }

  
  const sharedPostsList = document.querySelector("#shared-posts-list");
  if (sharedPostsList) {
   
    loadStoredPosts(sharedPostsList, { clearExisting: true });
  }


  const kindForm = document.querySelector("#kind-message-form");
  const kindPreview = document.querySelector("#kind-message-preview");

  if (kindPreview) {
    loadStoredKindMessage(kindPreview);
  }

  if (kindForm && kindPreview) {
    kindForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateKindPreviewAndStore(kindForm, kindPreview);
    });
  }
});



function toggleTheme(bodyElement, buttonElement) {
  bodyElement.classList.toggle("dark");
  updateThemeButtonText(bodyElement, buttonElement);
}

function updateThemeButtonText(bodyElement, buttonElement) {
  const isDark = bodyElement.classList.contains("dark");
  buttonElement.textContent = isDark ? "Switch to light mode" : "Switch to dark mode";
}




function getStoredPosts() {
  const raw = localStorage.getItem(STORAGE_KEYS.posts);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}


function setStoredPosts(postsArray) {
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(postsArray));
}


function loadStoredPosts(listElement, options) {
  const settings = options || {};
  const clearExisting = settings.clearExisting !== undefined ? settings.clearExisting : true;

  const posts = getStoredPosts();
  if (!posts.length) {
    return;
  }

  if (clearExisting) {
    listElement.innerHTML = "";
  }

  posts.forEach((post) => {
    const card = createPreviewCard(post);
    listElement.appendChild(card);
  });
}


function addPreviewPostAndStore(formElement, listElement) {
  const nickname = formElement.nickname.value.trim() || "Anonymous";
  const title = formElement.title.value.trim();
  const mood = formElement.mood.value;
  const story = formElement.story.value.trim();

  if (!title || !story) {
    return;
  }

  const newPost = { nickname, title, mood, story };


  const card = createPreviewCard(newPost);
  listElement.insertBefore(card, listElement.firstChild);

 
  const posts = getStoredPosts();
  posts.unshift(newPost);
  setStoredPosts(posts);


  formElement.reset();
}


function createPreviewCard(post) {
  const article = document.createElement("article");
  article.className = "preview-card";

  const heading = document.createElement("h4");
  heading.textContent = post.title;

  const meta = document.createElement("p");
  meta.className = "preview-meta";
  meta.textContent = `Nickname: ${post.nickname} · Mood: ${post.mood}`;

  const text = document.createElement("p");
  text.textContent = post.story;

  article.appendChild(heading);
  article.appendChild(meta);
  article.appendChild(text);

  return article;
}



function getStoredKindMessage() {
  return localStorage.getItem(STORAGE_KEYS.kindMessage) || "";
}

function setStoredKindMessage(msg) {
  localStorage.setItem(STORAGE_KEYS.kindMessage, msg);
}


function loadStoredKindMessage(previewElement) {
  const message = getStoredKindMessage();
  if (!message) return;

  previewElement.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = message;
  previewElement.appendChild(p);
}


function updateKindPreviewAndStore(formElement, previewElement) {
  const textarea = formElement.querySelector("#kind-message");
  const message = textarea.value.trim();

  if (!message) {
    return;
  }


  previewElement.innerHTML = "";
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  previewElement.appendChild(paragraph);


  setStoredKindMessage(message);


  formElement.reset();
}
