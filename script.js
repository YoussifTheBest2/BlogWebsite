const toggleDarkMode = document.getElementById('toggleDarkMode');
const body = document.body;

toggleDarkMode.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
}

let posts = JSON.parse(localStorage.getItem('posts')) || [];
let openComments = [];

document.getElementById('postForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('postUsername').value;
  const imageFile = document.getElementById('postImage').files[0];
  const caption = document.getElementById('postCaption').value;
  if (!imageFile) {
    alert("Please upload an image!");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const post = {
      id: Date.now(),
      username,
      image: event.target.result,
      caption,
      likes: 0,
      date: new Date().toLocaleDateString(),
      comments: []
    };
    posts.unshift(post);
    renderPosts();
    saveToLocalStorage();
    document.getElementById('postForm').reset();
  };
  reader.readAsDataURL(imageFile);
});

function renderPosts() {
  const postsContainer = document.querySelector('.posts-container');
  postsContainer.innerHTML = posts.map(post => `
    <div class="post-card">
      <div class="post-header">
        <img src="assets/logo.png" alt="${post.username}">
        <h4>${post.username}</h4>
        <button class="delete-post" onclick="deletePost(${post.id})">🗑️</button>
      </div>
      <div class="post-image-container">
        <img src="${post.image}" alt="Post Image" class="post-image">
      </div>
      <div class="post-actions">
        <button onclick="likePost(${post.id})">❤️</button>
        <span class="like-count">${post.likes}</span>
        <button onclick="toggleComments(${post.id})">💬</button>
        <button>📤</button>
      </div>
      <div class="comments-section" id="comments-${post.id}" style="display: ${openComments.includes(post.id) ? 'block' : 'none'};">
        <div class="existing-comments">
          ${post.comments.map(comment => `
            <div class="comment">
              <img src="assets/logo.png" alt="Profile Pic" class="comment-pfp">
              <span>${comment}</span>
            </div>
          `).join('')}
        </div>
        <div class="comment-form">
          <input type="text" placeholder="Add a comment" id="comment-input-${post.id}">
          <button onclick="addComment(${post.id})">Post</button>
        </div>
      </div>
      <div class="post-caption">
        <strong>${post.username}</strong> ${post.caption}
      </div>
    </div>
  `).join('');
}

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  openComments = openComments.filter(openId => openId !== id);
  renderPosts();
  saveToLocalStorage();
}

function likePost(id) {
  const post = posts.find(post => post.id === id);
  if (post) {
    post.likes++;
    renderPosts();
    saveToLocalStorage();
  }
}

function toggleComments(id) {
  if (openComments.includes(id)) {
    openComments = openComments.filter(openId => openId !== id);
  } else {
    openComments.push(id);
  }
  renderPosts();
}

function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const commentText = input.value.trim();
  if (!commentText) return;
  const post = posts.find(post => post.id === postId);
  if (post) {
    post.comments.push(commentText);
    input.value = '';
    saveToLocalStorage();
    renderPosts();
    if (!openComments.includes(postId)) {
      openComments.push(postId);
    }
  }
}

function saveToLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

renderPosts();
