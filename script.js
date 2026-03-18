document.addEventListener('DOMContentLoaded', () => {
    // 1. 스크롤 시 Fade-in 효과 인터랙션
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, // 엘리먼트가 10% 정도 뷰포트에 들어오면 실행
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 화면이 처음 로드될 때 바로 보이는 요소들을 위한 임시 처리 (상단 요소)
    setTimeout(() => {
        const topElements = document.querySelectorAll('.cover-section.fade-in');
        topElements.forEach(el => el.classList.add('visible'));
    }, 100);

    // 2. 축하 버튼 클릭 시 하트 파티클 날아다니는 인터랙션 구현
    const heartBtn = document.getElementById('heart-btn');
    if (heartBtn) {
        heartBtn.addEventListener('click', (e) => {
            createHearts(e.clientX, e.clientY);
        });
    }

    // 파티클 생성 함수
    function createHearts(x, y) {
        const colors = ['#ff6b6b', '#ff4757', '#ff9ff3', '#feca57'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('particle-heart');
            heart.innerHTML = '💖'; // 또는 SVG 사용
            document.body.appendChild(heart);

            // 랜덤 속성 부여
            const size = Math.random() * 20 + 15;
            const destinationX = x + (Math.random() - 0.5) * 200;
            const destinationY = y - (Math.random() * 200) - 100;
            const rotation = Math.random() * 360;
            const delay = Math.random() * 0.2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            // 초기 위치 (버튼 근처)
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.fontSize = `${size}px`;
            heart.style.setProperty('--color', color);

            // 애니메이션 실행 (Web Animations API)
            const animation = heart.animate([
                { transform: `translate(-50%, -50%) rotate(0deg) scale(0)`, opacity: 1 },
                { transform: `translate(${destinationX - x}px, ${destinationY - y}px) rotate(${rotation}deg) scale(1)`, opacity: 0.8 },
                { transform: `translate(${destinationX - x + (Math.random() - 0.5) * 50}px, ${destinationY - y - 100}px) rotate(${rotation + 90}deg) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            // 끝나면 DOM에서 제거
            animation.onfinish = () => heart.remove();
        }
    }

    // 3. 사진 갤러리 슬라이드 (Swiper JS 초기화) - 창의적인 카드 스택 효과
    if (document.querySelector('.gallery-swiper')) {
        new Swiper('.gallery-swiper', {
            effect: 'cards', // 트렌디한 카드 스택 효과 적용
            grabCursor: true,
            cardsEffect: {
                perSlideOffset: 8,
                perSlideRotate: 2,
                rotate: true,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

    // 4. 계좌번호 복사 기능
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-clipboard-target');
            const element = document.querySelector(targetId);
            if (element) {
                const text = element.innerText;
                // 구형 브라우저 및 모바일 호환을 위해 임시 textarea 사용
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    alert('계좌번호가 복사되었습니다.');
                } catch (err) {
                    alert('복사에 실패했습니다. 직접 복사해주세요.');
                }
                document.body.removeChild(textarea);
            }
        });
    }); // 이곳에 forEach 닫는 괄호 복구

    // 5. 카카오톡 및 링크 공유 기능
    const kakaoBtn = document.getElementById('kakao-share-btn');
    if (kakaoBtn) {
        // 카카오 SDK 초기화 (본인의 JavaScript 키를 입력해야 작동합니다)
        // Kakao.init('YOUR_JAVASCRIPT_KEY'); 
        kakaoBtn.addEventListener('click', () => {
            if (!Kakao.isInitialized()) {
                alert('카카오 API 키가 설정되지 않았습니다. 개발자에게 문의하세요.');
                return;
            }
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '김지수 & 이민호 결혼합니다',
                    description: '저희 두 사람의 새로운 시작을 축복해주세요.',
                    imageUrl: 'https://via.placeholder.com/600x800.png?text=Thumbnail', // 썸네일로 보일 이미지 주소
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: '청첩장 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
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
            } catch (err) {
                alert('복사에 실패했습니다.');
            }
            document.body.removeChild(textarea);
        });
    }

    // 6. 흩뿌려진 별(⭐) 생성 로직
    const starsBg = document.querySelector('.stars-bg');
    if (starsBg) {
        const starCount = 30; // 화면에 흩뿌릴 별 개수
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('real-star');
            star.innerText = '⭐';

            // 화면 전체 중 랜덤한 위치
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            // 랜덤 크기 및 깜빡임 속도 (별 크기 축소를 위해 수치 낮춤)
            const size = Math.random() * 0.4 + 0.3;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;

            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
            star.style.fontSize = `${size}rem`;
            star.style.setProperty('--duration', `${duration}s`);
            star.style.animationDelay = `${delay}s`;

            starsBg.appendChild(star);
        }
    }

    // 7. 갤러리 이미지 모달창 (확대보기) 기능
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("expanded-img");
    const closeModal = document.querySelector(".close-modal");
    const galleryImages = document.querySelectorAll('.gallery-swiper .swiper-slide img');

    // 이미지 클릭 시 모달 열기
    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            modal.classList.add("show");
            modalImg.src = this.src;
        });
    });

    // 닫기 버튼(X) 클릭 시 모달 닫기
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            modal.classList.remove("show");
            setTimeout(() => { modalImg.src = ''; }, 300); // 부드러운 전환 후 소스 비우기
        });
    }

    // 모달 배경 클릭 시 닫기
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.classList.remove("show");
        }
    });

});
