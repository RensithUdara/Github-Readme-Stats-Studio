# 📊 Readme Stats Studio

Create, preview, customize, and copy beautiful GitHub README stats cards from a clean web studio.

**Live app:** https://github-readme-stats-studio.vercel.app  
**Author:** Rensith Udara  
**GitHub:** [RensithUdara](https://github.com/RensithUdara)

---

## ✨ Features

- 🎛️ Interactive card studio with live SVG previews
- 📈 GitHub profile stats card
- 🔥 Contribution streak card
- 🧠 Top languages card
- 📌 Repository pin card
- 🧾 Gist card support
- ⏱️ WakaTime card support
- 🎨 Theme picker and quick theme swatches
- 🖌️ Custom title, text, icon, background, and border colors
- 📐 Border radius control
- 🧩 Advanced options for rank icons, language layout, and language count
- 📋 Copy output as Markdown, HTML, or direct SVG URLs
- 🔗 Shareable studio setup links
- 💾 Browser preset save/load/reset
- 🚀 Hosted on Vercel

---

## 🌐 Live URL

Open the studio here:

```txt
https://github-readme-stats-studio.vercel.app
```

The hosted API base is:

```txt
https://github-readme-stats-studio.vercel.app/api
```

---

## 🖼️ Card Examples

### GitHub Stats

```md
![Stats](https://github-readme-stats-studio.vercel.app/api?username=RensithUdara&theme=onedark&show_icons=true)
```

### Streak

```md
![Streak](https://github-readme-stats-studio.vercel.app/api/streak?username=RensithUdara&theme=onedark)
```

### Top Languages

```md
![Languages](https://github-readme-stats-studio.vercel.app/api/top-langs?username=RensithUdara&theme=onedark&layout=compact)
```

### Repository Pin

```md
![Repository](https://github-readme-stats-studio.vercel.app/api/pin?username=RensithUdara&repo=github-readme-stats-studio&theme=onedark)
```

---

## 🧭 API Endpoints

| Card             | Endpoint         | Required query     |
| ---------------- | ---------------- | ------------------ |
| 📈 Stats         | `/api`           | `username`         |
| 🔥 Streak        | `/api/streak`    | `username`         |
| 🧠 Top languages | `/api/top-langs` | `username`         |
| 📌 Repo pin      | `/api/pin`       | `username`, `repo` |
| 🧾 Gist          | `/api/gist`      | `id`               |
| ⏱️ WakaTime      | `/api/wakatime`  | `username`         |

---

## 🎨 Common Query Options

| Option               | Example                   | Description              |
| -------------------- | ------------------------- | ------------------------ |
| `theme`              | `theme=onedark`           | Applies a built-in theme |
| `hide_border`        | `hide_border=true`        | Hides card border        |
| `hide_title`         | `hide_title=true`         | Hides card title         |
| `title_color`        | `title_color=61afef`      | Custom title color       |
| `text_color`         | `text_color=abb2bf`       | Custom text color        |
| `icon_color`         | `icon_color=98c379`       | Custom icon color        |
| `bg_color`           | `bg_color=282c34`         | Custom background color  |
| `border_color`       | `border_color=3e4451`     | Custom border color      |
| `border_radius`      | `border_radius=8`         | Card corner radius       |
| `disable_animations` | `disable_animations=true` | Disables SVG animation   |

---

## 🧠 Top Languages Options

| Option          | Example              | Description                                              |
| --------------- | -------------------- | -------------------------------------------------------- |
| `layout`        | `layout=compact`     | `compact`, `normal`, `donut`, `donut-vertical`, or `pie` |
| `langs_count`   | `langs_count=6`      | Number of languages to show                              |
| `hide_progress` | `hide_progress=true` | Hides progress visuals                                   |
| `hide`          | `hide=html,css`      | Excludes languages                                       |

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/RensithUdara/github-readme-stats-studio.git
cd github-readme-stats-studio
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

Create `.env` from the example file:

```bash
cp .env.example .env
```

Then add your GitHub personal access token:

```env
PAT_1=github_pat_your_token_here
```

### 4. Run API locally

```bash
npm run dev
```

Local API will run on:

```txt
http://localhost:9000
```

### 5. Open the UI locally

The UI is static and lives in `ui/`. You can open `ui/index.html` directly, or serve it with any static server.

---

## 🔐 Environment Variables

| Name                     | Required | Description                                    |
| ------------------------ | -------- | ---------------------------------------------- |
| `PAT_1`                  | ✅ Yes   | GitHub token used for GitHub GraphQL/API calls |
| `GITHUB_TOKEN`           | Optional | Fallback token if `PAT_1` is not set           |
| `CACHE_SECONDS`          | Optional | Overrides card cache duration                  |
| `FETCH_MULTI_PAGE_STARS` | Optional | Enables multi-page star fetching when `true`   |

You can add more tokens as:

```env
PAT_2=github_pat_second_token
PAT_3=github_pat_third_token
```

---

## 🚀 Deploy To Vercel

### 1. Link project

```bash
npx vercel link --project github-readme-stats-studio
```

### 2. Add environment variable

```bash
npx vercel env add PAT_1 production --sensitive
npx vercel env add PAT_1 preview --sensitive
```

### 3. Deploy

```bash
npx vercel deploy --prod
```

---

## 📁 Project Structure

```txt
api/                 Vercel serverless API routes
src/cards/           SVG card renderers
src/fetchers/        GitHub, Gist, and WakaTime data fetchers
src/common/          Shared card, cache, retry, and utility helpers
themes/              Theme definitions
ui/                  Static studio frontend
express.js           Local API server
vercel.json          Vercel routing config
```

---

## 🧪 Checks

This project is currently shipped without test fixture files.

Useful checks:

```bash
npm run format:check
npm run lint
node --check ui/script.js
```

---

## 🧹 Deployment Notes

`.vercelignore` excludes local-only files such as:

- `.env`
- logs
- source-only docs that should not be served as public pages

The public web app is served from `ui/`, while API cards are served from `api/`.

---

## 🛡️ Security

- Never commit `.env`.
- Never expose GitHub personal access tokens in client-side files.
- Add `PAT_1` only as a Vercel environment variable.
- Rotate your GitHub token if it is ever shared accidentally.

---

## 📄 License

This project is licensed under the MIT License.

See [LICENSE](LICENSE) for details.

---

## 🙌 Credits

Made with care by **Rensith Udara**.
