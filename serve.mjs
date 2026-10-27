// Read-only preview of generated public routes; never serve source or local policy.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.argv[2]||8141);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const server=http.createServer((req,res)=>{
  if(!['127.0.0.1','localhost','[::1]'].includes(req.headers.host?.replace(/:\d+$/,''))){res.writeHead(403);res.end();return;}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  let name;try{name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);res.end();return;}
  if(name.endsWith('/'))name+='index.html';
  const allowed=/^\/(?:index\.html|404\.html|robots\.txt|sitemap\.xml|garage\/index\.html|xuseak-todo\/(?:privacy|support)\/index\.html|projects\/(?:index\.html|[a-z0-9-]+\/index\.html|page\/[1-9]\d*\/index\.html)|assets\/(?:[a-z0-9-]+\.(?:css|js|mjs)|project-catalog\.json|favicon\.svg|(?:icons|shots)\/[a-z0-9-]+\.(?:png|svg)))$/;
  const target=path.join(root,name);
  if(!allowed.test(name)||!fs.existsSync(target)){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not Found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(target)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
  if(req.method==='HEAD')res.end();else fs.createReadStream(target).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio preview: http://127.0.0.1:${port}/`));
