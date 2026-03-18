document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 1. 스크롤 Fade-in 효과
    // ===================================
    const faders = document.querySelectorAll('.fade-in');

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    faders.forEach(fader => appearOnScroll.observe(fader));


    // ===================================
    // 2. 갤러리 슬라이더 + 라이트박스 모달
    // ===================================
    const modal      = document.getElementById('image-modal');
    const modalImg   = document.getElementById('expanded-img');
    const closeBtn   = document.querySelector('.close-modal');
    const prevBtn    = document.getElementById('modal-prev');
    const nextBtn    = document.getElementById('modal-next');
    const counter    = document.getElementById('modal-counter');
    const sliderImages = Array.from(document.querySelectorAll('.gallery-slider img'));

    // Swiper 초기화
    const swiper = new Swiper('.gallery-slider', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        updateModal();
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => { modalImg.src = ''; }, 300);
    }

    function updateModal() {
        if (sliderImages[currentIndex]) {
            modalImg.src = sliderImages[currentIndex].src;
            counter.textContent = `${currentIndex + 1} / ${sliderImages.length}`;
        }
    }

    sliderImages.forEach((img, i) => {
        img.addEventListener('click', () => openModal(i));
    });

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
        updateModal();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % sliderImages.length;
        updateModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-inner')) closeModal();
    });


    // ===================================
    // 3. 계좌번호 복사
    // ===================================
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-clipboard-target');
            const el = document.querySelector(targetId);
            if (!el) return;

            const text = el.innerText.trim();
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('계좌번호가 복사되었습니다.');
            } catch {
                alert('복사에 실패했습니다. 다시 시도해 주세요.');
            }
            document.body.removeChild(textarea);
        });
    });


    // ===================================
    // 4. 카카오 & 링크 공유
    // ===================================
    const kakaoBtn = document.getElementById('kakao-share-btn');
    if (kakaoBtn) {
        Kakao.init('b1cad1ee5721d3a29b39ea0dbf05828b');
        kakaoBtn.addEventListener('click', () => {
            if (!Kakao.isInitialized()) {
                alert('카카오 API 초기화에 실패했습니다.');
                return;
            }
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '민호 & 지수 결혼식에 초대합니다',
                    description: '우리 두 사람의 첫 시작을 함께 축복해 주세요.',
                    imageUrl: 'https://JS-kim2506.github.io/wedding-invitation/images/KakaoTalk_20260317_171113044.jpg',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [{
                    title: '청첩장 보기',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                }],
            });
        });
    }

    const linkCopyBtn = document.getElementById('link-copy-btn');
    if (linkCopyBtn) {
        linkCopyBtn.addEventListener('click', () => {
            const url = window.location.href;
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('청첩장 링크가 복사되었습니다!');
            } catch {
                alert('복사에 실패했습니다.');
            }
            document.body.removeChild(textarea);
        });
    }


    // ===================================
    // 5. 프리미엄 SVG 하트 인터랙션 (좌표 보정 완료)
    // ===================================
    const heartBtn = document.getElementById('heart-btn');
    const particleContainer = document.getElementById('particle-container');

    if (heartBtn && particleContainer) {
        heartBtn.addEventListener('click', (e) => {
            // 클릭 지점 좌표 (모바일/데스크탑 호환)
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            
            // 만약 좌표를 못 가져오면 버튼 중앙으로 대체
            let finalX = x;
            let finalY = y;
            if (!finalX || !finalY) {
                const rect = heartBtn.getBoundingClientRect();
                finalX = rect.left + rect.width / 2;
                finalY = rect.top + rect.height / 2;
            }

            for (let i = 0; i < 20; i++) {
                createSvgHeart(finalX, finalY);
            }
        });
    }

    function createSvgHeart(x, y) {
        const heart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        heart.setAttribute("viewBox", "0 0 32 32");
        heart.classList.add("svg-heart");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M16 28.5L14.1 26.7C7.3 20.6 2.8 16.5 2.8 11.5 2.8 7.4 6 4.2 10.1 4.2c2.3 0 4.5 1.1 5.9 2.8 1.4-1.7 3.6-2.8 5.9-2.8 4.1 0 7.3 3.2 7.3 7.3 0 5-4.5 9.1-11.3 15.2L16 28.5z");
        heart.appendChild(path);

        // 랜덤 오프셋 파라미터 (Click 지점으로부터의 상대적 거리)
        const tx = (Math.random() - 0.5) * 400; // 좌우 넓게
        const ty = -200 - Math.random() * 400; // 위로 높게
        const rot = (Math.random() - 0.5) * 60;
        const rotEnd = rot + (Math.random() - 0.5) * 240;
        const size = 20 + Math.random() * 20;

        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // CSS 변수로 오프셋 전달 (style.css에서 calc로 처리)
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--rot', `${rot}deg`);
        heart.style.setProperty('--rot-end', `${rotEnd}deg`);

        particleContainer.appendChild(heart);

        // 애니메이션 완료 후 확실하게 제거
        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 1700);
    }


    // ===================================
    // 6. 방명록 (Firebase)
    // ===================================
    const firebaseConfig = {
        apiKey:            "AIzaSyC-BRKmOhj_wysfNhNxcSKbIqtIm82FbtA",
        authorDomain:      "wedding-invitation-35b40.firebaseapp.com",
        projectId:         "wedding-invitation-35b40",
        storageBucket:     "wedding-invitation-35b40.firebasestorage.app",
        messagingSenderId: "303986241786",
        appId:             "1:303986241786:web:ec5d9e14e83170bbf6d943",
        measurementId:     "G-NF1TLH2JCH"
    };

    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
        const app = firebase.initializeApp(firebaseConfig);
        const db  = firebase.firestore();

        const gbList   = document.getElementById('guestbook-list');
        const gbName   = document.getElementById('gb-name');
        const gbMsg    = document.getElementById('gb-message');
        const gbSubmit = document.getElementById('gb-submit');

        gbSubmit.addEventListener('click', async () => {
            const name    = gbName.value.trim();
            const message = gbMsg.value.trim();
            if (!name || !message) {
                alert('Please enter both name and message.');
                return;
            }
            try {
                await db.collection('guestbook').add({
                    name,
                    message,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                gbName.value = '';
                gbMsg.value  = '';
            } catch (err) {
                alert('Failed to save. Please try again.');
                console.error(err);
            }
        });

        db.collection('guestbook')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    gbList.innerHTML = '<p class="guestbook-empty">Be the first to leave a message ♡</p>';
                    return;
                }
                gbList.innerHTML = '';
                snapshot.forEach(doc => {
                    const { name, message, createdAt } = doc.data();
                    const date = createdAt 
                        ? new Date(createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '';
                    const item = document.createElement('div');
                    item.classList.add('guestbook-item');
                    item.innerHTML = `
                        <div class="gb-header">
                            <span class="gb-name">${escapeHtml(name)}</span>
                            <span class="gb-date">${date}</span>
                        </div>
                        <p class="gb-message">${escapeHtml(message)}</p>
                    `;
                    gbList.appendChild(item);
                });
            });
    }

    function escapeHtml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
