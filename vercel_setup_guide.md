# ArtLink Vercel 배포 상세 가이드

Vercel은 Next.js에 최적화된 배포 플랫폼으로, GitHub과 연동하면 코드를 푸시할 때마다 자동으로 배포됩니다. 현재 ArtLink 프로젝트(Drizzle + Turso + NextAuth)를 성공적으로 구동하기 위한 상세 설정법을 안내해 드립니다.

## 1. Vercel 가입 및 프로젝트 가져오기

1.  **[vercel.com](https://vercel.com/)**에 접속하여 GitHub 계정으로 로그인합니다.
2.  대시보드에서 **[Add New...]** 버튼을 누르고 **[Project]**를 선택합니다.
3.  **[Import Git Repository]** 목록에서 업로드하신 `artlink` 레포지토리를 찾아 **[Import]**를 클릭합니다.

---

## 2. 프로젝트 설정 (Configure Project)

Import 후 나타나는 설정 화면에서 다음 항목들을 확인 및 수정합니다.

### A. Framework Preset
- **Next.js**가 자동으로 선택되어 있어야 합니다.

### B. Root Directory
- `./` (기본값)로 둡니다.

### C. Build and Output Settings
- 기본 설정(Override 없이)으로 둡니다. (npm install && next build)

---

## 3. 환경 변수 설정 (중요 🌟)

**Environment Variables** 섹션에 [.env.example](file:///Users/hoonlee/Documents/Hpeerage/01.project/08.artlink/.env.example)에 정리된 항목들을 하나씩 추가해야 합니다. 로컬의 `.env` 내용을 복사하여 붙여넣으세요.

| Key | Value (설명) |
| :--- | :--- |
| `TURSO_DATABASE_URL` | Turso 클라우드 DB URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso 인증 토큰 |
| `NEXTAUTH_SECRET` | 임의의 긴 문자열 (인증 보안용) |
| `NEXTAUTH_URL` | `https://[내-프로젝트-이름].vercel.app/artlink/` |

> [!CAUTION]
> **NEXTAUTH_URL** 설정 시 주의사항:
> 현재 프로젝트는 `basePath: '/artlink'`가 설정되어 있습니다. 따라서 Vercel에서 제공하는 도메인 주소 뒤에 반드시 `/artlink/`를 붙여주어야 로그인이 정상 작동합니다.

---

## 4. 최종 배포 및 확인

1.  환경 변수 입력이 끝났다면 하단의 **[Deploy]** 버튼을 클릭합니다.
2.  약 1~2분 정도 빌드 과정이 진행됩니다.
3.  빌드가 완료되면 **[Continue to Dashboard]**를 눌러 배포된 URL을 확인합니다.

> [!TIP]
> **배포 후 도메인 확인**:
> Vercel에서 준 도메인이 `https://artlink-demo.vercel.app`이라면, 실제 접속 주소는 `https://artlink-demo.vercel.app/artlink/`가 됩니다. (`basePath` 때문입니다.)

---

## 5. 자주 발생하는 문제 해결 (Troubleshooting)

### Q1. "Database connection error"가 발생해요.
- `TURSO_DATABASE_URL`과 `TURSO_AUTH_TOKEN`이 Vercel 환경 변수에 정확히 입력되었는지 다시 확인하세요.

### Q2. 로그인이 안 되고 404 에러가 나요.
- `NEXTAUTH_URL`이 정확한지 확인하세요. (끝에 `/artlink/` 포함 필수)
- `next.config.ts`의 `basePath` 설정을 제거하고 싶으시다면, 루트 경무로 배포하도록 수정이 필요합니다.

### Q3. 이미지가 깨져 보여요.
- `next.config.ts`에 `unoptimized: true` 설정이 이미 되어있으므로, GitHub에 올라온 이미지들이 `public/` 폴더에 있는지 확인하세요.

---

모든 설정이 완료되면, 이제 GitHub에 `git push`만 하면 1분 내외로 실제 웹사이트에 반영됩니다! 🚀✨
