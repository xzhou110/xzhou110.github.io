export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:[^)]+|mailto:[^)]+)\)/g, '<a href="$2">$1</a>');
// The attributes of a Get in Touch link. The owner's address is never written into a page, neither as text nor as a
// mailto link (owner, 2026-11-12). The link itself goes to LinkedIn, or to the home page's contact section, and the
// three parts of the address ride along as data; assets/site.js puts them together and opens an email only when
// someone clicks. links.mail is { user, tag, domain }; the tag says which site the message came from.
export const touchAttrs = (links) => {
  const mail = links.mail;
  return `href="${esc(links.linkedin || '/#contact')}"${mail ? ` data-mail-user="${esc(mail.user)}" data-mail-tag="${esc(mail.tag)}" data-mail-domain="${esc(mail.domain)}"` : ''}`;
};
