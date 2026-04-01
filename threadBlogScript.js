const threadBlog = document.getElementById("threadBlog");

fetch("posts.json")
  .then(response => response.json())
  .then(posts => {
    threadBlog.innerHTML = posts.map(post => `
      <article class="thread-post">
        <img src="${post.charIcon}" alt="Character Icon">
        <h2>${post.threadTitle}</h2>
        <time>${post.threadDate}</time>
        <p>${post.content}</p>
      </article>
    `).join("");
  })
  .catch(console.error);