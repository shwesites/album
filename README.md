# Private One-Page Photo Album — GitHub Pages

## Files

- `index.html` — the album page
- `style.css` — design and responsive layout
- `script.js` — 3-digit PIN + photo viewer
- `photos/` — put your photos here

## Change the PIN

Open `script.js` and change:

```js
const CORRECT_PIN = "123";
```

For example:

```js
const CORRECT_PIN = "587";
```

Use exactly 3 digits.

## Add your photos

Put your images in the `photos` folder and name them:

- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`
- `photo6.jpg`

You can add more `<figure>` blocks in `index.html`.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and the `photos` folder.
3. Open the repository's **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save.
7. GitHub will provide your Pages URL.

## Important security warning

This 3-digit PIN is a **front-end lock screen, not real security**.

Because GitHub Pages is static hosting, the PIN exists in the JavaScript sent to the visitor's browser. Someone with technical knowledge can inspect the source code and bypass the PIN.

Do not use this method for confidential photographs or sensitive information. For genuinely private photos, use server-side authentication or a private photo/storage service.
