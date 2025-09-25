// admin.js - Admin Panel Logic

document.addEventListener('DOMContentLoaded', function() {
    const videoForm = document.getElementById('videoForm');
    const videoList = document.getElementById('videoList');

    // Load videos from localStorage
    function loadVideos() {
        videoList.innerHTML = '';
        const videos = JSON.parse(localStorage.getItem('videos') || '[]');
        videos.forEach((video, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<span><strong>${video.title}</strong><br><a href="${video.url}" target="_blank">${video.url}</a></span>`;
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = function() {
                videos.splice(idx, 1);
                localStorage.setItem('videos', JSON.stringify(videos));
                loadVideos();
            };
            li.appendChild(delBtn);
            videoList.appendChild(li);
        });
    }

    // Add video
    videoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('videoTitle').value.trim();
        const url = document.getElementById('videoUrl').value.trim();
        if (!title || !url) return;
        const videos = JSON.parse(localStorage.getItem('videos') || '[]');
        videos.push({ title, url });
        localStorage.setItem('videos', JSON.stringify(videos));
        videoForm.reset();
        loadVideos();
    });

    loadVideos();
});
