# 🎨 ArtLink (아트링크) - Premium AR Commerce v2.0

> **"당신의 벽면이 갤러리가 되는 순간, 아트링크가 함께합니다."**

ArtLink는 3D AR 기술을 통해 2D 작품을 1:1 리얼 스케일로 체험하고, 정기 렌탈 및 구매를 할 수 있는 차세대 아트 커머스 플랫폼입니다. 2D 예술의 실물 체험 한계를 AR로 극복하고, 작가의 수익 구조를 다변화합니다.

## ✨ 핵심 기능 (Core Features)

### 1. 1:1 Real-Scale WebAR (Phase 1 & 2)
* **초정밀 스케일링**: 작가가 입력한 mm 단위 규격을 바탕으로 실제 크기로 작품을 시뮬레이션합니다.
* **프레임 커스터마이징 (v2)**: Wood, White, Black 프레임을 실시간으로 교체하여 인테리어와의 조화를 확인합니다.
* **텍스처 매핑**: 고해상도 이미지를 3D 액자 모델(`art_surface`)에 실시간으로 입혀 질감을 표현합니다.

### 2. 작가 수익 플랫폼 (Artist Hub)
* **작가 대시보드 (v2)**: 통계 확인, 작품 관리 및 신규 업로드 기능을 제공합니다.
* **규격 기반 업로드**: 작품의 실제 크기를 입력하여 AR 데이터의 무결성을 확보합니다.
* **AR 프리뷰**: 작가가 게시 전 자신의 작품이 AR에서 어떻게 보일지 직접 검증합니다.

### 3. 가상 갤러리 및 소셜 연동 (v2)
* **AR 스냅샷**: 배치된 상태의 고화질 스냅샷을 캡처합니다.
* **SNS 공유**: 인스타그램 스토리용 템플릿 레이어로 즉시 공유가 가능합니다.

### 4. 고도화된 결제 시스템 (Tab 7 반영)
* **빌링키 정기 결제**: PortOne V2를 통해 첫 등록 후 매달 자동 결제되는 정기 렌탈 서비스를 제공합니다.
* **서비스 이원화**: 구독 렌탈(전문가 케어, 정기 교체)과 단품 구매의 혜택을 한눈에 비교할 수 있습니다.

---

## 🛠 로컬 개발 및 구동 가이드 (Local Setup)

본 프로젝트는 Next.js 정적 내보내기(`${output}: 'export'`) 모드이므로, 로컬에서 모든 기능을 완벽하게 점검할 수 있습니다.

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
# 접속 주소: http://localhost:3000
```

### 3. 주요 페이지 로컬 테스트 경로
* **사용자 홈**: `http://localhost:3000`
* **작품 탐색**: `http://localhost:3000/explore`
* **작가 대시보드**: [http://localhost:3000/artist](http://localhost:3000/artist) (신규)
* **작품 업로드**: [http://localhost:3000/artist/upload](http://localhost:3000/artist/upload) (신규 - mm 입력 가능)
* **결제 테스트**: `http://localhost:3000/test/payment`

### 4. 정적 빌드 및 배포 검증
```bash
npm run build
# 생성된 'out' 폴더 내의 index.html을 정적 서버로 구동하여 확인 가능
```

---

## 🌐 인프라 및 운영 원칙
* **Zero-Cost**: 무료 라이브러리(@google/model-viewer, Lucide-React) 및 Supabase Free Tier 사용.
* **GitHub Pages**: `/artlink` 서브디렉토리 배포 시에도 `basePath` 설정을 통해 이미지 및 리소스 경로가 완벽하게 대응됩니다.

---
© 2026 ArtLink Development Team.
