document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // [우선 실행] 하트 인터랙션 (다른 에러에 영향받지 않도록 최상단 배치)
    // ===================================
    try {
        const heartBtn = document.getElementById('heart-btn');
        const particleContainer = document.getElementById('particle-container');

        if (heartBtn && particleContainer) {
            heartBtn.addEventListener('click', (e) => {
                const rect = heartBtn.getBoundingClientRect();
                const x = Math.round(rect.left + rect.width / 2);
                const y = Math.round(rect.top + rect.height / 2);
                
                for (let i = 0; i < 25; i++) {
                    createSvgHeart(x, y);
                }
            });
        }
    } catch (err) {
        console.error("Heart Interaction Error:", err);
    }

    function createSvgHeart(x, y) {
        const ns = "http://www.w3.org/2000/svg";
        const heart = document.createElementNS(ns, "svg");
        const particleContainer = document.getElementById('particle-container');
        if (!particleContainer) return;

        heart.setAttributeNS(null, "viewBox", "0 0 32 32");
        heart.classList.add("svg-heart");
        
        const path = document.createElementNS(ns, "path");
        path.setAttributeNS(null, "d", "M16 28.5L14.1 26.7C7.3 20.6 2.8 16.5 2.8 11.5 2.8 7.4 6 4.2 10.1 4.2c2.3 0 4.5 1.1 5.9 2.8 1.4-1.7 3.6-2.8 5.9-2.8 4.1 0 7.3 3.2 7.3 7.3 0 5-4.5 9.1-11.3 15.2L16 28.5z");
        heart.appendChild(path);

        const tx = (Math.random() - 0.5) * 500;
        const ty = -300 - Math.random() * 500;
        const rot = (Math.random() - 0.5) * 90;
        const rotEnd = rot + (Math.random() - 0.5) * 360;
        const size = Math.round(25 + Math.random() * 25);

        heart.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            --rot: ${rot}deg;
            --rot-end: ${rotEnd}deg;
            z-index: 1000000;
        `;

        particleContainer.appendChild(heart);
        setTimeout(() => { if (heart.parentNode) heart.remove(); }, 1800);
    }

    // ===================================
    // 1. 스크롤 Fade-in 효과
    // ===================================
    try {
        const faders = document.querySelectorAll('.fade-in');
        const appearOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        faders.forEach(fader => appearOnScroll.observe(fader));
    } catch (e) {}


    // ===================================
    // 2. 갤러리 슬라이더 + 라이트박스
    // ===================================
    try {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('expanded-img');
        const sliderImages = Array.from(document.querySelectorAll('.gallery-slider img'));
        const swiper = new Swiper('.gallery-slider', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 20,
            loop: true,
            pagination: { el: '.swiper-pagination', clickable: true },
        });

        let currentIndex = 0;
        function openModal(index) {
            currentIndex = index;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            updateModal();
        }
        function updateModal() {
            if (sliderImages[currentIndex]) {
                modalImg.src = sliderImages[currentIndex].src;
                document.getElementById('modal-counter').textContent = `${currentIndex + 1} / ${sliderImages.length}`;
            }
        }
        sliderImages.forEach((img, i) => img.addEventListener('click', () => openModal(i)));
        document.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
        document.getElementById('modal-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
            updateModal();
        });
        document.getElementById('modal-next').addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % sliderImages.length;
            updateModal();
        });
    } catch (e) {}


    // ===================================
    // 3. 복사 및 공유 기능
    // ===================================
    try {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = document.querySelector(btn.getAttribute('data-clipboard-target')).innerText.trim();
                navigator.clipboard.writeText(text).then(() => alert('복사되었습니다!')).catch(() => {
                    const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); alert('복사되었습니다!');
                });
            });
        });

        const kakaoBtn = document.getElementById('kakao-share-btn');
        if (kakaoBtn) {
            Kakao.init('b1cad1ee5721d3a29b39ea0dbf05828b');
            kakaoBtn.addEventListener('click', () => {
                Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: '민호 & 지수 결혼식에 초대합니다',
                        description: '우리 두 사람의 첫 시작을 함께 축복해 주세요.',
                        imageUrl: 'https://JS-kim2506.github.io/wedding-invitation/images/KakaoTalk_20260317_171113044.jpg',
                        link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
                    },
                    buttons: [{ title: '청첩장 보기', link: { mobileWebUrl: window.location.href, webUrl: window.location.href } }],
                });
            });
        }
        document.getElementById('link-copy-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => alert('링크가 복사되었습니다!')).catch(() => alert('복사 실패'));
        });
    } catch (e) {}


    // ===================================
    // 6. 방명록 (Firebase)
    // ===================================
    try {
        const firebaseConfig = {
            apiKey: "AIzaSyC-BRKmOhj_wysfNhNxcSKbIqtIm82FbtA",
            authorDomain: "wedding-invitation-35b40.firebaseapp.com",
            projectId: "wedding-invitation-35b40",
            storageBucket: "wedding-invitation-35b40.firebasestorage.app",
            messagingSenderId: "303986241786",
            appId: "1:303986241786:web:ec5d9e14e83170bbf6d943",
            measurementId: "G-NF1TLH2JCH"
        };
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();
            const gbList = document.getElementById('guestbook-list');
            const gbSubmit = document.getElementById('gb-submit');

            gbSubmit.addEventListener('click', async () => {
                const name = document.getElementById('gb-name').value.trim();
                const message = document.getElementById('gb-message').value.trim();
                if (!name || !message) return alert('이름과 메시지를 입력해 주세요.');
                await db.collection('guestbook').add({ name, message, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                document.getElementById('gb-name').value = ''; document.getElementById('gb-message').value = '';
            });

            db.collection('guestbook').orderBy('createdAt', 'desc').onSnapshot(snap => {
                if (snap.empty) { gbList.innerHTML = '<p class="guestbook-empty">축하 메시지를 남겨주세요 ♡</p>'; return; }
                gbList.innerHTML = '';
                snap.forEach(doc => {
                    const { name, message, createdAt } = doc.data();
                    const date = createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString() : '';
                    const item = document.createElement('div');
                    item.className = 'guestbook-item';
                    item.innerHTML = `<div class="gb-header"><span class="gb-name">${name}</span><span class="gb-date">${date}</span></div><p class="gb-message">${message}</p>`;
                    gbList.appendChild(item);
                });
            });
        }
    } catch (e) {
        console.warn("Firebase or Guestbook error:", e);
    }

    function escapeHtml(text) {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});
