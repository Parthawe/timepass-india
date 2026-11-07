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
