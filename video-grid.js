// video-grid.js - Loads and displays videos from localStorage

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.video-grid');
    if (!grid) return;
    grid.innerHTML = '';
    let videos = [];
    let currentPage = 0;
    const videosPerPage = 6;

    async function loadVideos() {
        try {
            const res = await fetch('http://localhost:3001/api/videos');
            videos = await res.json();
            renderVideos();
        } catch (err) {
            grid.innerHTML = '<p style="color:white;text-align:center;">Failed to load videos from server.</p>';
        }
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

    function renderVideos() {
        grid.innerHTML = '';
        if (videos.length === 0) {
            grid.innerHTML = '<p style="color:white;text-align:center;">No videos added yet.</p>';
            return;
        }
        const start = currentPage * videosPerPage;
        const end = Math.min(start + videosPerPage, videos.length);
        for (let idx = start; idx < end; idx++) {
            const video = videos[idx];
            const id = getYouTubeId(video.url);
            const card = document.createElement('div');
            card.className = 'video-card';
            if (id) {
                card.innerHTML = `
                    <div class="video-thumbnail" style="position:relative;">
                        <img src="${getThumbnailUrl(id)}" alt="${video.title}">
                        <div class="video-duration">10:25</div>
                        <div class="play-btn"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="video-info">
                        <h3><a href="${getWatchUrl(id)}" target="_blank" style="color:inherit;text-decoration:none;">${video.title}</a></h3>
                        <div class="video-meta">
                            <div class="channel-info">
                                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Channel Icon" class="channel-icon">
                                <span>ChannelPro</span>
                            </div>
                            <div class="video-stats">125K views • 2 days ago</div>
                        </div>
                    </div>
                `;
                // Click on thumbnail or title opens video
                card.querySelector('.video-thumbnail').addEventListener('click', function(e) {
                    window.open(getWatchUrl(id), '_blank');
                });
                card.querySelector('h3 a').addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent double open
                });
            } else {
                card.innerHTML = `
                    <div class="video-thumbnail" style="background:#333;display:flex;align-items:center;justify-content:center;color:#fff;height:200px;">
                        <i class="fas fa-video" style="font-size: 3rem;"></i>
                    </div>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <div class="video-meta">
                            <div class="channel-info">
                                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Channel Icon" class="channel-icon">
                                <span>ChannelPro</span>
                            </div>
                            <div class="video-stats">No preview available</div>
                        </div>
                    </div>
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
    loadVideos();
});
