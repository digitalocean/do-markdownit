const md = require('markdown-it')().use(require('./dns'));

it('handles dns embeds (not inline)', () => {
  expect(md.render('[dns digitalocean.com]')).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>
<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
`);
});

it('handles dns embeds with no domain (no embed)', () => {
  expect(md.render('[dns  ]')).toBe(`<p>[dns  ]</p>
`);
});

it('handles dns embeds with a single record', () => {
  expect(md.render('[dns digitalocean.com MX]')).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="MX">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>
<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
`);
});

it('handles dns embeds with multiple records', () => {
  expect(md.render('[dns digitalocean.com A AAAA]')).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A,AAAA">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>
<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
`);
});

it('only injects script once with multiple embeds', () => {
  expect(md.render('[dns digitalocean.com A AAAA]\n\nhello\n\n[dns ondigitalocean.app A]')).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A,AAAA">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>
<p>hello</p>
<div data-dns-tool-embed data-dns-domain="ondigitalocean.app" data-dns-types="A">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=ondigitalocean.app" target="_blank">
        Perform a full DNS lookup for ondigitalocean.app
    </a>
</div>
<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
`);
});

it('injects the script at the end of the document', () => {
  expect(md.render('[dns digitalocean.com A AAAA]\n\nhello')).toBe(`<div data-dns-tool-embed data-dns-domain="digitalocean.com" data-dns-types="A,AAAA">
    <a href="https://www.digitalocean.com/community/tools/dns?domain=digitalocean.com" target="_blank">
        Perform a full DNS lookup for digitalocean.com
    </a>
</div>
<p>hello</p>
<script async defer src="https://do-community.github.io/dns-tool-embed/bundle.js" type="text/javascript" onload="window.DNSToolEmbeds()"></script>
`);
});
