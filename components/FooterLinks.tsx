import React from "react";

export default function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-primary-30">{title}</h4>
      <ul>
        {links.map((link) => (
          <li key={link.name} className="mb-1">
            <a href={link.href}>{link.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
