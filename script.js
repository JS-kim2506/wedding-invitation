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
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    faders.forEach(fader => appearOnScroll.observe(fader));

    // 최상단 커버는 바로 표시
    setTimeout(() => {
        document.querySelectorAll('.cover-section.fade-in')
            .forEach(el => el.classList.add('visible'));
    }, 100);


    // ===================================
    // 2. 갤러리 그리드 + 라이트박스 모달
    // ===================================
    const modal      = document.getElementById('image-modal');
    const modalImg   = document.getElementById('expanded-img');
    const closeBtn   = document.querySelector('.close-modal');
    const prevBtn    = document.getElementById('modal-prev');
    const nextBtn    = document.getElementById('modal-next');
    const counter    = document.getElementById('modal-counter');
    const gridImages = Array.from(document.querySelectorAll('.photo-grid img'));

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
        modalImg.src = gridImages[currentIndex].src;
        counter.textContent = `${currentIndex + 1} / ${gridImages.length}`;
    }

    gridImages.forEach((img, i) => {
        img.addEventListener('click', () => openModal(i));
    });

    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + gridImages.length) % gridImages.length;
        updateModal();
    });
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % gridImages.length;
        updateModal();
    });

    // 모달 배경 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 키보드 좌우 화살표
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + gridImages.length) % gridImages.length; updateModal(); }
        if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % gridImages.length; updateModal(); }
        if (e.key === 'Escape')     closeModal();
    });


    // ===================================
    // 3. 계좌번호 복사
    // ===================================
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-clipboard-target');
            const el = document.querySelector(targetId);
            if (!el) return;

            const textarea = document.createElement('textarea');
            textarea.value = el.innerText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('계좌번호가 복사되었습니다.');
            } catch {
                alert('복사에 실패했습니다. 직접 복사해주세요.');
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
                alert('카카오 API 키가 설정되지 않았습니다.');
                return;
            }
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '김지수 & 이민호 결혼합니다',
                    description: '저희 두 사람의 새로운 시작을 축복해주세요.',
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
            const textarea = document.createElement('textarea');
            textarea.value = window.location.href;
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
    // 5. 하트 파티클 버튼
    // ===================================
    const heartBtn = document.getElementById('heart-btn');
    if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
            createHearts(e.clientX, e.clientY);
        });
    }

    function createHearts(x, y) {
        const emojis = ['♥', '♡', '💕', '💗'];
        for (let i = 0; i < 12; i++) {
            const heart = document.createElement('div');
            heart.classList.add('particle-heart');
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            document.body.appendChild(heart);

            const size = Math.random() * 16 + 14;
            const destX = x + (Math.random() - 0.5) * 180;
            const destY = y - Math.random() * 180 - 80;
            const rotation = (Math.random() - 0.5) * 60;

            heart.style.left = `${x}px`;
            heart.style.top  = `${y}px`;
            heart.style.fontSize = `${size}px`;
            heart.style.color = ['#c9a87c', '#e8b4b8', '#d4a5a5', '#b8966e'][Math.floor(Math.random() * 4)];

            const anim = heart.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(${destX - x}px, ${destY - y}px) rotate(${rotation}deg) scale(1)`, opacity: 0.8 },
                { transform: `translate(${destX - x}px, ${destY - y - 60}px) rotate(${rotation}deg) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 600,
                delay: Math.random() * 150,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            anim.onfinish = () => heart.remove();
        }
    }


    // ===================================
    // 6. 방명록 (Firebase Firestore)
    // ===================================

    // ⚠️ Firebase 설정값을 아래에 입력해주세요
    // Firebase 콘솔(console.firebase.google.com)에서 앱 등록 후 받는 config 객체입니다
    const firebaseConfig = {
        apiKey:            "AIzaSyC-BRKmOhj_wysfNhNxcSKbIqtIm82FbtA",
        authDomain:        "wedding-invitation-35b40.firebaseapp.com",
        projectId:         "wedding-invitation-35b40",
        storageBucket:     "wedding-invitation-35b40.firebasestorage.app",
        messagingSenderId: "303986241786",
        appId:             "1:303986241786:web:ec5d9e14e83170bbf6d943",
        measurementId:     "G-NF1TLH2JCH"
    };

    // Firebase가 설정된 경우에만 방명록 실행
    if (firebaseConfig.apiKey !== 'YOUR_API_KEY') {
        const app = firebase.initializeApp(firebaseConfig);
        const db  = firebase.firestore();

        const gbList   = document.getElementById('guestbook-list');
        const gbName   = document.getElementById('gb-name');
        const gbMsg    = document.getElementById('gb-message');
        const gbSubmit = document.getElementById('gb-submit');

        // 메시지 제출
        gbSubmit.addEventListener('click', async () => {
            const name    = gbName.value.trim();
            const message = gbMsg.value.trim();
            if (!name || !message) {
                alert('이름과 메시지를 모두 입력해주세요.');
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
                alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
                console.error(err);
            }
        });

        // 실시간으로 방명록 불러오기
        db.collection('guestbook')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    gbList.innerHTML = '<p class="guestbook-empty">첫 번째 축하 메시지를 남겨주세요 ♡</p>';
                    return;
                }
                gbList.innerHTML = '';
                snapshot.forEach(doc => {
                    const { name, message, createdAt } = doc.data();
                    const date = createdAt
                        ? new Date(createdAt.seconds * 1000).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
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
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

});
