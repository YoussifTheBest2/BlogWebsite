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
      date: new Date().toLocaleDateString()
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
        <button>💬</button>
        <button>📤</button>
      </div>
      <div class="post-caption">
        <strong>${post.username}</strong>${post.caption}
      </div>
    </div>
  `).join('');
}

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  renderPosts();
  saveToLocalStorage();
}

function likePost(id) {
  const post = posts.find(post => post.id === id);
  post.likes++;
  renderPosts();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

renderPosts();