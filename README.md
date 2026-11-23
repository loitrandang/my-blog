# My Blog

Blog ca nhan, site tinh thuan HTML/CSS/JS, chay duoi `/my-blog/` (GitHub Pages) vi dung duong dan tuong doi. Giu file `.nojekyll`.

## Cau truc
- `index.html`: trang chu + o tim kiem (loc phia client theo tieu de, mo ta, tag)
- `tags.html`: loc theo tag, dung `tags.html#ten-tag`
- `about.html`: gioi thieu
- `posts/`: cac bai viet; `posts/_template.html` la mau
- `posts.json`: danh sach bai (title, date, tags, description, url)
- `style.css`, `app.js`

## Them bai moi
1. Copy `posts/_template.html` thanh `posts/ten-bai.html`, sua noi dung.
2. Them mot object vao `posts.json` (url dang `posts/ten-bai.html`).
3. Commit va push len `main`.

## Chay thu local
`python -m http.server` roi mo `http://localhost:8000/` (mo file truc tiep se khong tai duoc `posts.json`).

## Highlight code
Dung highlight.js 11.9.0 qua CDN, chi nap o trang bai co code.
