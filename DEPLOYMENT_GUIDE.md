# WorkSync 배포 가이드 (Vercel)

이 문서는 다른 AI 또는 개발자가 Vercel을 통해 WorkSync 프로젝트를 배포하기 위한 지침서입니다.

## 📋 프로젝트 정보
- **프로젝트명**: WorkSync (Team ChronoShift)
- **GitHub 레포지토리**: `https://github.com/wo123kr/WorkSync`
- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **패키지 매니저**: npm

## 🚀 배포 단계 (Vercel)

다른 AI에게 작업을 요청할 때 아래 내용을 복사해서 전달하세요.

---

### [AI 요청 프롬프트]

**목표**: GitHub에 있는 `WorkSync` 프로젝트를 Vercel에 배포해주세요.

**상세 정보**:
1.  **GitHub Repo**: `https://github.com/wo123kr/WorkSync`
2.  **Vercel 설정**:
    *   **Framework Preset**: Next.js (자동 감지될 것임)
    *   **Root Directory**: `./` (기본값)
    *   **Build Command**: `next build` (또는 `npm run build`)
    *   **Install Command**: `npm install`
    *   **Output Directory**: `.next` (Next.js 기본값)
3.  **환경 변수 (Environment Variables)**:
    *   현재 프로젝트는 별도의 환경 변수 설정이 필요 없습니다. (`.env` 불필요)
4.  **배포 후 확인 사항**:
    *   배포된 URL로 접속하여 메인 페이지가 뜨는지 확인.
    *   도시 추가, 시간 슬라이더 조작 등 기능이 정상 작동하는지 확인.

---

## ✅ 수동 배포 방법 (직접 할 경우)

1.  [Vercel 대시보드](https://vercel.com/dashboard)에 로그인합니다.
2.  **"Add New..."** 버튼 클릭 -> **"Project"** 선택.
3.  GitHub 계정이 연동되어 있다면 `WorkSync` 레포지토리를 찾아 **"Import"**를 클릭합니다.
    *   목록에 없다면 GitHub URL(`https://github.com/wo123kr/WorkSync`)을 직접 입력하거나 GitHub 권한 설정을 확인하세요.
4.  **Configure Project** 화면에서:
    *   Framework Preset이 **Next.js**로 되어 있는지 확인.
    *   나머지 설정은 기본값 그대로 둡니다.
5.  **"Deploy"** 버튼 클릭.
6.  약 1-2분 후 배포가 완료되면 폭죽 애니메이션이 나옵니다.
7.  생성된 도메인(예: `worksync-zeta.vercel.app`)을 클릭하여 접속합니다.

## ⚠️ 문제 발생 시 해결 팁

*   **Build Error**: 로컬에서 `npm run build`가 성공하는지 확인하세요. (현재 최신 코드는 빌드 성공 확인됨)
*   **404 Error**: `app` 디렉토리 구조가 올바른지 확인하세요. (현재 App Router 구조임)
*   **Hydration Error**: `layout.tsx`에 `suppressHydrationWarning` 속성이 추가되어 있어 시간 관련 불일치 경고는 무시됩니다.
