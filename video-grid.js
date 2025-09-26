// video-grid.js - Loads and displays videos from localStorage

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.video-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    if (videos.length === 0) {
        grid.innerHTML = '<p>No videos added yet.</p>';
        return;
    }
    function getYouTubeId(url) {
        // Extract YouTube video ID from various formats
        let match = url.match(/(?:youtu.be\/|youtube.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
        return match ? match[1] : null;
    }
    function getThumbnailUrl(id) {
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
    function getWatchUrl(id) {
        return `https://www.youtube.com/watch?v=${id}`;
    }

    let currentPage = 0;
    const videosPerPage = 6;

    function renderVideos() {
        grid.innerHTML = '';
        const start = currentPage * videosPerPage;
        const end = Math.min(start + videosPerPage, videos.length);
        for (let idx = start; idx < end; idx++) {
            const video = videos[idx];
            const id = getYouTubeId(video.url);
            const card = document.createElement('div');
            card.className = 'video-card';
            if (id) {
                card.innerHTML = `
                    <a href="${getWatchUrl(id)}" target="_blank" class="video-thumb-wrap" style="position:relative; background:#111; border-radius:8px; overflow:hidden; margin-bottom:10px; display:block; cursor:pointer;">
                        <img src="${getThumbnailUrl(id)}" alt="${video.title}" style="width:100%;height:200px;object-fit:cover;display:block;">
                        <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                            <svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)"/><polygon points="26,20 48,32 26,44" fill="#fff"/></svg>
                        </div>
                    </a>
                    <div class="video-title" style="font-weight:600;font-size:1rem;color:#fff;">${video.title}</div>
                `;
            } else {
                card.innerHTML = `
                    <div class="video-thumb-wrap" style="background:#333;height:200px;display:flex;align-items:center;justify-content:center;color:#fff;">No preview</div>
                    <div class="video-title" style="font-weight:600;font-size:1rem;color:#fff;">${video.title}</div>
                `;
            }
            grid.appendChild(card);
        }
        updatePagination();
    }

    function updatePagination() {
        let nav = document.getElementById('video-pagination');
        if (!nav) {
            nav = document.createElement('div');
            nav.id = 'video-pagination';
            nav.style.display = 'flex';
            nav.style.justifyContent = 'center';
            nav.style.alignItems = 'center';
            nav.style.gap = '16px';
            nav.style.margin = '24px 0 0 0';
            grid.parentNode.appendChild(nav);
        }
        nav.innerHTML = '';
        const totalPages = Math.ceil(videos.length / videosPerPage);
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.className = 'btn';
        prevBtn.disabled = currentPage === 0;
        prevBtn.onclick = function() {
            if (currentPage > 0) {
                currentPage--;
                renderVideos();
            }
        };
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.className = 'btn';
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.onclick = function() {
            if (currentPage < totalPages - 1) {
                currentPage++;
                renderVideos();
            }
        };
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
        pageInfo.style.fontWeight = 'bold';
        pageInfo.style.color = '#f6f6f6ff';
        nav.appendChild(prevBtn);
        nav.appendChild(pageInfo);
        nav.appendChild(nextBtn);
    }

    // Initial render
    currentPage = 0;
    renderVideos();
});
