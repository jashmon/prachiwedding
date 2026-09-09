import { mkdirSync, writeFileSync } from 'node:fs';

// Source geometry for the two standalone, editable vector puppets.
const out = new URL('../public/characters/', import.meta.url);
mkdirSync(out, { recursive: true });
function character(person) {
  const girl = person === 'prachi';
  const p = person;
  const skin = `url(#${p}-skin)`;
  const hair = `url(#${p}-hair)`;
  const cloth = `url(#${p}-cloth)`;
  const gold = `url(#${p}-gold)`;
  const outfit = (name, content) => `<g data-outfit="${name}">${content}</g>`;
  const skirt = `<path d="M158 355 Q199 370 242 355 L284 508 Q206 538 117 508Z" fill="${cloth}"/><path d="M166 363 145 509M186 369 177 518M211 370 213 521M234 365 258 514" fill="none" stroke="#591b29" stroke-opacity=".28" stroke-width="4"/><path d="M121 495 Q202 521 279 495L284 508Q205 538 117 508Z" fill="${gold}"/><path d="M159 353Q200 363 242 353L244 367Q199 379 155 365Z" fill="${gold}"/>`;
  const shirt = `<path d="M155 279Q175 270 181 271L219 271Q234 272 247 281L253 363Q199 380 148 363Z" fill="${cloth}"/><path d="M181 272Q198 300 219 272" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="4"/>`;
  const kurta = `<path d="M151 280 183 270 219 270 249 282 260 450Q203 462 140 450Z" fill="${cloth}"/><path d="M181 272 196 291 217 273M199 292V439" stroke="#6b2630" stroke-opacity=".35" fill="none" stroke-width="3"/><path d="M181 269 197 286 218 269 216 283 199 301 183 285Z" fill="${gold}"/>${[311,333,355].map(y=>`<circle cx="201" cy="${y}" r="3.2" fill="${gold}"/>`).join('')}`;
  const pants = `<path d="M156 350H242L233 501H207L199 403 190 501H162Z" fill="#446679"/><path d="M199 371V406M164 486H190M208 486H234" stroke="#86a0aa" stroke-width="5" fill="none"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560" role="img" aria-labelledby="${p}-title ${p}-desc" data-character="${p}" data-look="wedding" data-action="idle">
<title id="${p}-title">${girl?'Prachi':'Pratik'} · layered character</title><desc id="${p}-desc">A warm paper-cut inspired character with interchangeable wedding, haldi, casual and gym clothes. Separate head, eyes, arms and body for animation.</desc>
<defs>
<linearGradient id="${p}-skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffdfb7"/><stop offset=".65" stop-color="#ecc098"/><stop offset="1" stop-color="#cd8c69"/></linearGradient>
<linearGradient id="${p}-hair" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${girl?'#644537':'#403730'}"/><stop offset=".6" stop-color="${girl?'#3e2a24':'#272521'}"/><stop offset="1" stop-color="#201c1a"/></linearGradient>
<linearGradient id="${p}-cloth" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="var(--fabric-light,#df5545)"/><stop offset=".5" stop-color="var(--fabric,#b72e35)"/><stop offset="1" stop-color="var(--fabric-dark,#801e2c)"/></linearGradient>
<linearGradient id="${p}-gold"><stop stop-color="#b98642"/><stop offset=".45" stop-color="#f2d895"/><stop offset="1" stop-color="#c29a54"/></linearGradient>
<radialGradient id="${p}-blush"><stop stop-color="#db725f" stop-opacity=".58"/><stop offset="1" stop-color="#db725f" stop-opacity="0"/></radialGradient>
<filter id="${p}-depth" x="-20%" y="-15%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#4b2920" flood-opacity=".18"/></filter>
</defs>
<style>
[data-character="${p}"]{--fabric:#b72e35;--fabric-light:#df5545;--fabric-dark:#801e2c}
[data-character="${p}"][data-look="haldi"]{--fabric:#eeb525;--fabric-light:#ffdb59;--fabric-dark:#c58b13}
[data-character="${p}"][data-look="casual"]{--fabric:${girl?'#338b66':'#4c799e'};--fabric-light:${girl?'#60b58b':'#80a5be'};--fabric-dark:${girl?'#19593e':'#31546e'}}
[data-character="${p}"][data-look="gym"]{--fabric:${girl?'#d7658c':'#77549b'};--fabric-light:${girl?'#f39abb':'#a381bd'};--fabric-dark:${girl?'#a73f65':'#503a70'}}
[data-character="${p}"] [data-outfit]{display:none}
${['wedding','haldi','casual','gym'].map(n=>`[data-character="${p}"][data-look="${n}"] [data-outfit="${n}"]{display:inline}`).join('\n')}
[data-character="${p}"] [data-part="head"]{transform-origin:200px 268px}
[data-character="${p}"] [data-part="arm-left"]{transform-origin:155px 286px}
[data-character="${p}"] [data-part="arm-right"]{transform-origin:245px 286px}
[data-character="${p}"] [data-part="namaste-arms"]{display:none}
[data-character="${p}"][data-action="namaste"] [data-part="arm-left"],
[data-character="${p}"][data-action="namaste"] [data-part="arm-right"]{display:none}
[data-character="${p}"][data-action="namaste"] [data-part="namaste-arms"]{display:inline}
[data-character="${p}"][data-action="namaste"] [data-part="head"]{animation:${p}-namaste 2.8s ease-in-out infinite}
[data-character="${p}"][data-action="wave"] [data-part="arm-right"]{animation:${p}-wave 1.2s ease-in-out infinite}
[data-character="${p}"][data-action="celebrate"] [data-part="body"]{animation:${p}-bounce .75s ease-in-out infinite}
[data-character="${p}"][data-action="celebrate"] [data-part="arm-left"]{transform:rotate(135deg)}
[data-character="${p}"][data-action="celebrate"] [data-part="arm-right"]{transform:rotate(-135deg)}
[data-character="${p}"][data-action="nod"] [data-part="head"]{animation:${p}-nod 1.2s ease-in-out infinite}
@keyframes ${p}-wave{0%,100%{transform:rotate(-140deg)}50%{transform:rotate(-115deg)}}
@keyframes ${p}-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes ${p}-nod{0%,100%{transform:rotate(0)}50%{transform:rotate(7deg)}}
@keyframes ${p}-namaste{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(3px) rotate(${girl?'-2':'2'}deg)}}
@media(prefers-reduced-motion:reduce){[data-character="${p}"] *{animation:none!important}}
</style>
<ellipse data-part="shadow" cx="200" cy="527" rx="88" ry="12" fill="#553d31" opacity=".12"/>
<g data-part="body" filter="url(#${p}-depth)">
${girl?`<g data-part="hair-back"><path d="M107 119Q97 52 177 49Q250 29 287 97Q311 144 285 209Q286 242 306 280Q289 327 254 327L140 329Q99 308 98 278Q83 248 101 213Z" fill="${hair}"/><path d="M116 131Q95 212 122 245T119 307M274 132Q297 196 274 231T286 298" fill="none" stroke="#88604a" stroke-opacity=".3" stroke-width="6"/></g>`:''}
<g data-part="leg-left"><path d="M158 411H195L188 510H161Z" fill="${skin}"/><path d="M159 503Q174 511 189 501L192 518Q163 532 143 523Q143 513 159 503" fill="#322b27"/></g>
<g data-part="leg-right"><path d="M205 411H241L239 510H211Z" fill="${skin}"/><path d="M211 502Q224 511 239 503Q256 511 257 523Q234 531 208 518Z" fill="#322b27"/></g>
<g data-part="neck"><path d="M181 244H217L222 282Q199 302 177 281Z" fill="${skin}"/><path d="M181 249Q201 268 217 251V268Q199 281 181 266Z" fill="#ae6b50" opacity=".3"/></g>
<g data-part="wardrobe">
${outfit('wedding',girl?shirt+skirt+`<path d="M232 278 248 287Q218 359 132 433L120 415Q202 347 232 278Z" fill="${cloth}"/><path d="M240 282Q212 350 125 425" stroke="${gold}" stroke-width="5" fill="none"/>`:`<path d="M158 418H241L235 503H210L199 458 190 503H164Z" fill="#e1d0ad"/>`+kurta+`<path d="M155 282 168 277 160 430 146 430ZM231 277 246 282 252 430 239 430Z" fill="${gold}" opacity=".7"/>`)}
${outfit('haldi',girl?shirt+skirt: `<path d="M157 419H241L235 503H209L199 454 190 503H164Z" fill="#d0cbbb"/>`+kurta)}
${outfit('casual',pants+shirt+(girl?`<path d="M176 272Q198 291 224 272L231 288 218 306 199 291 183 306 169 288Z" fill="${cloth}" stroke="#256348" stroke-width="2"/><path d="M193 294V323M209 294V323M170 340Q199 351 228 340" fill="none" stroke="#b4d8bf" stroke-width="3"/>`:`<path d="M180 271 198 288 188 301 173 278M218 271 200 288 211 301 227 279" fill="#93b2c4"/><path d="M200 291V364M217 309H237V331Q227 337 217 331Z" fill="none" stroke="#284d69" stroke-width="2"/>`))}
${outfit('gym',`<path d="M155 351H243L236 421H208L199 383 190 421H159Z" fill="#303039"/><path d="M234 363V415" stroke="${cloth}" stroke-width="5"/>`+shirt)}
</g>
${[false,true].map(right=>`<g data-part="arm-${right?'right':'left'}">${right?`<path d="M242 282Q259 283 265 308L278 361Q279 379 267 384Q257 384 255 368L240 325Z" fill="${skin}"/><path d="M256 363Q250 363 249 372L253 383" stroke="#d9a078" stroke-width="5" fill="none" stroke-linecap="round"/>`:`<path d="M158 282Q141 283 135 308L122 361Q121 379 133 384Q143 384 145 368L160 325Z" fill="${skin}"/><path d="M144 363Q150 363 151 372L147 383" stroke="#d9a078" stroke-width="5" fill="none" stroke-linecap="round"/>`}
<path d="${right?'M239 279Q259 279 267 309L244 319 232 291Z':'M161 279Q141 279 133 309L156 319 168 291Z'}" fill="${cloth}"/><path d="${right?'M246 315 265 308':'M154 315 135 308'}" stroke="#fff" opacity=".2" stroke-width="3"/>
${girl?`<g data-outfit="wedding"><path d="${right?'M255 354 275 349M256 360 277 355':'M145 354 125 349M144 360 123 355'}" stroke="${gold}" stroke-width="4"/></g>`:''}</g>`).join('')}
<g data-part="namaste-arms">
  <path d="M156 290Q151 320 171 342M244 290Q249 320 229 342" fill="none" stroke="${cloth}" stroke-width="27" stroke-linecap="round"/>
  <path d="M171 339Q184 331 194 318M229 339Q216 331 206 318" fill="none" stroke="${skin}" stroke-width="16" stroke-linecap="round"/>
  <path d="M194 344Q192 324 196 300Q200 291 204 300Q208 324 206 344Q200 353 194 344Z" fill="${skin}" stroke="#c98c69" stroke-width="1.5"/>
  <path d="M200 303V344" stroke="#c98c69" stroke-width="1.5" opacity=".65"/>
  ${girl?`<path d="M181 331 188 325M213 325 220 332" stroke="${gold}" stroke-width="4"/>`:''}
</g>
<g data-part="head">
<ellipse cx="112" cy="176" rx="17" ry="25" fill="${skin}"/><ellipse cx="288" cy="176" rx="17" ry="25" fill="${skin}"/>
<path d="M117 112Q117 67 201 65Q283 66 283 124L280 202Q272 258 202 272Q131 264 118 211Z" fill="${skin}"/>
<path d="M126 185Q125 234 160 250" stroke="#fff1d5" stroke-opacity=".25" stroke-width="5" fill="none"/>
<ellipse cx="146" cy="211" rx="29" ry="20" fill="url(#${p}-blush)"/><ellipse cx="256" cy="211" rx="29" ry="20" fill="url(#${p}-blush)"/>
${girl?'':`<path d="M117 190Q127 226 148 229Q159 209 178 220Q200 233 224 220Q242 211 254 230Q274 217 282 188L278 224Q269 263 202 277Q138 269 123 238Z" fill="${hair}"/><path d="M167 232Q199 215 235 233Q224 260 200 259Q178 258 167 232" fill="${skin}"/>`}
<g data-part="brows" fill="${hair}"><path d="M136 143Q151 130 173 136Q179 138 176 146Q152 142 137 150Z"/><path d="M224 137Q248 130 265 145L264 151Q241 143 224 147Q219 144 224 137Z"/></g>
<g data-part="eyes">
${[156,243].map(x=>`<g data-part="eye-${x===156?'left':'right'}"><ellipse cx="${x}" cy="177" rx="25" ry="29" fill="#fff7e8" stroke="#bd9277" stroke-width="2"/><g data-part="pupil"><ellipse cx="${x+3}" cy="178" rx="15" ry="20" fill="#634132"/><ellipse cx="${x+5}" cy="179" rx="10" ry="15" fill="#292321"/><circle cx="${x+9}" cy="170" r="5" fill="#fff"/><circle cx="${x}" cy="186" r="2" fill="#fff" opacity=".5"/></g>${girl?`<path d="M${x-24} 169Q${x} 143 ${x+25} 166L${x+30} 157" fill="none" stroke="#3a2824" stroke-width="5" stroke-linecap="round"/>`:''}</g>`).join('')}
</g>
<path data-part="nose" d="M199 179 192 210Q201 216 208 209" fill="#d39170" stroke="#bd7e61" stroke-width="2" stroke-linejoin="round"/>
<g data-part="mouth"><path d="M176 228Q199 238 224 227Q218 250 200 251Q183 249 176 228Z" fill="#873e32"/><path d="M181 230Q200 235 219 230L215 237Q198 242 185 236Z" fill="#fff9e9"/><path d="M190 246Q201 238 211 246Q201 252 190 246Z" fill="#de8b7a"/></g>
${girl?`<g data-part="nose-ring"><path d="M210 204A7 7 0 1 1 202 214" fill="none" stroke="${gold}" stroke-width="3"/><circle cx="211" cy="204" r="2.4" fill="#fff2c1"/></g><path data-part="hair-front" d="M110 160Q93 100 131 68Q170 40 202 59Q254 42 282 88Q300 124 282 179Q270 128 245 115Q218 100 205 85Q200 110 165 124Q132 136 123 185L116 222Q94 187 110 160Z" fill="${hair}"/><path d="M199 67Q186 103 155 116Q117 133 115 177M218 70Q246 74 264 108" stroke="#946d54" stroke-opacity=".32" stroke-width="3" fill="none"/><g data-outfit="wedding"><circle cx="199" cy="127" r="4" fill="#a62d33"/><path d="M118 199V214M282 198V213" stroke="${gold}" stroke-width="3"/><circle cx="118" cy="219" r="6" fill="${gold}"/><circle cx="282" cy="218" r="6" fill="${gold}"/></g>`:`<g data-part="hair-front"><path d="M113 157Q94 111 115 84L104 84 127 61 116 54Q157 53 175 33L170 24Q209 34 220 33L217 25Q287 44 278 101Q298 113 284 159L270 145 268 117Q248 121 231 104Q177 115 145 89Q123 107 126 146Z" fill="${hair}"/><path d="M126 63Q181 43 231 104M174 39Q239 46 258 99" fill="none" stroke="#716052" stroke-opacity=".35" stroke-width="3"/></g><g data-part="glasses" fill="#ffffff" fill-opacity=".08" stroke="#4e3a2d" stroke-width="7" stroke-linejoin="round"><path d="M119 157Q146 149 181 158L178 187Q174 208 151 208Q125 208 122 188Z"/><path d="M216 158Q248 149 277 158L274 187Q271 209 245 208Q220 208 217 187Z"/><path d="M181 164Q199 157 216 164M119 160 108 157M277 161 290 158" fill="none"/></g>`}
</g></g></svg>`;
}
for (const person of ['prachi','pratik']) writeFileSync(new URL(`${person}.svg`,out),character(person));
console.log('Built Prachi and Pratik SVG rigs.');
