import fs from 'node:fs/promises'
import express from 'express'
import ViteExpress from 'vite-express';

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express();
ViteExpress.config({ignorePaths: '/highScores'});

app.use(express.json());

app.use(function(req, res, next) {
  console.log(req.method, req.body, 'req in use');
  next();
})

app.get('/highScores', async function(req, res) {
  try {
    console.log('getting...');
    const list = await [[100, 'Claude'], [90, 'Leonie'], [85, 'Lysithea'], [70, 'Lorenz'], [60, 'Ignatz'], [55, 'Raphael'], [10, 'Hilda'], [-10, 'Marianne']];
    res.status(200).set({ 'Content-Type': 'application/json' }).json(list);
  } catch (err) {
    console.error(err);
  }
});

app.post('/highScores', async function(req, res) {
  try {
    console.log(req.body, 'req.body');
    const isSuccessful = await saveHighScores(req.body);
    res.status(200).end();
  } catch (err) {
    console.error(err);
  }
});

function saveHighScores(list) {
  try {
    console.log(list, 'totally saved to DB for real');
    // totally saved to DB
    return true;
  } catch(e) {
    console.error(e);
  }
  
};


// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}

// // app.post('/login', (req, res) => {
// //   try {
// //     console.log( 'You logged in!');
// //     const json = {"message": "hi"};
// //     res.status(200).set({ 'Content-Type': 'application/json' }).send(json);
// //   } catch(e) {
// //     vite?.ssrFixStacktrace(e)
// //     console.log(e.stack)
// //     res.status(500).end(e.stack)
// //   }
// // })

// Serve HTML
app.use('/main', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
