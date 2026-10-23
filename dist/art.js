const ink = "#292c25";
export const svg = (body, box = "0 0 360 194") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" aria-hidden="true">${body}</svg>`;
export function cup() {
  return svg(
    `<path d="M40 17q-9-12 0-21M62 17q-9-12 0-21" stroke="${ink}" fill="none" stroke-width="3" stroke-linecap="round"/><path d="M21 25h64L75 87q-22 12-44 0Z" fill="#c7854b" stroke="${ink}" stroke-width="3"/><path d="M28 46h50M31 63h44M35 80h36" stroke="#8e542f" stroke-width="2"/><ellipse cx="53" cy="25" rx="32" ry="7" fill="#956035" stroke="${ink}" stroke-width="3"/>`,
    "0 -8 110 110",
  );
}
export function icon(name) {
  const paths = {
    back: '<path d="m11 4-7 7 7 7M4 11h17"/>',
    shuffle:
      '<path d="M3 5h3c5 0 6 12 11 12h4m-4-4 4 4-4 4M3 17h3c5 0 6-12 11-12h4m-4-4 4 4-4 4"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  };
  return svg(
    `<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</g>`,
    "0 0 24 24",
  );
}
export function food(name) {
  const b = {
    chai: `<path d="M31 20h47L70 78H40Z" fill="#b87a43" stroke="${ink}" stroke-width="3"/><ellipse cx="54" cy="20" rx="24" ry="5" fill="#6f452b" stroke="${ink}" stroke-width="3"/><path d="M39 38h31M42 56h26" stroke="#80522d" stroke-width="2"/>`,
    samosa: `<path d="M16 77 55 16 95 77q-40 11-79 0Z" fill="#e6b24d" stroke="${ink}" stroke-width="3"/><path d="m55 16 4 52 36 9" fill="none" stroke="#b37e29" stroke-width="2"/>`,
    ticket: `<path d="M12 25h87v17a11 11 0 0 0 0 22v17H12V64a11 11 0 0 0 0-22Z" fill="#d28c79" stroke="${ink}" stroke-width="3"/><path d="M75 26v53" stroke="${ink}" stroke-dasharray="4 4"/><path d="m37 42 18 11-18 11Z" fill="${ink}"/>`,
    shoe: `<path d="m23 31 22 13 18-3 9 16 25 8v14H13V59Z" fill="#8ca5ad" stroke="${ink}" stroke-width="3"/><path d="M14 69h82M47 48l10 7m-2-11 10 7" stroke="${ink}" stroke-width="3"/>`,
    phone: `<rect x="32" y="9" width="48" height="82" rx="8" fill="#434a43" stroke="${ink}" stroke-width="3"/><rect x="38" y="18" width="36" height="58" rx="2" fill="#b9d1b0"/><path d="M49 83h13" stroke="#b9d1b0" stroke-width="3"/>`,
    scooter: `<circle cx="29" cy="76" r="13" fill="#454a42"/><circle cx="85" cy="76" r="13" fill="#454a42"/><path d="M16 65h20l18-23h19l-6 25h25M65 42l-3-20H47M52 43H32" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M23 49h28v14H17Z" fill="#c88a62" stroke="${ink}" stroke-width="3"/>`,
    train: `<rect x="18" y="15" width="76" height="66" rx="12" fill="#5e8691" stroke="${ink}" stroke-width="3"/><rect x="28" y="26" width="56" height="25" rx="4" fill="#dce9d4" stroke="${ink}" stroke-width="2"/><path d="M18 60h76M39 81l-8 12m43-12 8 12" stroke="${ink}" stroke-width="3"/><circle cx="34" cy="69" r="4" fill="#edca61"/><circle cx="78" cy="69" r="4" fill="#edca61"/>`,
    shop: `<path d="M20 39h72v48H20Z" fill="#e0b177" stroke="${ink}" stroke-width="3"/><path d="m15 39 8-24h66l9 24Z" fill="#6c9c82" stroke="${ink}" stroke-width="3"/><path d="M34 17v21m22-21v21m22-21v21" stroke="#dce5c8" stroke-width="8"/><path d="M33 87V58h21v29m12-28h15v14H66Z" fill="#557467" stroke="${ink}" stroke-width="2"/>`,
    house: `<path d="m13 46 43-33 43 33M25 38v51h62V38" fill="#d19478" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M45 89V62h22v27M34 45h10v11H34m34-11h10v11H68" fill="#edd4a1" stroke="${ink}" stroke-width="2"/>`,
    roti: `<circle cx="56" cy="52" r="36" fill="#e3b96b" stroke="#b38340" stroke-width="2"/><g fill="#a66f32"><circle cx="42" cy="35" r="5"/><circle cx="63" cy="63" r="7"/><circle cx="70" cy="34" r="3"/><circle cx="35" cy="65" r="4"/><circle cx="54" cy="48" r="3"/></g>`,
    mango: `<path d="M72 23C35 4 8 43 33 75c19 24 52 3 52-23 0-13-4-22-13-29Z" fill="#e2ae32" stroke="${ink}" stroke-width="3"/><path d="M70 24q12-21 22-9-11 10-22 9Z" fill="#53785b" stroke="${ink}" stroke-width="2"/>`,
    ladoo: `<g fill="#dda93e" stroke="${ink}" stroke-width="2"><circle cx="35" cy="64" r="22"/><circle cx="77" cy="64" r="22"/><circle cx="56" cy="30" r="22"/></g><g fill="#ac7b24"><circle cx="30" cy="58" r="2"/><circle cx="42" cy="70" r="2"/><circle cx="70" cy="60" r="2"/><circle cx="83" cy="70" r="2"/><circle cx="50" cy="25" r="2"/><circle cx="65" cy="34" r="2"/></g>`,
    idli: `<ellipse cx="56" cy="64" rx="48" ry="23" fill="#91aa8b" stroke="${ink}" stroke-width="2"/><ellipse cx="37" cy="57" rx="22" ry="14" fill="#fff9dd" stroke="#b6b5a1" stroke-width="2"/><ellipse cx="73" cy="55" rx="22" ry="14" fill="#fff9dd" stroke="#b6b5a1" stroke-width="2"/><ellipse cx="55" cy="39" rx="22" ry="14" fill="#fff9dd" stroke="#b6b5a1" stroke-width="2"/>`,
    chilli: `<path d="M73 25q25 49-48 60 36-24 24-53Z" fill="#b9533d" stroke="${ink}" stroke-width="3"/><path d="m49 32 23-7-3-10" stroke="${ink}" stroke-width="4" fill="none"/>`,
  };
  return svg(b[name] || b.chai, "0 0 112 100");
}
export function scene(id) {
  const title = (a, b = "", color = ink) =>
    `<text x="24" y="48" font-family="Bricolage,Arial,sans-serif" font-weight="800" font-size="31" letter-spacing="-1" fill="${color}">${a}</text>${b ? `<text x="24" y="80" font-family="Bricolage,Arial,sans-serif" font-weight="800" font-size="31" letter-spacing="-1" fill="${color}">${b}</text>` : ""}`;
  const inner = (s) => s.replace(/<svg[^>]*>/, "").replace("</svg>", "");
  const art = {
    city: `<rect width="360" height="194" fill="#efce75"/>${title("City", "Tycoon")}<path d="M0 170h360" stroke="${ink}" stroke-width="2"/><g stroke="${ink}" stroke-width="2"><path d="M155 170V93h45v77" fill="#ca8664"/><path d="M196 170V59h55v111" fill="#e8aa79"/><path d="M246 170V110h45v60" fill="#6c947b"/><path d="M288 170V86h44v84" fill="#e9b65f"/><path d="m201 59 22-23 23 23" fill="#c98e54"/></g><g fill="#f5dfab">${[0, 1, 2].map((i) => `<path d="M209 ${75 + i * 25}h12v12h-12m18-12h12v12h-12M167 ${107 + i * 19}h10v8h-10m12-8h10v8h-10"/>`).join("")}<path d="M257 124h12v13h-12m20-13h7v13h-7M299 103h22v12h-22m0 13h22v12h-22"/></g><path d="M0 185h360" stroke="#a58545" stroke-width="2" stroke-dasharray="20 12"/><g transform="translate(40 110) rotate(-12)"><rect width="47" height="47" rx="7" fill="#fff6d9" stroke="${ink}" stroke-width="2"/><g fill="${ink}"><circle cx="13" cy="13" r="3"/><circle cx="34" cy="13" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="13" cy="34" r="3"/><circle cx="34" cy="34" r="3"/></g></g>`,
    spend: `<rect width="360" height="194" fill="#b7cba0"/>${title("Spend", "a Crore")}<g transform="translate(193 48) rotate(12 62 55)"><rect x="-8" y="28" width="135" height="88" rx="5" fill="#75966f" stroke="${ink}" stroke-width="2"/><rect x="-4" y="14" width="135" height="88" rx="5" fill="#88a97c" stroke="${ink}" stroke-width="2"/><rect width="135" height="88" rx="5" fill="#dce5c4" stroke="${ink}" stroke-width="2"/><rect x="9" y="9" width="117" height="70" rx="3" fill="none" stroke="#6b865e" stroke-width="2"/><circle cx="67" cy="44" r="27" fill="#b6cb9b"/><text x="67" y="58" font-family="Arial" font-size="39" font-weight="bold" text-anchor="middle" fill="${ink}">₹</text><path d="M16 44h13m75 0h14" stroke="#6b865e" stroke-width="3"/></g><g fill="#e0b951" stroke="${ink}" stroke-width="2"><ellipse cx="189" cy="172" rx="25" ry="8"/><ellipse cx="189" cy="166" rx="25" ry="8"/><ellipse cx="189" cy="160" rx="25" ry="8"/></g>`,
    cricket: `<rect width="360" height="194" fill="#b8d0db"/><path d="M0 137Q180 90 360 130V194H0Z" fill="#8fa883"/><path d="m150 194 35-82h40l43 82" fill="#d7bb88"/><path d="M185 134v-38m9 38V96m9 38V96m-20 0h22" stroke="${ink}" stroke-width="3"/>${title("Gully", "Cricket")}<g transform="rotate(27 282 103)"><path d="M277 24h12v50h-12" fill="#80583c" stroke="${ink}" stroke-width="2"/><rect x="267" y="69" width="32" height="102" rx="7" fill="#e8d1a2" stroke="${ink}" stroke-width="2"/><path d="M278 81v73" stroke="#b89360" stroke-width="3"/></g><circle cx="252" cy="143" r="15" fill="#b34f38" stroke="${ink}" stroke-width="2"/><path d="m249 130-2 25m8-24-2 25" stroke="#efd8b9" stroke-width="1.5"/>`,
    chai: `<rect width="360" height="194" fill="#c87946"/>${title("Chai", "Tapri", "#fff2cd")}<g transform="translate(198 30) scale(1.16)">${inner(cup())}</g><path d="M0 167h360v27H0Z" fill="#7b5135"/><path d="M10 176h340" stroke="#a77b54" stroke-width="2"/><g transform="translate(116 110) scale(.7)">${inner(food("samosa"))}</g>`,
    bargain: `<rect width="360" height="194" fill="#d7b59c"/>${title("Bargain", "Bazaar")}<g transform="translate(188 60)"><path d="M9 13h136M78 13v91m-59 4h118" stroke="${ink}" stroke-width="4" fill="none"/><circle cx="78" cy="13" r="6" fill="#eddab3" stroke="${ink}" stroke-width="2"/><path d="M32 15 8 63h48Zm92 0L99 63h49Z" fill="none" stroke="${ink}" stroke-width="2"/><path d="M7 64q25 34 50 0m41 0q25 34 50 0" fill="#ab7f4c" stroke="${ink}" stroke-width="2"/><path d="m24 100 20 17m-6-18-20 17" stroke="${ink}" stroke-width="2"/></g>`,
    dabba: `<rect width="360" height="194" fill="#bdc2d2"/>${title("Dabba", "Memory")}<g transform="translate(210 32) rotate(7 53 65)" stroke="${ink}" stroke-width="2"><path d="M35 19V6h35v13" fill="none" stroke-width="4"/><rect x="3" y="23" width="99" height="111" rx="17" fill="#8f9fa7"/><ellipse cx="52" cy="24" rx="49" ry="12" fill="#d4dcd6"/><path d="M3 61q48 23 99 0M3 96q48 24 99 0" fill="none"/><path d="M11 29v92m82-92v92" stroke="#5b6b74" stroke-width="5"/><path d="M20 43h60m-60 33h60m-60 33h60" stroke="#b4c2c5"/></g><path d="m174 122-18 17m-3-20 22 24" stroke="#606e86" stroke-width="3"/>`,
    roti: `<rect width="360" height="194" fill="#e9d6a8"/>${title("Perfect", "Roti")}<g transform="translate(174 20)"><path d="m98 117 49 45" stroke="${ink}" stroke-width="19" stroke-linecap="round"/><circle cx="75" cy="74" r="66" fill="#41473e" stroke="${ink}" stroke-width="3"/><g transform="translate(20 23)">${inner(food("roti"))}</g></g><path d="m29 143 94 12" stroke="#a77843" stroke-width="13" stroke-linecap="round"/><path d="m19 142 12 2m93 12 13 1" stroke="#775132" stroke-width="7" stroke-linecap="round"/>`,
    train: `<rect width="360" height="194" fill="#507d7b"/>${title("Train", "Window", "#f5efdb")}<defs><clipPath id="window-art"><rect x="180" y="20" width="156" height="158" rx="44"/></clipPath></defs><g clip-path="url(#window-art)"><rect x="175" y="15" width="166" height="170" fill="#c9dcda"/><circle cx="294" cy="57" r="19" fill="#ead386"/><path d="m160 132 68-59 55 49 60-48 19 80" fill="#84a78d"/><path d="M170 134q75-27 177-8v65H170Z" fill="#bcc789"/><path d="M171 160q68-25 178-8" stroke="#6b905c" stroke-width="13"/><path d="m191 188 155-26" stroke="#a38b57" stroke-width="10"/><path d="m205 188 140-23" stroke="#e5d1a0" stroke-width="2"/></g><rect x="178" y="18" width="160" height="162" rx="45" fill="none" stroke="#293f3d" stroke-width="7"/><path d="M178 113h160" stroke="#293f3d" stroke-width="5"/>`,
  };
  return svg(art[id] || art.chai);
}
